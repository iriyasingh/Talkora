import axiosInstance from "../lib/axios";

export const getCallToken = async () => {
  const res = await axiosInstance.get("/calls/token");
  return res.data;
};

export const createCallSession = async ({ targetUserId, mode }) => {
  const res = await axiosInstance.post("/calls/start", {
    targetUserId,
    mode,
  });

  return res.data;
};