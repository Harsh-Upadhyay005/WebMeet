import { Link } from "react-router-dom";
import { getLanguageFlag } from "../lib/utils.jsx";
import { MessageCircle, Video } from "lucide-react";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-3 sm:p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="avatar w-10 h-10 sm:w-12 sm:h-12 rounded-full">
            <img src={friend.profilePic} alt={friend.fullName} className="rounded-full" />
          </div>
          <h3 className="font-semibold truncate text-sm sm:text-base">{friend.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2 sm:mb-3">
          <span className="badge badge-secondary text-[10px] sm:text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
        </div>

        <div className="flex gap-2">
          <Link to={`/chat/${friend._id}`} className="btn btn-primary btn-sm flex-1">
            <MessageCircle className="w-4 h-4" />
            <span className="hidden xs:inline">Message</span> /
            <Video className="w-4 h-4" />
            <span className="hidden xs:inline">Call</span>
          </Link>
          {/* <Link to={`/call/${friend._id}`} className="btn btn-secondary btn-sm flex-1">
            <Video className="w-4 h-4" />
            <span className="hidden xs:inline">Call</span>
          </Link> */}
        </div>
      </div>
    </div>
  );
};
export default FriendCard;