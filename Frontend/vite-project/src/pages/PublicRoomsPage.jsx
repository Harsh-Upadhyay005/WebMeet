import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPublicRooms, createRoom, joinRoom } from "../lib/api";
import { Video, Users, Globe, Plus, Clock, Copy, Check, Lock, Shield } from "lucide-react";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";

const PublicRoomsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxParticipants: 100,
    tags: [],
    password: "",
    waitingRoomEnabled: false,
    recordingEnabled: false,
    allowScreenSharing: true,
    muteParticipantsOnEntry: false,
  });

  const { data: rooms, isLoading } = useQuery({
    queryKey: ["publicRooms"],
    queryFn: getPublicRooms,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const createRoomMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: (data) => {
      toast.success("Meeting created successfully!");
      queryClient.invalidateQueries(["publicRooms"]);
      setShowCreateModal(false);
      // Navigate to the call page
      navigate(`/room/${data.room.roomId}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create meeting");
    },
  });

  const joinRoomMutation = useMutation({
    mutationFn: joinRoom,
    onSuccess: (data) => {
      toast.success("Joined meeting successfully!");
      navigate(`/room/${data.room.roomId}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to join meeting");
    },
  });

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Meeting name is required");
      return;
    }
    createRoomMutation.mutate({
      ...formData,
      meetingType: 'instant',
      isPublic: true,
    });
  };

  const handleJoinRoom = (roomId, hasPassword) => {
    if (hasPassword) {
      // Show password prompt
      const password = prompt("This meeting is password protected. Enter password:");
      if (!password) return;
      joinRoomMutation.mutate({ roomId, password });
    } else {
      joinRoomMutation.mutate({ roomId });
    }
  };

  const copyRoomCode = (roomCode) => {
    navigator.clipboard.writeText(roomCode);
    toast.success("Meeting code copied!");
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                <Globe className="inline-block w-8 h-8 mr-2 text-primary" />
                Public Meetings
              </h1>
              <p className="text-base-content/60">
                Join open meetings or start your own instant meeting
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary gap-2"
            >
              <Plus className="w-5 h-5" />
              New Meeting
            </button>
          </div>
        </div>

        {/* Rooms Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : rooms && rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="card bg-base-100 border border-base-300 hover:border-primary/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="card-body">
                  {/* Room Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="card-title text-lg mb-1 flex items-center gap-2">
                        {room.name}
                        {room.password && <Lock className="w-4 h-4 text-warning" />}
                        {room.waitingRoomEnabled && <Shield className="w-4 h-4 text-info" />}
                      </h3>
                      <p className="text-sm text-base-content/60 line-clamp-2">
                        {room.description || "No description"}
                      </p>
                    </div>
                    <div className="badge badge-primary badge-sm">
                      {room.participants?.length || 0}/{room.maxParticipants}
                    </div>
                  </div>

                  {/* Meeting Code */}
                  <div className="bg-base-200 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-base-content/60 mb-1">Meeting Code</p>
                        <p className="font-mono font-bold text-lg tracking-wider">
                          {room.roomCode}
                        </p>
                      </div>
                      <button
                        onClick={() => copyRoomCode(room.roomCode)}
                        className="btn btn-ghost btn-sm btn-circle"
                        title="Copy code"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Room Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-secondary" />
                      <span className="text-base-content/70">
                        Host: {room.creator?.fullName || "Anonymous"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-accent" />
                      <span className="text-base-content/70">
                        {getTimeAgo(room.createdAt)}
                      </span>
                    </div>
                    {room.waitingRoomEnabled && (
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-info" />
                        <span className="text-base-content/70">
                          Waiting room enabled
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {room.tags && room.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {room.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="badge badge-sm badge-ghost">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Join Button */}
                  <button
                    onClick={() => handleJoinRoom(room.roomId, room.hasPassword)}
                    disabled={
                      room.participants?.length >= room.maxParticipants ||
                      joinRoomMutation.isPending
                    }
                    className="btn btn-primary btn-sm w-full gap-2"
                  >
                    <Video className="w-4 h-4" />
                    {room.participants?.length >= room.maxParticipants
                      ? "Meeting Full"
                      : "Join Meeting"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Video className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
            <h3 className="text-xl font-semibold mb-2">No Active Meetings</h3>
            <p className="text-base-content/60 mb-6">
              Be the first to create a public meeting!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary gap-2"
            >
              <Plus className="w-5 h-5" />
              Create First Meeting
            </button>
          </div>
        )}

        {/* Create Room Modal */}
        {showCreateModal && (
          <div className="modal modal-open">
            <div className="modal-box max-w-lg">
              <h3 className="font-bold text-2xl mb-6">Create Instant Meeting</h3>
              <form onSubmit={handleCreateRoom} className="space-y-4">
                {/* Room Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Meeting Name *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Team Standup"
                    className="input input-bordered w-full"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Description */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Description</span>
                  </label>
                  <textarea
                    placeholder="What's this meeting about?"
                    className="textarea textarea-bordered w-full h-20"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* Max Participants */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Max Participants
                    </span>
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="500"
                    className="input input-bordered w-full"
                    value={formData.maxParticipants}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxParticipants: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                {/* Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Password (Optional)</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Leave empty for no password"
                    className="input input-bordered w-full"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>

                {/* Security Options */}
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Enable waiting room</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={formData.waitingRoomEnabled}
                      onChange={(e) =>
                        setFormData({ ...formData, waitingRoomEnabled: e.target.checked })
                      }
                    />
                  </label>
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">
                      Host must admit participants before they can join
                    </span>
                  </label>
                </div>

                {/* Other Options */}
                <div className="space-y-2">
                  <label className="label cursor-pointer">
                    <span className="label-text">Allow screen sharing</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={formData.allowScreenSharing}
                      onChange={(e) =>
                        setFormData({ ...formData, allowScreenSharing: e.target.checked })
                      }
                    />
                  </label>
                  
                  <label className="label cursor-pointer">
                    <span className="label-text">Mute participants on entry</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={formData.muteParticipantsOnEntry}
                      onChange={(e) =>
                        setFormData({ ...formData, muteParticipantsOnEntry: e.target.checked })
                      }
                    />
                  </label>
                </div>

                {/* Tags */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Tags (comma separated)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., team, standup, casual"
                    className="input input-bordered w-full"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter((tag) => tag),
                      })
                    }
                  />
                </div>

                {/* Buttons */}
                <div className="modal-action">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setShowCreateModal(false)}
                    disabled={createRoomMutation.isPending}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={createRoomMutation.isPending}
                  >
                    {createRoomMutation.isPending ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      "Create Meeting"
                    )}
                  </button>
                </div>
              </form>
            </div>
            <div
              className="modal-backdrop"
              onClick={() => setShowCreateModal(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicRoomsPage;
