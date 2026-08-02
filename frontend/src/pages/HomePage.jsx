import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Compass } from "lucide-react";
import { useUserStore } from "../store/useUserStore";
import { useAuthStore } from "../store/useAuthStore";
import FriendCard from "../components/common/FriendCard";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";

const HomePage = () => {
  const { authUser } = useAuthStore();
  const { friends, isLoadingFriends, fetchFriends } = useUserStore();

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight">
          Welcome back, {authUser?.fullName?.split(" ")[0] || "there"}
        </h2>
        <p className="mt-1 text-sm text-base-content/60">Here's what's happening with your friends.</p>
      </div>

      {isLoadingFriends ? (
        <Spinner />
      ) : friends.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No friends yet"
          description="Discover people to connect with and start your first conversation."
          action={
            <Link to="/discover" className="btn btn-primary btn-sm gap-1.5">
              <Compass className="size-3.5" />
              Discover people
            </Link>
          }
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.04 } } }}
          className="flex flex-col gap-2.5"
        >
          {friends.map((user) => (
            <motion.div
              key={user._id ?? user.id}
              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
            >
              <FriendCard user={user} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;
