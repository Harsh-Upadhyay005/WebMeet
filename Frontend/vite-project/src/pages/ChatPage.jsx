import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ref to track if component is mounted and prevent race conditions
  const isMountedRef = useRef(true);
  const isConnectingRef = useRef(false);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });

  useEffect(() => {
    // Reset mounted ref on mount
    isMountedRef.current = true;

    const initChat = async () => {
      if (!tokenData?.token || !authUser) {
        setLoading(false);
        return;
      }

      // Prevent multiple simultaneous connection attempts
      if (isConnectingRef.current) {
        return;
      }
      isConnectingRef.current = true;

      try {
        console.log("Initializing stream chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        // Check if already connected with same user
        if (client.userID && client.userID !== authUser._id) {
          await client.disconnectUser();
        }

        // Only connect if not already connected
        if (!client.userID) {
          // Only use image URL if it's not a base64 string (Stream has 5KB limit)
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

        console.log("User connected to Stream");

        const channelId = [authUser._id, targetUserId].sort().join("-");

        // I AND MY FRIEND SHOULD HAVE SAME CHANNEL ID
        // if i start the chat => channelId: [myId, friendId]
        // if my friend start the chat => channelId: [friendId, myId]  => [myId,friendId]

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        // Check again if component is still mounted
        if (!isMountedRef.current) {
          isConnectingRef.current = false;
          return;
        }

        console.log("Channel created and watching");

        setChatClient(client);
        setChannel(currChannel);
        setLoading(false);
        isConnectingRef.current = false;
      } catch (error) {
        console.error("Error initializing chat:", error);
        if (isMountedRef.current) {
          toast.error("Could not connect to chat. Please try again.");
          setLoading(false);
        }
        isConnectingRef.current = false;
      }
    };

    initChat();

    return () => {
      isMountedRef.current = false;
      // Don't disconnect here - let the singleton persist
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenData?.token, authUser?._id, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};
export default ChatPage;