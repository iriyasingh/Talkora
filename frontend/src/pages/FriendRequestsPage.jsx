import { useEffect } from "react";
import { UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../store/useUserStore";
import RequestCard from "../components/common/RequestCard";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";

const FriendRequestsPage = () => {
  const {
    incomingRequests,
    isLoadingRequests,
    fetchIncomingRequests,
    pendingActionIds,
    acceptFriendRequest,
  } = useUserStore();

  useEffect(() => {
    fetchIncomingRequests();
  }, [fetchIncomingRequests]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight">Friend requests</h2>
        <p className="mt-1 text-sm text-base-content/60">
          {incomingRequests.length} pending {incomingRequests.length === 1 ? "request" : "requests"}
        </p>
      </div>

      {isLoadingRequests ? (
        <Spinner />
      ) : incomingRequests.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="No pending requests"
          description="When someone sends you a friend request, it'll show up here."
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.04 } } }}
          className="flex flex-col gap-2.5"
        >
          {incomingRequests.map((request) => {
            const id = request._id ?? request.id ?? request.sender?._id;
            return (
              <motion.div key={id} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                <RequestCard
                  request={request}
                  isPending={pendingActionIds.has(id)}
                  onAccept={acceptFriendRequest}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default FriendRequestsPage;
