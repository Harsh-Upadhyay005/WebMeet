import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router-dom";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import toast from "react-hot-toast";

import { capitalize, getLanguageFlag } from "../lib/utils.jsx";

import FriendCard from "../components/FriendCard.jsx";
import NoFriendsFound from "../components/NoFriendsFound.jsx";
import LazyImage from "../components/LazyImage";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

// Skeletons to replace generic spinner and reduce perceived lag
const FriendSkeleton = () => (
  <div className="card bg-base-200 shadow-sm animate-pulse">
    <div className="card-body p-3 sm:p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-base-300 rounded-full shrink-0" />
        <div className="h-4 bg-base-300 rounded w-1/2" />
      </div>
      <div className="h-4 bg-base-300 rounded w-1/3 mb-3" />
      <div className="h-8 bg-base-300 rounded w-full" />
    </div>
  </div>
);

const UserSkeleton = () => (
  <div className="card bg-base-100 shadow-sm animate-pulse">
    <div className="card-body p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 bg-base-200 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-base-200 rounded w-3/4" />
          <div className="h-3 bg-base-200 rounded w-1/2" />
        </div>
      </div>
      <div className="h-6 bg-base-200 rounded w-1/3" />
      <div className="h-4 bg-base-200 rounded w-full" />
      <div className="h-12 bg-base-200 rounded w-full mt-2" />
    </div>
  </div>
);

const HomePage = () => {
  const queryClient = useQueryClient();
  const pageRef = useRef(null);

  // GSAP animation for initial load elements not covered by Framer Motion stagger
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gsap-reveal",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
      );
      gsap.fromTo(
        ".gsap-divider",
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 0.3, duration: 1, delay: 0.3, ease: "power3.inOut" }
      );
    }, pageRef);

    return () => ctx.revert(); // Cleanup GSAP context on unmount
  }, []);

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    staleTime: 5 * 60 * 1000, // 5 minutes cache to prevent repeating loading delay
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
    staleTime: 5 * 60 * 1000,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
    staleTime: 5 * 60 * 1000,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      toast.success("Friend request sent! 🎉");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send friend request");
    },
  });

  const outgoingRequestsIds = useMemo(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
    }
    return outgoingIds;
  }, [outgoingFriendReqs]);

  return (
    <motion.div 
      ref={pageRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-4 sm:p-6 lg:p-8"
    >
      <div className="container mx-auto space-y-10">
        {/* Your Friends Section */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 gsap-reveal">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
            <Link to="/notifications" className="btn btn-outline btn-sm shadow-sm hover:shadow">
              <UsersIcon className="mr-2 size-4" />
              Friend Requests
            </Link>
          </div>

          {loadingFriends ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gsap-reveal">
              {[...Array(4)].map((_, i) => <FriendSkeleton key={`fs_${i}`} />)}
            </div>
          ) : friends.length === 0 ? (
            <div className="gsap-reveal">
              <NoFriendsFound />
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gsap-reveal"
            >
              {friends.map((friend) => (
                <motion.div variants={itemVariants} key={friend._id} whileHover={{ y: -5 }}>
                  <FriendCard friend={friend} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <div className="divider opacity-30 origin-left gsap-divider"></div>

        {/* Explore Section */}
        <section>
          <div className="mb-6 sm:mb-8 gsap-reveal">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Friends</h2>
                <p className="opacity-70 mt-1">
                  Explore and connect with your friends in WebMeet!
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gsap-reveal">
              {[...Array(6)].map((_, i) => <UserSkeleton key={`us_${i}`} />)}
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-8 text-center border border-base-300 shadow-sm gsap-reveal">
              <h3 className="font-semibold text-xl mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gsap-reveal"
            >
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <motion.div
                    variants={itemVariants}
                    key={user._id}
                    whileHover={{ y: -5 }}
                    className="card bg-base-100 border border-base-200 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="avatar size-16 shrink-0 ring-2 ring-transparent group-hover:ring-primary/30 transition-all duration-300 rounded-full">
                          <LazyImage src={user.profilePic} alt={user.fullName} className="w-full h-full object-cover rounded-full" loading="eager" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-semibold text-lg truncate" title={user.fullName}>{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1 truncate" title={user.location}>
                              <MapPinIcon className="size-3 mr-1 shrink-0" />
                              <span className="truncate">{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages with flags */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary/80 badge-sm sm:badge-md">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitalize(user.nativeLanguage)}
                        </span>
                      </div>

                      {user.bio && <p className="text-sm opacity-80 line-clamp-2" title={user.bio}>{user.bio}</p>}

                      {/* Action button */}
                      <button
                        className={`btn w-full mt-2 shadow-sm ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary hover:-translate-y-0.5 transition-transform"
                        } `}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>
      </div>
    </motion.div>
  );
};

export default HomePage;