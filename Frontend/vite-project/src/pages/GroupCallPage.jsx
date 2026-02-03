import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { ArrowLeft, Users } from "lucide-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";

import { getStreamToken, getGroupById } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import PageLoader from "../components/PageLoader";
import LazyImage from "../components/LazyImage";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const GroupCallPage = () => {
  const { id: groupId } = useParams();
  
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  // Fetch group details
  const { data: group, isLoading: loadingGroup, error: groupError } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => getGroupById(groupId),
    enabled: !!groupId,
  });

  // Fetch stream token
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    let videoClient = null;
    let callInstance = null;

    const initGroupCall = async () => {
      if (!tokenData?.token || !authUser || !group) return;

      try {
        console.log("Initializing group video call...");

        const userImage = authUser.profilePic && !authUser.profilePic.startsWith('data:') 
          ? authUser.profilePic 
          : undefined;

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: userImage,
        };

        videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        // Use group ID as call ID for consistency
        const callId = `group-call-${groupId}`;
        callInstance = videoClient.call("default", callId);

        await callInstance.join({ create: true });

        console.log("Joined group call successfully");

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining group call:", error);
        toast.error("Could not join the group call. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    };

    initGroupCall();

    return () => {
      if (callInstance) {
        callInstance.leave().catch(console.error);
      }
      if (videoClient) {
        videoClient.disconnectUser().catch(console.error);
      }
    };
  }, [tokenData, authUser, group, groupId]);

  if (groupError) {
    return (
      <div className="h-screen flex items-center justify-center bg-base-300">
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

  if (isLoading || loadingGroup || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen flex flex-col bg-base-300">
      {/* Group Call Header */}
      <div className="bg-base-200 border-b border-base-300 p-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Link to={`/group-chat/${groupId}`} className="btn btn-ghost btn-sm btn-circle">
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
            <p className="text-xs text-base-content/60 flex items-center gap-1">
              <Users className="size-3" />
              Group Call
            </p>
          </div>
        </div>
      </div>

      {/* Video Call Area */}
      <div className="flex-1 relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <GroupCallContent groupId={groupId} />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <span className="loading loading-spinner loading-lg mb-4" />
              <p>Connecting to group call...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const GroupCallContent = ({ groupId }) => {
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate(`/group-chat/${groupId}`);
    }
  }, [callingState, navigate, groupId]);

  if (callingState === CallingState.LEFT) {
    return null;
  }

  return (
    <StreamTheme>
      <div className="h-full flex flex-col">
        {/* Participant Count Badge */}
        <div className="absolute top-4 right-4 z-10 badge badge-primary gap-1">
          <Users className="size-3" />
          {participantCount} participant{participantCount !== 1 ? 's' : ''}
        </div>

        {/* Video Grid */}
        <div className="flex-1">
          <SpeakerLayout />
        </div>

        {/* Call Controls */}
        <div className="bg-base-200/80 backdrop-blur-sm">
          <CallControls />
        </div>
      </div>
    </StreamTheme>
  );
};

export default GroupCallPage;
