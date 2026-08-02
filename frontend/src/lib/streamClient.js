import { StreamChat } from "stream-chat";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

let instance = null;

export const getStreamClient = () => {
  if (!instance) instance = StreamChat.getInstance(STREAM_API_KEY);
  return instance;
};

export const disconnectStreamClient = async () => {
  if (instance) {
    await instance.disconnectUser();
    instance = null;
  }
};
