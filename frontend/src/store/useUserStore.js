import { create } from "zustand";
import toast from "react-hot-toast";
import * as usersApi from "../api/users";

export const useUserStore = create((set, get) => ({
  allUsers: [],
  friends: [],
  incomingRequests: [],
  outgoingRequestIds: new Set(),

  isLoadingUsers: false,
  isLoadingFriends: false,
  isLoadingRequests: false,
  pendingActionIds: new Set(),

  fetchUsers: async () => {
    set({ isLoadingUsers: true });
    try {
      const data = await usersApi.getUsers();
      set({ allUsers: data.recommendedUsers ?? data.users ?? data ?? [] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't load users");
    } finally {
      set({ isLoadingUsers: false });
    }
  },

  fetchFriends: async () => {
    set({ isLoadingFriends: true });
    try {
      const data = await usersApi.getFriends();
      set({ friends: data.friends ?? data ?? [] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't load friends");
    } finally {
      set({ isLoadingFriends: false });
    }
  },

  fetchIncomingRequests: async () => {
    set({ isLoadingRequests: true });
    try {
      const data = await usersApi.getFriendRequests();
      set({ incomingRequests: data.incomingReqs ?? data.requests ?? data ?? [] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't load requests");
    } finally {
      set({ isLoadingRequests: false });
    }
  },

  sendFriendRequest: async (id) => {
    const pending = new Set(get().pendingActionIds);
    pending.add(id);
    set({ pendingActionIds: pending });
    try {
      await usersApi.sendFriendRequest(id);
      const outgoing = new Set(get().outgoingRequestIds);
      outgoing.add(id);
      set({ outgoingRequestIds: outgoing });
      toast.success("Friend request sent");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't send request");
    } finally {
      const next = new Set(get().pendingActionIds);
      next.delete(id);
      set({ pendingActionIds: next });
    }
  },

  cancelFriendRequest: async (id) => {
    const pending = new Set(get().pendingActionIds);
    pending.add(id);
    set({ pendingActionIds: pending });
    try {
      await usersApi.cancelFriendRequest(id);
      const outgoing = new Set(get().outgoingRequestIds);
      outgoing.delete(id);
      set({ outgoingRequestIds: outgoing });
      toast.success("Request cancelled");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't cancel request");
    } finally {
      const next = new Set(get().pendingActionIds);
      next.delete(id);
      set({ pendingActionIds: next });
    }
  },

  acceptFriendRequest: async (id) => {
    const pending = new Set(get().pendingActionIds);
    pending.add(id);
    set({ pendingActionIds: pending });
    try {
      await usersApi.acceptFriendRequest(id);
      set({ incomingRequests: get().incomingRequests.filter((r) => (r._id ?? r.id) !== id) });
      toast.success("Friend request accepted");
      get().fetchFriends();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't accept request");
    } finally {
      const next = new Set(get().pendingActionIds);
      next.delete(id);
      set({ pendingActionIds: next });
    }
  },
}));
