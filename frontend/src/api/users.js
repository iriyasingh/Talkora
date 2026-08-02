import axiosInstance from "../lib/axios";

// All users (used for "discover users" — filter out friends/self on the page)
export const getUsers = async () => {
  const res = await axiosInstance.get("/users");
  return res.data;
};

export const getFriends = async () => {
  const res = await axiosInstance.get("/users/friends");
  return res.data;
};

export const sendFriendRequest = async (id) => {
  const res = await axiosInstance.post(`/users/friend-request/${id}`);
  return res.data;
};

export const acceptFriendRequest = async (id) => {
  const res = await axiosInstance.put(`/users/friend-request/${id}/accept`);
  return res.data;
};

export const cancelFriendRequest = async (id) => {
  const res = await axiosInstance.post(`/users/friend-request/${id}/cancel`);
  return res.data;
};

// Incoming friend requests list
export const getFriendRequests = async () => {
  const res = await axiosInstance.post(`/users/friend-request`);
  return res.data;
};

// Outgoing friend requests list
export const getOutgoingFriendRequests = async (id) => {
  const res = await axiosInstance.post(`/users/friend-request/${id}/outgoing`);
  return res.data;
};
