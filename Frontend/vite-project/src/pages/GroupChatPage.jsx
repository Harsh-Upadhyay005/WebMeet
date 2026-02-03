import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StreamChat } from "stream-chat";
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import toast from "react-hot-toast";
import { 
  Video, 
  Users, 
  ArrowLeft, 
  Settings, 
  Pencil, 
  UserPlus, 
  UserMinus, 
  LogOut, 
  Trash2,
  X,
  Check,
  Loader2
} from "lucide-react";

import { 
  getStreamToken, 
  getGroupById, 
  updateGroup, 
  addGroupMembers, 
  removeGroupMember, 
  deleteGroup,
  getUserFriends 
} from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import ChatLoader from "../components/ChatLoader";
import LazyImage from "../components/LazyImage";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const GroupChatPage = () => {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMembers, setShowMembers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  
  // Edit form state
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [selectedNewMembers, setSelectedNewMembers] = useState([]);

  // Ref to track if component is mounted and prevent race conditions
  const isMountedRef = useRef(true);
  const isConnectingRef = useRef(false);

  const { authUser } = useAuthUser();

  // Fetch group details
  const { data: group, isLoading: loadingGroup, error: groupError } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => getGroupById(groupId),
    enabled: !!groupId,
  });

  // Check if current user is admin
  const isAdmin = authUser?._id === group?.admin?._id;

  // Fetch friends for adding members
  const { data: friends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    enabled: showAddMemberModal,
  });

  // Filter friends who are not already members
  const availableFriends = friends.filter(
    friend => !group?.members?.some(member => member._id === friend._id)
  );

  // Update group mutation
  const { mutate: updateGroupMutation, isPending: isUpdating } = useMutation({
    mutationFn: (data) => updateGroup(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group updated successfully!");
      setShowEditModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update group");
    },
  });

  // Add members mutation
  const { mutate: addMembersMutation, isPending: isAddingMembers } = useMutation({
    mutationFn: (memberIds) => addGroupMembers(groupId, memberIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Members added successfully!");
      setShowAddMemberModal(false);
      setSelectedNewMembers([]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add members");
    },
  });

  // Remove member mutation
  const { mutate: removeMemberMutation, isPending: isRemovingMember } = useMutation({
    mutationFn: (memberId) => removeGroupMember(groupId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Member removed successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to remove member");
    },
  });

  // Delete group mutation
  const { mutate: deleteGroupMutation, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group deleted successfully!");
      navigate("/groups");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete group");
    },
  });

  // Leave group mutation (remove self)
  const { mutate: leaveGroupMutation, isPending: isLeaving } = useMutation({
    mutationFn: () => removeGroupMember(groupId, authUser._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("You have left the group");
      navigate("/groups");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to leave group");
    },
  });

  // Fetch stream token
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    // Reset mounted ref on mount
    isMountedRef.current = true;

    const initGroupChat = async () => {
      if (!tokenData?.token || !authUser || !group) {
        setLoading(false);
        return;
      }

      // Prevent multiple simultaneous connection attempts
      if (isConnectingRef.current) {
        return;
      }
      isConnectingRef.current = true;

      try {
        console.log("Initializing group chat...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        // Check if already connected with same user
        if (client.userID && client.userID !== authUser._id) {
          await client.disconnectUser();
        }

        // Only connect if not already connected
        if (!client.userID) {
          const userImage = authUser.profilePic && !authUser.profilePic.startsWith('data:') 
            ? authUser.profilePic 
            : undefined;

          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: userImage,
            },
            tokenData.token
          );
        }

        // Check if component is still mounted
        if (!isMountedRef.current) {
          isConnectingRef.current = false;
          return;
        }

        console.log("User connected to Stream for group chat");

        // Use the group's stream channel ID
        const channelId = `group-${groupId}`;
        
        // Get all member IDs
        const memberIds = group.members.map(member => member._id);

        const currChannel = client.channel("messaging", channelId, {
          name: group.name,
          image: group.avatar,
          members: memberIds,
        });

        await currChannel.watch();

        // Check again if component is still mounted
        if (!isMountedRef.current) {
          isConnectingRef.current = false;
          return;
        }

        console.log("Group channel created and watching");

        setChatClient(client);
        setChannel(currChannel);
        setLoading(false);
        isConnectingRef.current = false;
      } catch (error) {
        console.error("Error initializing group chat:", error);
        if (isMountedRef.current) {
          toast.error("Could not connect to group chat. Please try again.");
          setLoading(false);
        }
        isConnectingRef.current = false;
      }
    };

    initGroupChat();

    return () => {
      isMountedRef.current = false;
      // Don't disconnect here - let the singleton persist
      // The client will be reused on re-navigation
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenData?.token, authUser?._id, group, groupId]);

  const handleGroupVideoCall = () => {
    if (channel && group) {
      const callUrl = `${window.location.origin}/group-call/${groupId}`;

      channel.sendMessage({
        text: `📹 I've started a group video call! Join here: ${callUrl}`,
      });

      toast.success("Group call link sent!");
      navigate(`/group-call/${groupId}`);
    }
  };

  const openEditModal = () => {
    setEditName(group?.name || "");
    setEditDescription(group?.description || "");
    setShowEditModal(true);
    setShowSettings(false);
  };

  const handleUpdateGroup = () => {
    if (!editName.trim()) {
      toast.error("Group name is required");
      return;
    }
    updateGroupMutation({
      name: editName.trim(),
      description: editDescription.trim(),
    });
  };

  const toggleNewMember = (friendId) => {
    setSelectedNewMembers(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleAddMembers = () => {
    if (selectedNewMembers.length === 0) {
      toast.error("Please select at least one member");
      return;
    }
    addMembersMutation(selectedNewMembers);
  };

  const handleRemoveMember = (memberId) => {
    if (memberId === authUser._id) {
      toast.error("Use 'Leave Group' to remove yourself");
      return;
    }
    removeMemberMutation(memberId);
  };

  if (groupError) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Group Not Found</h2>
          <p className="text-base-content/70 mb-4">
            This group doesn't exist or you're not a member.
          </p>
          <Link to="/groups" className="btn btn-primary">
            <ArrowLeft className="size-4" />
            Back to Groups
          </Link>
        </div>
      </div>
    );
  }

  if (loading || loadingGroup || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-[93vh] flex flex-col">
      {/* Custom Group Header */}
      <div className="bg-base-200 border-b border-base-300 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/groups" className="btn btn-ghost btn-sm btn-circle">
            <ArrowLeft className="size-5" />
          </Link>
          <div className="avatar w-10 h-10">
            <LazyImage 
              src={group?.avatar} 
              alt={group?.name}
              className="rounded-full w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold">{group?.name}</h3>
            <p className="text-xs text-base-content/60">
              {group?.members?.length} members
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            className="btn btn-ghost btn-sm btn-circle"
            onClick={() => setShowMembers(!showMembers)}
            title="View members"
          >
            <Users className="size-5" />
          </button>
          
          {/* Settings Dropdown */}
          <div className="dropdown dropdown-end">
            <button 
              tabIndex={0}
              className="btn btn-ghost btn-sm btn-circle"
              onClick={() => setShowSettings(!showSettings)}
              title="Group settings"
            >
              <Settings className="size-5" />
            </button>
            {showSettings && (
              <ul tabIndex={0} className="dropdown-content z-[100] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300">
                {isAdmin && (
                  <>
                    <li>
                      <button onClick={openEditModal} className="flex items-center gap-2">
                        <Pencil className="size-4" />
                        Edit Group
                      </button>
                    </li>
                    <li>
                      <button onClick={() => { setShowAddMemberModal(true); setShowSettings(false); }} className="flex items-center gap-2">
                        <UserPlus className="size-4" />
                        Add Members
                      </button>
                    </li>
                    <li className="border-t border-base-300 mt-1 pt-1">
                      <button onClick={() => { setShowDeleteConfirm(true); setShowSettings(false); }} className="flex items-center gap-2 text-error">
                        <Trash2 className="size-4" />
                        Delete Group
                      </button>
                    </li>
                  </>
                )}
                {!isAdmin && (
                  <li>
                    <button onClick={() => { setShowLeaveConfirm(true); setShowSettings(false); }} className="flex items-center gap-2 text-warning">
                      <LogOut className="size-4" />
                      Leave Group
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>

          <button 
            className="btn btn-primary btn-sm"
            onClick={handleGroupVideoCall}
            title="Start group call"
          >
            <Video className="size-4" />
            <span className="hidden sm:inline">Call</span>
          </button>
        </div>
      </div>

      {/* Members Sidebar */}
      {showMembers && (
        <div className="absolute right-0 top-16 w-72 bg-base-200 border-l border-base-300 h-[calc(100%-4rem)] z-50 p-4 overflow-y-auto shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Users className="size-4" />
              Members ({group?.members?.length})
            </h4>
            <button 
              className="btn btn-ghost btn-xs btn-circle"
              onClick={() => setShowMembers(false)}
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="space-y-2">
            {group?.members?.map((member) => (
              <div key={member._id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-base-300 group">
                <div className="avatar w-8 h-8">
                  <LazyImage 
                    src={member.profilePic} 
                    alt={member.fullName}
                    className="rounded-full w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{member.fullName}</p>
                  {member._id === group?.admin?._id && (
                    <span className="badge badge-primary badge-xs">Admin</span>
                  )}
                </div>
                {/* Remove member button (admin only, can't remove self or admin) */}
                {isAdmin && member._id !== authUser._id && member._id !== group?.admin?._id && (
                  <button
                    className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 text-error"
                    onClick={() => handleRemoveMember(member._id)}
                    disabled={isRemovingMember}
                    title="Remove member"
                  >
                    <UserMinus className="size-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Group Modal */}
      {showEditModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit Group</h3>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Group Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter group name"
                  className="input input-bordered w-full"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description (optional)</span>
                </label>
                <textarea
                  placeholder="Enter group description"
                  className="textarea textarea-bordered w-full"
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleUpdateGroup}
                disabled={isUpdating}
              >
                {isUpdating ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                Save Changes
              </button>
            </div>
          </div>
          <div className="modal-backdrop bg-black/50" onClick={() => setShowEditModal(false)} />
        </div>
      )}

      {/* Add Members Modal */}
      {showAddMemberModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Add Members</h3>
            {availableFriends.length === 0 ? (
              <p className="text-base-content/70 text-center py-4">
                All your friends are already in this group or you have no friends to add.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableFriends.map((friend) => (
                  <div
                    key={friend._id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedNewMembers.includes(friend._id)
                        ? "bg-primary/20 border border-primary"
                        : "bg-base-200 hover:bg-base-300"
                    }`}
                    onClick={() => toggleNewMember(friend._id)}
                  >
                    <div className="avatar w-10 h-10">
                      <LazyImage
                        src={friend.profilePic}
                        alt={friend.fullName}
                        className="rounded-full w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{friend.fullName}</p>
                    </div>
                    {selectedNewMembers.includes(friend._id) && (
                      <Check className="size-5 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => { setShowAddMemberModal(false); setSelectedNewMembers([]); }}>
                Cancel
              </button>
              {availableFriends.length > 0 && (
                <button 
                  className="btn btn-primary"
                  onClick={handleAddMembers}
                  disabled={isAddingMembers || selectedNewMembers.length === 0}
                >
                  {isAddingMembers ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
                  Add ({selectedNewMembers.length})
                </button>
              )}
            </div>
          </div>
          <div className="modal-backdrop bg-black/50" onClick={() => { setShowAddMemberModal(false); setSelectedNewMembers([]); }} />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Delete Group</h3>
            <p className="py-4">
              Are you sure you want to delete "{group?.name}"? This action cannot be undone.
              All messages and group data will be permanently removed.
            </p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-error"
                onClick={() => deleteGroupMutation()}
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                Delete Group
              </button>
            </div>
          </div>
          <div className="modal-backdrop bg-black/50" onClick={() => setShowDeleteConfirm(false)} />
        </div>
      )}

      {/* Leave Confirmation Modal */}
      {showLeaveConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-warning">Leave Group</h3>
            <p className="py-4">
              Are you sure you want to leave "{group?.name}"? You'll need to be added again by an admin to rejoin.
            </p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setShowLeaveConfirm(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-warning"
                onClick={() => leaveGroupMutation()}
                disabled={isLeaving}
              >
                {isLeaving ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
                Leave Group
              </button>
            </div>
          </div>
          <div className="modal-backdrop bg-black/50" onClick={() => setShowLeaveConfirm(false)} />
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <Chat client={chatClient}>
          <Channel channel={channel}>
            <Window>
              <MessageList />
              <MessageInput focus />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
};

export default GroupChatPage;
