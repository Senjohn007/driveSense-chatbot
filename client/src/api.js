import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const sendMessage = (message, sessionId) =>
  api.post("/api/chat", { message, sessionId });
