import { Link } from "react-router-dom";
import { capitalize, getLanguageFlag } from "../lib/utils.jsx";
import { MessageCircle, Video } from "lucide-react";
import LazyImage from "./LazyImage";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-100 border border-base-200 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group h-full">
      <div className="card-body p-4 sm:p-5 flex flex-col justify-between">
        
        {/* USER INFO */}
        <div>
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="avatar size-12 sm:size-14 shrink-0 ring-2 ring-transparent group-hover:ring-primary/30 transition-all duration-300 rounded-full">
              <LazyImage src={friend.profilePic} alt={friend.fullName} className="w-full h-full object-cover rounded-full" loading="eager" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-base sm:text-lg truncate" title={friend.fullName}>{friend.fullName}</h3>
              {friend.location && (
                <div className="text-xs opacity-70 mt-0.5 truncate" title={friend.location}>
                  {friend.location}
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

        {/* ACTIONS */}
        <div className="flex gap-2 w-full mt-auto">
          <Link to={`/chat/${friend._id}`} className="btn btn-primary btn-sm flex-1 shadow-sm group-hover:-translate-y-0.5 transition-transform">
            <MessageCircle className="size-4" />
            <span>Chat</span> 
            <span className="opacity-50">/</span>
            <Video className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default FriendCard;