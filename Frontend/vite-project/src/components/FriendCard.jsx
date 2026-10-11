import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { capitalize, getLanguageFlag } from "../lib/utils.jsx";
import { MessageCircle, Video, UserMinus, MapPin, MoreVertical, X } from "lucide-react";
import LazyImage from "./LazyImage";
import { removeFriend } from "../lib/api";
import toast from "react-hot-toast";

const FriendCard = ({ friend }) => {
  const queryClient = useQueryClient();
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutate: unfriend, isPending } = useMutation({
    mutationFn: () => removeFriend(friend._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(`Removed ${friend.fullName} from friends`);
      setShowConfirm(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to remove friend");
    },
  });

  return (
    <>
      <div className="card bg-base-100 border border-base-200 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group h-full relative">
        <div className="card-body p-4 sm:p-5 flex flex-col justify-between">

          {/* Top row — avatar + name + kebab menu */}
          <div>
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <div className="avatar size-12 sm:size-14 shrink-0 ring-2 ring-transparent group-hover:ring-primary/30 transition-all duration-300 rounded-full">
                <LazyImage
                  src={friend.profilePic}
                  alt={friend.fullName}
                  className="w-full h-full object-cover rounded-full"
                  loading="eager"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base sm:text-lg truncate" title={friend.fullName}>
                  {friend.fullName}
                </h3>
                {friend.location && (
                  <div className="flex items-center text-xs opacity-60 mt-0.5 gap-1 truncate" title={friend.location}>
                    <MapPin className="size-3 shrink-0" />
                    <span className="truncate">{friend.location}</span>
                  </div>
                )}
              </div>

              {/* Kebab menu */}
              <div className="relative">
                <button
                  className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setShowMenu((v) => !v)}
                  aria-label="More options"
                >
                  <MoreVertical className="size-4" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-6 z-20 w-40 rounded-xl border border-base-300 bg-base-100 shadow-xl py-1">
                    <button
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-error hover:bg-error/10 transition-colors"
                      onClick={() => { setShowMenu(false); setShowConfirm(true); }}
                    >
                      <UserMinus className="size-4" />
                      Unfriend
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="badge badge-secondary/80 badge-sm sm:badge-md">
                {getLanguageFlag(friend.nativeLanguage)}
                Native: {capitalize(friend.nativeLanguage || "")}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 w-full mt-auto">
            <Link
              to={`/chat/${friend._id}`}
              className="btn btn-primary btn-sm flex-1 shadow-sm group-hover:-translate-y-0.5 transition-transform gap-1"
            >
              <MessageCircle className="size-4" />
              Chat
            </Link>
            <Link
              to={`/call/${friend._id}`}
              className="btn btn-outline btn-sm btn-square shadow-sm group-hover:-translate-y-0.5 transition-transform"
              title="Video call"
            >
              <Video className="size-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Confirm unfriend dialog */}
      {showConfirm && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
              onClick={() => setShowConfirm(false)}
            >
              <X className="size-4" />
            </button>

            <div className="flex flex-col items-center text-center gap-4 pt-2">
              <div className="size-16 rounded-full bg-error/10 flex items-center justify-center">
                <UserMinus className="size-8 text-error" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Unfriend {friend.fullName}?</h3>
                <p className="text-sm text-base-content/60 mt-1">
                  You'll lose access to your chat history and won't be able to call each other directly.
                </p>
              </div>
            </div>

            <div className="modal-action gap-2">
              <button
                className="btn btn-ghost flex-1"
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                className="btn btn-error flex-1"
                onClick={() => unfriend()}
                disabled={isPending}
              >
                {isPending ? <span className="loading loading-spinner loading-sm" /> : "Unfriend"}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowConfirm(false)} />
        </div>
      )}
    </>
  );
};

export default FriendCard;
