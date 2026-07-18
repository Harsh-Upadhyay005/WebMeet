import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRoom, getMyRooms } from "../lib/api";
import { Calendar, Clock, Video, Copy, Check, Lock, Shield, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";

const ScheduleMeetingPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();
  const [copiedCode, setCopiedCode] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    scheduledTime: "",
    duration: 60,
    maxParticipants: 100,
    password: "",
    waitingRoomEnabled: false,
    recordingEnabled: false,
    allowScreenSharing: true,
    muteParticipantsOnEntry: false,
    allowParticipantsToUnmute: true,
    tags: [],
    isPublic: true,
  });

  // Fetch user's scheduled meetings
  const { data: myMeetings, isLoading } = useQuery({
    queryKey: ["myRooms"],
    queryFn: getMyRooms,
  });

  const createMeetingMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: (data) => {
      toast.success("Meeting scheduled successfully!");
      queryClient.invalidateQueries(["myRooms"]);
      // Reset form
      setFormData({
        name: "",
        description: "",
        scheduledTime: "",
        duration: 60,
        maxParticipants: 100,
        password: "",
        waitingRoomEnabled: false,
        recordingEnabled: false,
        allowScreenSharing: true,
        muteParticipantsOnEntry: false,
        allowParticipantsToUnmute: true,
        tags: [],
        isPublic: true,
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to schedule meeting");
    },
  });

  const handleScheduleMeeting = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Meeting name is required");
      return;
    }
    
    if (!formData.scheduledTime) {
      toast.error("Please select date and time");
      return;
    }

    // Check if scheduled time is in the future
    const scheduledDate = new Date(formData.scheduledTime);
    if (scheduledDate <= new Date()) {
      toast.error("Scheduled time must be in the future");
      return;
    }

    createMeetingMutation.mutate({
      ...formData,
      meetingType: 'scheduled',
      isScheduled: true,
    });
  };

  const copyMeetingCode = (roomCode) => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(roomCode);
    toast.success("Meeting code copied!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const copyInviteLink = (roomCode) => {
    const inviteLink = `${window.location.origin}/join/${roomCode}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied!");
  };

  const startMeeting = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); // Minimum 5 minutes from now
    return now.toISOString().slice(0, 16);
  };

  // Separate meetings into upcoming and instant
  const instantMeetings = myMeetings?.filter(m => m.meetingType === 'instant') || [];
  const scheduledMeetings = myMeetings?.filter(m => m.meetingType === 'scheduled') || [];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <Calendar className="inline-block w-8 h-8 mr-2 text-primary" />
            Schedule Meeting
          </h1>
          <p className="text-base-content/60">
            Plan your meetings in advance and share the details
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Schedule Form */}
          <div className="card bg-base-100 border border-base-300 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">New Meeting</h2>
              
              <form onSubmit={handleScheduleMeeting} className="space-y-4">
                {/* Meeting Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Meeting Topic *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Team Weekly Sync"
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
                    placeholder="Add meeting description or agenda"
                    className="textarea textarea-bordered w-full h-20"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* Date and Time */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Date & Time *</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="input input-bordered w-full"
                    value={formData.scheduledTime}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduledTime: e.target.value })
                    }
                    min={getMinDateTime()}
                    required
                  />
                </div>

                {/* Duration */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Duration</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: parseInt(e.target.value) })
                    }
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                    <option value={180}>3 hours</option>
                  </select>
                </div>

                {/* Max Participants */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Max Participants</span>
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
                    <span className="label-text font-semibold">Meeting Password (Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Leave empty for no password"
                    className="input input-bordered w-full"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>

                {/* Security & Features */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Security & Features</h3>
                  
                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={formData.waitingRoomEnabled}
                      onChange={(e) =>
                        setFormData({ ...formData, waitingRoomEnabled: e.target.checked })
                      }
                    />
                    <div>
                      <span className="label-text font-medium">Enable waiting room</span>
                      <p className="text-xs text-base-content/60">
                        Admit participants manually
                      </p>
                    </div>
                  </label>

                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={formData.muteParticipantsOnEntry}
                      onChange={(e) =>
                        setFormData({ ...formData, muteParticipantsOnEntry: e.target.checked })
                      }
                    />
                    <span className="label-text font-medium">Mute participants on entry</span>
                  </label>

                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={formData.allowScreenSharing}
                      onChange={(e) =>
                        setFormData({ ...formData, allowScreenSharing: e.target.checked })
                      }
                    />
                    <span className="label-text font-medium">Allow screen sharing</span>
                  </label>

                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={formData.isPublic}
                      onChange={(e) =>
                        setFormData({ ...formData, isPublic: e.target.checked })
                      }
                    />
                    <div>
                      <span className="label-text font-medium">Public meeting</span>
                      <p className="text-xs text-base-content/60">
                        Listed in public meetings
                      </p>
                    </div>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-full gap-2"
                  disabled={createMeetingMutation.isPending}
                >
                  {createMeetingMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-5 h-5" />
                      Schedule Meeting
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* My Meetings List */}
          <div className="space-y-6">
            {/* Scheduled Meetings */}
            <div className="card bg-base-100 border border-base-300 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">Scheduled Meetings</h2>
                
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                ) : scheduledMeetings.length > 0 ? (
                  <div className="space-y-3">
                    {scheduledMeetings.map((meeting) => (
                      <div
                        key={meeting._id}
                        className="border border-base-300 rounded-lg p-4 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold flex items-center gap-2">
                              {meeting.name}
                              {meeting.password && <Lock className="w-3 h-3 text-warning" />}
                              {meeting.waitingRoomEnabled && <Shield className="w-3 h-3 text-info" />}
                            </h3>
                            <p className="text-xs text-base-content/60 flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />
                              {formatDateTime(meeting.scheduledTime)}
                            </p>
                          </div>
                          <div className="badge badge-sm badge-primary">
                            {meeting.participants?.length || 0}/{meeting.maxParticipants}
                          </div>
                        </div>

                        {meeting.description && (
                          <p className="text-sm text-base-content/70 mb-3 line-clamp-2">
                            {meeting.description}
                          </p>
                        )}

                        {/* Meeting Code */}
                        <div className="bg-base-200 rounded p-2 mb-3 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-base-content/60">Code</p>
                            <p className="font-mono font-bold tracking-wider">
                              {meeting.roomCode}
                            </p>
                          </div>
                          <button
                            onClick={() => copyMeetingCode(meeting.roomCode)}
                            className="btn btn-ghost btn-xs btn-circle"
                          >
                            {copiedCode === meeting.roomCode ? (
                              <Check className="w-4 h-4 text-success" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => startMeeting(meeting.roomId)}
                            className="btn btn-primary btn-sm flex-1 gap-1"
                          >
                            <Video className="w-4 h-4" />
                            Start
                          </button>
                          <button
                            onClick={() => copyInviteLink(meeting.roomCode)}
                            className="btn btn-ghost btn-sm gap-1"
                          >
                            <Copy className="w-4 h-4" />
                            Copy Link
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-2 text-base-content/30" />
                    <p className="text-sm text-base-content/60">
                      No scheduled meetings
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Instant Meetings */}
            {instantMeetings.length > 0 && (
              <div className="card bg-base-100 border border-base-300 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-4">Active Instant Meetings</h2>
                  
                  <div className="space-y-3">
                    {instantMeetings.map((meeting) => (
                      <div
                        key={meeting._id}
                        className="border border-base-300 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold">{meeting.name}</h3>
                          <div className="badge badge-sm badge-success">Active</div>
                        </div>

                        <div className="bg-base-200 rounded p-2 mb-3 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-base-content/60">Code</p>
                            <p className="font-mono font-bold tracking-wider">
                              {meeting.roomCode}
                            </p>
                          </div>
                          <button
                            onClick={() => copyMeetingCode(meeting.roomCode)}
                            className="btn btn-ghost btn-xs btn-circle"
                          >
                            {copiedCode === meeting.roomCode ? (
                              <Check className="w-4 h-4 text-success" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        <button
                          onClick={() => startMeeting(meeting.roomId)}
                          className="btn btn-primary btn-sm w-full gap-1"
                        >
                          <Video className="w-4 h-4" />
                          Join Meeting
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeetingPage;
