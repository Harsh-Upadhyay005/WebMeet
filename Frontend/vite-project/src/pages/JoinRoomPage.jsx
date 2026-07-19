import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { joinByRoomCode, joinRoom } from "../lib/api";
import { Video, Lock, Users, Clock, Shield } from "lucide-react";
import toast from "react-hot-toast";

const JoinRoomPage = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [password, setPassword] = useState("");
  const [roomData, setRoomData] = useState(null);
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const verifyRoomMutation = useMutation({
    mutationFn: ({ roomCode, password }) => joinByRoomCode(roomCode, password),
    onSuccess: (data) => {
      if (data.requiresPassword) {
        setShowPasswordInput(true);
        setRoomData(data);
      } else {
        setRoomData(data.room);
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Invalid meeting code");
      setRoomCode("");
      setPassword("");
      setShowPasswordInput(false);
      setRoomData(null);
    },
  });

  const joinRoomMutation = useMutation({
    mutationFn: ({ roomId, password }) => joinRoom(roomId, password),
    onSuccess: (data) => {
      if (data.inWaitingRoom) {
        toast.success("You're in the waiting room. The host will admit you shortly.");
      } else {
        toast.success("Joined meeting successfully!");
      }
      navigate(`/room/${data.room.roomId}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to join meeting");
    },
  });

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (roomCode.length !== 6) {
      toast.error("Meeting code must be 6 characters");
      return;
    }
    verifyRoomMutation.mutate({ roomCode: roomCode.toUpperCase(), password });
  };

  const handleJoinMeeting = () => {
    if (roomData) {
      joinRoomMutation.mutate({ roomId: roomData.roomId, password });
    }
  };

  const formatRoomCode = (value) => {
    // Remove spaces and convert to uppercase
    const cleaned = value.replace(/\s/g, "").toUpperCase();
    // Limit to 6 characters
    return cleaned.slice(0, 6);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-200">
      <div className="max-w-md w-full">
        {!roomData ? (
          // Step 1: Enter Meeting Code
          <div className="card bg-base-100 shadow-2xl">
            <div className="card-body p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Video className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Join Meeting</h1>
                <p className="text-base-content/60">
                  Enter the 6-character meeting code to join
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Meeting Code</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ABC123"
                    className="input input-bordered input-lg w-full text-center font-mono text-2xl tracking-wider uppercase"
                    value={roomCode}
                    onChange={(e) => setRoomCode(formatRoomCode(e.target.value))}
                    maxLength={6}
                    required
                    autoFocus
                  />
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">
                      {roomCode.length}/6 characters
                    </span>
                  </label>
                </div>

                {showPasswordInput && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Password Required
                      </span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter meeting password"
                      className="input input-bordered w-full"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-full btn-lg gap-2"
                  disabled={roomCode.length !== 6 || verifyRoomMutation.isPending}
                >
                  {verifyRoomMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Video className="w-5 h-5" />
                      Verify Code
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="divider">OR</div>

              {/* Alternative Options */}
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/public-rooms")}
                  className="btn btn-outline w-full"
                >
                  Browse Public Meetings
                </button>
                <button
                  onClick={() => navigate("/direct-call")}
                  className="btn btn-ghost w-full"
                >
                  Create Your Own Meeting
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Step 2: Meeting Details & Join
          <div className="card bg-base-100 shadow-2xl">
            <div className="card-body p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
                  <Video className="w-8 h-8 text-success" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Meeting Found!</h1>
                <div className="bg-base-200 rounded-lg p-3 inline-block">
                  <p className="text-xs text-base-content/60 mb-1">Meeting Code</p>
                  <p className="font-mono font-bold text-2xl tracking-wider">
                    {roomData.roomCode}
                  </p>
                </div>
              </div>

              {/* Meeting Details */}
              <div className="space-y-4 mb-6">
                <div className="bg-base-200 rounded-lg p-4">
                  <h2 className="font-bold text-xl mb-2 flex items-center gap-2">
                    {roomData.name}
                    {roomData.hasPassword && <Lock className="w-4 h-4 text-warning" />}
                    {roomData.waitingRoomEnabled && <Shield className="w-4 h-4 text-info" />}
                  </h2>
                  {roomData.description && (
                    <p className="text-sm text-base-content/70 mb-3">
                      {roomData.description}
                    </p>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-secondary" />
                      <span>
                        Host: {roomData.creator?.fullName || "Anonymous"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-primary" />
                      <span>
                        {roomData.participants?.length || 0}/{roomData.maxParticipants} participants
                      </span>
                    </div>
                    {roomData.waitingRoomEnabled && (
                      <div className="alert alert-info py-2 mt-2">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm">
                          This meeting has a waiting room. The host will admit you.
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {roomData.tags && roomData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {roomData.tags.map((tag, index) => (
                      <span key={index} className="badge badge-ghost">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Join Button */}
              <button
                onClick={handleJoinMeeting}
                className="btn btn-primary w-full btn-lg gap-2"
                disabled={
                  roomData.participants?.length >= roomData.maxParticipants ||
                  joinRoomMutation.isPending
                }
              >
                {joinRoomMutation.isPending ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Joining...
                  </>
                ) : roomData.participants?.length >= roomData.maxParticipants ? (
                  "Meeting Full"
                ) : (
                  <>
                    <Video className="w-5 h-5" />
                    Join Meeting
                  </>
                )}
              </button>

              {/* Back Button */}
              <button
                onClick={() => {
                  setRoomData(null);
                  setRoomCode("");
                  setPassword("");
                  setShowPasswordInput(false);
                }}
                className="btn btn-ghost w-full mt-2"
              >
                Try Different Code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinRoomPage;
