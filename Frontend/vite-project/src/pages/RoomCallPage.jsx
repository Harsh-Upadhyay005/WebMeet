import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getRoomById, 
  joinRoom, 
  leaveRoom as leaveRoomApi, 
  getStreamToken,
  admitFromWaitingRoom 
} from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  StreamTheme,
  SpeakerLayout,
  CallControls,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { 
  Users, 
  Copy, 
  Check, 
  Shield, 
  Info, 
  X,
  UserCheck,
  UserX,
  Clock,
  Lock
} from "lucide-react";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

import "@stream-io/video-react-sdk/dist/css/styles.css";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const RoomCallPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();
  const [videoClient, setVideoClient] = useState(null);
  const [call, setCall] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [inWaitingRoom, setInWaitingRoom] = useState(false);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const { data: room, isLoading: roomLoading, refetch: refetchRoom } = useQuery({
    queryKey: ["room", roomId],
    queryFn: () => getRoomById(roomId),
    enabled: !!roomId,
    refetchInterval: inWaitingRoom ? 3000 : false, // Poll every 3s if in waiting room
  });

  const joinRoomMutation = useMutation({
    mutationFn: ({ roomId, password }) => joinRoom(roomId, password),
    onSuccess: (data) => {
      if (data.inWaitingRoom) {
        setInWaitingRoom(true);
        toast.success("You're in the waiting room");
      } else {
        setHasJoined(true);
        setInWaitingRoom(false);
        toast.success("Joined meeting successfully!");
      }
      refetchRoom();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to join meeting");
      navigate("/public-rooms");
    },
  });

  const leaveRoomMutation = useMutation({
    mutationFn: leaveRoomApi,
    onSuccess: () => {
      toast.success("Left meeting successfully");
      navigate("/public-rooms");
    },
  });

  // Check if user was admitted from waiting room
  useEffect(() => {
    if (room && inWaitingRoom && authUser) {
      const isInParticipants = room.participants?.some(p => p._id === authUser._id);
      const isInWaitingRoom = room.waitingRoom?.some(p => p._id === authUser._id);
      
      if (isInParticipants && !isInWaitingRoom) {
        setInWaitingRoom(false);
        setHasJoined(true);
        toast.success("You've been admitted to the meeting!");
      }
    }
  }, [room, inWaitingRoom, authUser]);

  useEffect(() => {
    if (!tokenData?.token || !authUser || !roomId || inWaitingRoom) return;

    const initVideo = async () => {
      try {
        // Only use image URL if it's not a base64 string (Stream has 5KB limit)
        const userImage = authUser.profilePic && !authUser.profilePic.startsWith('data:') 
          ? authUser.profilePic 
          : undefined;

        const client = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: {
            id: authUser._id,
            name: authUser.fullName,
            image: userImage,
          },
          token: tokenData.token,
        });

        setVideoClient(client);

        // Create or join the call
        const newCall = client.call("default", roomId);
        await newCall.join({ create: true });
        setCall(newCall);

        // Join room in backend if not already joined
        if (room && !room.participants?.find(p => p._id === authUser._id)) {
          joinRoomMutation.mutate({ roomId });
        } else {
          setHasJoined(true);
        }
      } catch (error) {
        console.error("Error initializing video:", error);
        toast.error("Failed to join video call");
      }
    };

    initVideo();

    return () => {
      if (call) {
        call.leave().catch(console.error);
      }
      if (videoClient) {
        videoClient.disconnectUser().catch(console.error);
      }
    };
  }, [tokenData, authUser, roomId, inWaitingRoom]);

  const handleLeaveRoom = async () => {
    if (call) {
      await call.leave();
    }
    if (videoClient) {
      await videoClient.disconnectUser();
    }
    leaveRoomMutation.mutate(roomId);
  };

  if (roomLoading || !authUser || !tokenData) {
    return <PageLoader />;
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Meeting Not Found</h2>
          <p className="text-base-content/60 mb-6">
            This meeting may have expired or been ended.
          </p>
          <button
            onClick={() => navigate("/public-rooms")}
            className="btn btn-primary"
          >
            Browse Public Meetings
          </button>
        </div>
      </div>
    );
  }

  // Waiting Room UI
  if (inWaitingRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card bg-base-100 shadow-2xl max-w-md w-full">
          <div className="card-body items-center text-center p-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-info/10 mb-4 animate-pulse">
              <Clock className="w-10 h-10 text-info" />
            </div>
            <h2 className="card-title text-2xl mb-2">In Waiting Room</h2>
            <p className="text-base-content/70 mb-6">
              The meeting host will let you in soon. Please wait...
            </p>
            
            <div className="w-full bg-base-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold mb-2">{room.name}</p>
              <p className="text-xs text-base-content/60">
                Host: {room.creator?.fullName}
              </p>
            </div>

            <button
              onClick={() => {
                setInWaitingRoom(false);
                navigate("/public-rooms");
              }}
              className="btn btn-ghost w-full"
            >
              Leave Waiting Room
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!videoClient || !call || !hasJoined) {
    return <PageLoader />;
  }

  return (
    <div className="h-screen w-full">
      <StreamVideo client={videoClient}>
        <StreamCall call={call}>
          <RoomCallContent 
            room={room} 
            onLeaveRoom={handleLeaveRoom} 
            isLeavingRoom={leaveRoomMutation.isPending}
            authUser={authUser}
            refetchRoom={refetchRoom}
          />
        </StreamCall>
      </StreamVideo>
    </div>
  );
};

// Separate component to access Stream hooks
const RoomCallContent = ({ room, onLeaveRoom, isLeavingRoom, authUser, refetchRoom }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const [showParticipants, setShowParticipants] = useState(false);
  const [showMeetingInfo, setShowMeetingInfo] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const isHost = room.creator?._id === authUser._id;

  const admitUserMutation = useMutation({
    mutationFn: ({ roomId, userId }) => admitFromWaitingRoom(roomId, userId),
    onSuccess: () => {
      toast.success("User admitted to meeting");
      refetchRoom();
      queryClient.invalidateQueries(["room", room.roomId]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to admit user");
    },
  });

  const handleAdmitUser = (userId) => {
    admitUserMutation.mutate({ roomId: room.roomId, userId });
  };

  const copyMeetingCode = () => {
    navigator.clipboard.writeText(room.roomCode);
    setCopiedCode(true);
    toast.success("Meeting code copied!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/join/${room.roomCode}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied!");
  };

  // Redirect when call ends
  if (callingState === CallingState.LEFT) {
    navigate("/public-rooms");
    return null;
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* Meeting Header */}
      <div className="bg-base-200 border-b border-base-300 px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="font-bold text-lg flex items-center gap-2">
              {room.name}
              {room.password && <Lock className="w-4 h-4 text-warning" />}
            </h2>
            <p className="text-xs text-base-content/60">
              Code: <span className="font-mono font-semibold">{room.roomCode}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Meeting Info Button */}
          <button
            onClick={() => setShowMeetingInfo(!showMeetingInfo)}
            className="btn btn-ghost btn-sm gap-2"
            title="Meeting Info"
          >
            <Info className="w-4 h-4" />
            <span className="hidden md:inline">Info</span>
          </button>

          {/* Participants Button */}
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="btn btn-ghost btn-sm gap-2"
            title="Participants"
          >
            <Users className="w-4 h-4" />
            <span className="badge badge-sm">{room.participants?.length || 0}</span>
          </button>

          {/* Waiting Room Indicator */}
          {isHost && room.waitingRoom && room.waitingRoom.length > 0 && (
            <div className="badge badge-warning gap-1 animate-pulse">
              <Shield className="w-3 h-3" />
              {room.waitingRoom.length}
            </div>
          )}

          {/* Leave Button */}
          <button
            onClick={onLeaveRoom}
            className="btn btn-error btn-sm"
            disabled={isLeavingRoom}
          >
            {isLeavingRoom ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Leave"
            )}
          </button>
        </div>
      </div>

      {/* Video Call UI */}
      <div className="flex-1 relative">
        <StreamTheme>
          <SpeakerLayout />
          <CallControls />
        </StreamTheme>
      </div>

      {/* Meeting Info Panel */}
      {showMeetingInfo && (
        <div className="absolute top-16 right-4 w-80 card bg-base-100 shadow-2xl z-20 border border-base-300">
          <div className="card-body p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Meeting Info</h3>
              <button
                onClick={() => setShowMeetingInfo(false)}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Meeting Code */}
              <div className="bg-base-200 rounded-lg p-3">
                <p className="text-xs text-base-content/60 mb-1">Meeting Code</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono font-bold text-lg tracking-wider">
                    {room.roomCode}
                  </p>
                  <button
                    onClick={copyMeetingCode}
                    className="btn btn-ghost btn-xs btn-circle"
                  >
                    {copiedCode ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Description */}
              {room.description && (
                <div>
                  <p className="text-xs text-base-content/60 mb-1">Description</p>
                  <p className="text-sm">{room.description}</p>
                </div>
              )}

              {/* Host */}
              <div>
                <p className="text-xs text-base-content/60 mb-1">Host</p>
                <p className="text-sm">{room.creator?.fullName}</p>
              </div>

              {/* Capacity */}
              <div>
                <p className="text-xs text-base-content/60 mb-1">Capacity</p>
                <p className="text-sm">
                  {room.participants?.length || 0} / {room.maxParticipants}
                </p>
              </div>

              {/* Features */}
              <div>
                <p className="text-xs text-base-content/60 mb-2">Features</p>
                <div className="space-y-1">
                  {room.waitingRoomEnabled && (
                    <div className="text-xs flex items-center gap-2">
                      <Shield className="w-3 h-3 text-info" />
                      <span>Waiting room enabled</span>
                    </div>
                  )}
                  {room.password && (
                    <div className="text-xs flex items-center gap-2">
                      <Lock className="w-3 h-3 text-warning" />
                      <span>Password protected</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Copy Invite Link */}
              <button
                onClick={copyInviteLink}
                className="btn btn-primary btn-sm w-full gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Invite Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Participants Panel */}
      {showParticipants && (
        <div className="absolute top-16 right-4 w-80 card bg-base-100 shadow-2xl z-20 border border-base-300">
          <div className="card-body p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Participants ({room.participants?.length || 0})
              </h3>
              <button
                onClick={() => setShowParticipants(false)}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Waiting Room */}
              {isHost && room.waitingRoom && room.waitingRoom.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-warning" />
                    <h4 className="font-semibold text-sm">
                      Waiting Room ({room.waitingRoom.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {room.waitingRoom.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-2 bg-base-200 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <div className="avatar placeholder">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-content">
                              <span className="text-xs">
                                {user.fullName?.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <span className="text-sm">{user.fullName}</span>
                        </div>
                        <button
                          onClick={() => handleAdmitUser(user._id)}
                          className="btn btn-success btn-xs gap-1"
                          disabled={admitUserMutation.isPending}
                        >
                          <UserCheck className="w-3 h-3" />
                          Admit
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="divider my-2"></div>
                </div>
              )}

              {/* Active Participants */}
              <div>
                <h4 className="font-semibold text-sm mb-2">In Meeting</h4>
                <div className="space-y-2">
                  {room.participants?.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-2 bg-base-200 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <div className="avatar placeholder">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-content">
                            <span className="text-xs">
                              {user.fullName?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm">{user.fullName}</span>
                          {user._id === room.creator?._id && (
                            <span className="badge badge-xs badge-primary ml-2">
                              Host
                            </span>
                          )}
                          {user._id === authUser._id && (
                            <span className="badge badge-xs badge-ghost ml-2">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomCallPage;
