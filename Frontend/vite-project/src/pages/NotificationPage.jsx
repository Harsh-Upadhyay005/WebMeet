import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
} from "../lib/api";
import {
  BellIcon,
  CheckIcon,
  XIcon,
  MessageSquareIcon,
  VideoIcon,
  UserCheckIcon,
  ClockIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import LazyImage from "../components/LazyImage";
import { capitalize, getLanguageFlag } from "../lib/utils.jsx";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptMutation, isPending: accepting } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast.success("Friend request accepted!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to accept request");
    },
  });

  const { mutate: rejectMutation, isPending: rejecting } = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      toast("Request declined", { icon: "👋" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to decline request");
    },
  });

  const incomingRequests = friendRequests?.incomingRequests || [];
  const acceptedRequests = friendRequests?.acceptedRequests || [];

  const totalNotifications = incomingRequests.length + acceptedRequests.length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="container mx-auto max-w-3xl space-y-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <BellIcon className="size-8 text-primary" />
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-error flex items-center justify-center text-white text-[10px] font-bold">
                {totalNotifications > 9 ? "9+" : totalNotifications}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Notifications</h1>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card bg-base-200 animate-pulse h-24" />
            ))}
          </div>
        ) : totalNotifications === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Incoming friend requests */}
            {incomingRequests.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <UserCheckIcon className="size-5 text-primary" />
                  <h2 className="text-lg font-semibold">Friend Requests</h2>
                  <span className="badge badge-primary badge-sm">{incomingRequests.length}</span>
                </div>

                <div className="space-y-2">
                  {incomingRequests.map((req) => (
                    <FriendRequestCard
                      key={req._id}
                      request={req}
                      onAccept={() => acceptMutation(req._id)}
                      onReject={() => rejectMutation(req._id)}
                      accepting={accepting}
                      rejecting={rejecting}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* New connections (accepted notifications) */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckIcon className="size-5 text-success" />
                  <h2 className="text-lg font-semibold">New Connections</h2>
                  <span className="badge badge-success badge-sm">{acceptedRequests.length}</span>
                </div>

                <div className="space-y-2">
                  {acceptedRequests.map((notif) => (
                    <NewConnectionCard key={notif._id} notification={notif} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/* ─── Friend Request Card ──────────────────────────────────────────────────── */
const FriendRequestCard = ({ request, onAccept, onReject, accepting, rejecting }) => {
  const sender = request.sender;

  return (
    <div className="card bg-base-100 border border-base-200 hover:border-primary/30 hover:shadow-md transition-all duration-200">
      <div className="card-body p-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="avatar size-14 shrink-0 rounded-full ring-2 ring-base-300">
            <LazyImage
              src={sender.profilePic}
              alt={sender.fullName}
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base truncate">{sender.fullName}</p>
            <p className="text-xs text-base-content/60 mt-0.5">
              Wants to connect with you
            </p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {sender.nativeLanguage && (
                <span className="badge badge-secondary badge-xs">
                  {getLanguageFlag(sender.nativeLanguage)}&nbsp;
                  {capitalize(sender.nativeLanguage)}
                </span>
              )}
              {sender.location && (
                <span className="badge badge-ghost badge-xs">{sender.location}</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 shrink-0">
            <button
              className="btn btn-primary btn-sm gap-1"
              onClick={onAccept}
              disabled={accepting || rejecting}
              title="Accept"
            >
              {accepting ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <CheckIcon className="size-4" />
              )}
              <span className="hidden sm:inline">Accept</span>
            </button>
            <button
              className="btn btn-ghost btn-sm text-error hover:bg-error/10 gap-1"
              onClick={onReject}
              disabled={accepting || rejecting}
              title="Decline"
            >
              {rejecting ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <XIcon className="size-4" />
              )}
              <span className="hidden sm:inline">Decline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── New Connection Card ──────────────────────────────────────────────────── */
const NewConnectionCard = ({ notification }) => {
  const user = notification.recipient;

  return (
    <div className="card bg-base-100 border border-success/20 hover:shadow-md transition-all duration-200">
      <div className="card-body p-4">
        <div className="flex items-center gap-4">
          {/* Avatar with success ring */}
          <div className="relative shrink-0">
            <div className="avatar size-14 rounded-full ring-2 ring-success/40">
              <LazyImage
                src={user.profilePic}
                alt={user.fullName}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 size-5 rounded-full bg-success flex items-center justify-center ring-2 ring-base-100">
              <CheckIcon className="size-3 text-white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base truncate">{user.fullName}</p>
            <p className="text-xs text-success mt-0.5">Accepted your friend request</p>
            <p className="text-xs text-base-content/40 flex items-center gap-1 mt-1">
              <ClockIcon className="size-3" />
              Recently
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 shrink-0">
            <Link
              to={`/chat/${user._id}`}
              className="btn btn-primary btn-sm gap-1"
              title="Send a message"
            >
              <MessageSquareIcon className="size-4" />
              <span className="hidden sm:inline">Message</span>
            </Link>
            <Link
              to={`/call/${user._id}`}
              className="btn btn-outline btn-sm btn-square"
              title="Video call"
            >
              <VideoIcon className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Empty state ──────────────────────────────────────────────────────────── */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="size-20 rounded-full bg-base-200 flex items-center justify-center mb-4">
      <BellIcon className="size-9 text-base-content/30" />
    </div>
    <h3 className="text-lg font-semibold mb-2">All caught up</h3>
    <p className="text-base-content/60 max-w-xs text-sm">
      Friend requests and new connections will appear here.
    </p>
  </div>
);

export default NotificationsPage;
