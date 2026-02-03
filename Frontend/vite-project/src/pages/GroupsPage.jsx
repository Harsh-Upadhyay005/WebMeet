import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { 
  Users, 
  Plus, 
  MessageCircle, 
  Video, 
  Settings,
  X,
  Check,
  Loader2
} from "lucide-react";
import toast from "react-hot-toast";

import { createGroup, getMyGroups, getUserFriends } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import LazyImage from "../components/LazyImage";

const GroupsPage = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Fetch user's groups
  const { data: groups = [], isLoading: loadingGroups } = useQuery({
    queryKey: ["groups"],
    queryFn: getMyGroups,
  });

  // Fetch friends for group creation
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  // Create group mutation
  const { mutate: createGroupMutation, isPending: isCreating } = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group created successfully! 🎉");
      resetModal();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create group");
    },
  });

  const resetModal = () => {
    setShowCreateModal(false);
    setGroupName("");
    setGroupDescription("");
    setSelectedMembers([]);
  };

  const toggleMember = (friendId) => {
    setSelectedMembers(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }
    if (selectedMembers.length < 1) {
      toast.error("Please select at least one member");
      return;
    }
    createGroupMutation({
      name: groupName.trim(),
      description: groupDescription.trim(),
      memberIds: selectedMembers,
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
              <Users className="size-8 text-primary" />
              Your Groups
            </h1>
            <p className="text-base-content/70 mt-1">
              Create and manage group conversations
            </p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="size-5" />
            Create Group
          </button>
        </div>

        {/* Groups List */}
        {loadingGroups ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : groups.length === 0 ? (
          <div className="card bg-base-200 p-8 text-center">
            <Users className="size-16 mx-auto text-base-content/30 mb-4" />
            <h3 className="font-semibold text-lg mb-2">No groups yet</h3>
            <p className="text-base-content/70 mb-4">
              Create a group to start chatting with multiple friends at once!
            </p>
            <button 
              className="btn btn-primary btn-sm mx-auto"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="size-4" />
              Create Your First Group
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {groups.map((group) => (
              <GroupCard key={group._id} group={group} authUser={authUser} />
            ))}
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={resetModal}
            >
              <X className="size-4" />
            </button>
            
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Users className="size-5 text-primary" />
              Create New Group
            </h3>

            <div className="space-y-4">
              {/* Group Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Group Name *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Enter group name..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  maxLength={50}
                />
              </div>

              {/* Group Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="What's this group about? (optional)"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  maxLength={200}
                  rows={2}
                />
              </div>

              {/* Select Members */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Select Members * ({selectedMembers.length} selected)
                  </span>
                </label>
                <div className="max-h-48 overflow-y-auto border border-base-300 rounded-lg p-2 space-y-2">
                  {loadingFriends ? (
                    <div className="flex justify-center py-4">
                      <span className="loading loading-spinner" />
                    </div>
                  ) : friends.length === 0 ? (
                    <p className="text-center text-base-content/70 py-4">
                      Add some friends first to create a group!
                    </p>
                  ) : (
                    friends.map((friend) => (
                      <div
                        key={friend._id}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedMembers.includes(friend._id)
                            ? "bg-primary/20 border border-primary"
                            : "hover:bg-base-200"
                        }`}
                        onClick={() => toggleMember(friend._id)}
                      >
                        <div className="avatar w-10 h-10">
                          <LazyImage 
                            src={friend.profilePic} 
                            alt={friend.fullName}
                            className="rounded-full w-full h-full object-cover"
                          />
                        </div>
                        <span className="flex-1 font-medium">{friend.fullName}</span>
                        {selectedMembers.includes(friend._id) && (
                          <Check className="size-5 text-primary" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="modal-action">
              <button className="btn btn-ghost" onClick={resetModal}>
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleCreateGroup}
                disabled={isCreating || !groupName.trim() || selectedMembers.length < 1}
              >
                {isCreating ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Plus className="size-4" />
                )}
                Create Group
              </button>
            </div>
          </div>
          <div className="modal-backdrop bg-black/50" onClick={resetModal} />
        </div>
      )}
    </div>
  );
};

// Group Card Component
const GroupCard = ({ group, authUser }) => {
  const isAdmin = group.admin._id === authUser?._id;
  const memberCount = group.members.length;

  return (
    <div className="card bg-base-200 hover:shadow-lg transition-all duration-300">
      <div className="card-body p-4">
        {/* Group Avatar & Name */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar w-12 h-12">
            <LazyImage 
              src={group.avatar} 
              alt={group.name}
              className="rounded-full w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{group.name}</h3>
            <p className="text-xs text-base-content/60">
              {memberCount} member{memberCount !== 1 ? 's' : ''}
              {isAdmin && <span className="badge badge-primary badge-xs ml-2">Admin</span>}
            </p>
          </div>
        </div>

        {/* Description */}
        {group.description && (
          <p className="text-sm text-base-content/70 line-clamp-2 mb-3">
            {group.description}
          </p>
        )}

        {/* Member Avatars */}
        <div className="flex -space-x-2 mb-3">
          {group.members.slice(0, 5).map((member) => (
            <div key={member._id} className="avatar w-8 h-8 border-2 border-base-200 rounded-full">
              <LazyImage 
                src={member.profilePic} 
                alt={member.fullName}
                className="rounded-full w-full h-full object-cover"
              />
            </div>
          ))}
          {memberCount > 5 && (
            <div className="avatar placeholder w-8 h-8 border-2 border-base-200 rounded-full bg-base-300">
              <span className="text-xs">+{memberCount - 5}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link 
            to={`/group-chat/${group._id}`} 
            className="btn btn-primary btn-sm flex-1"
          >
            <MessageCircle className="size-4" />
            Chat
          </Link>
          <Link 
            to={`/group-call/${group._id}`} 
            className="btn btn-secondary btn-sm flex-1"
          >
            <Video className="size-4" />
            Call
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;
