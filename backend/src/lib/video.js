import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

let client;

export function getVideoClient() {
  if (!client) {
    client = new StreamClient(apiKey, apiSecret);
  }

  return client;
}