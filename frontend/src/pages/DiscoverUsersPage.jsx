import { useEffect, useMemo, useState } from "react";
import { Search, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../store/useUserStore";
import UserCard from "../components/common/UserCard";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";

const DiscoverUsersPage = () => {
  const {
    allUsers,
    friends,
    isLoadingUsers,
    fetchUsers,
    fetchFriends,
    outgoingRequestIds,
    pendingActionIds,
    sendFriendRequest,
    cancelFriendRequest,
  } = useUserStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchFriends();
  }, [fetchUsers, fetchFriends]);

  const friendIds = useMemo(() => new Set(friends.map((f) => f._id ?? f.id)), [friends]);

  const discoverable = useMemo(() => {
    let list = allUsers.filter((u) => !friendIds.has(u._id ?? u.id));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((u) => u.fullName?.toLowerCase().includes(q));
    }
    return list;
  }, [allUsers, friendIds, query]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight">Discover people</h2>
        <p className="mt-1 text-sm text-base-content/60">Find new people to add as friends.</p>
      </div>

      <label className="input input-bordered mb-6 flex w-full items-center gap-2">
        <Search className="size-4 text-base-content/40" />
        <input
          type="text"
          placeholder="Search people"
          className="grow"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {isLoadingUsers ? (
        <Spinner />
      ) : discoverable.length === 0 ? (
        <EmptyState
          icon={Compass}
          title={query ? "No matches" : "Nobody to discover right now"}
          description={query ? "Try a different search term." : "Check back later for new people to meet."}
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.04 } } }}
          className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
        >
          {discoverable.map((user) => {
            const id = user._id ?? user.id;
            return (
              <motion.div key={id} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                <UserCard
                  user={user}
                  isRequestSent={outgoingRequestIds.has(id)}
                  isPending={pendingActionIds.has(id)}
                  onSendRequest={sendFriendRequest}
                  onCancelRequest={cancelFriendRequest}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default DiscoverUsersPage;
