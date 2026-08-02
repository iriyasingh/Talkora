import { useEffect, useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../store/useUserStore";
import FriendCard from "../components/common/FriendCard";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";

const FriendsPage = () => {
  const { friends, isLoadingFriends, fetchFriends } = useUserStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const filtered = useMemo(() => {
    if (!query.trim()) return friends;
    const q = query.toLowerCase();
    return friends.filter((u) => u.fullName?.toLowerCase().includes(q));
  }, [friends, query]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Friends</h2>
          <p className="mt-1 text-sm text-base-content/60">
            {friends.length} {friends.length === 1 ? "friend" : "friends"}
          </p>
        </div>
      </div>

      <label className="input input-bordered mb-6 flex w-full items-center gap-2">
        <Search className="size-4 text-base-content/40" />
        <input
          type="text"
          placeholder="Search friends"
          className="grow"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {isLoadingFriends ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={query ? "No matches" : "No friends yet"}
          description={query ? "Try a different search term." : "Head to Discover to find new people."}
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.04 } } }}
          className="flex flex-col gap-2.5"
        >
          {filtered.map((user) => (
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

export default FriendsPage;
