// serverConfig.js
export const BACKEND_URL = import.meta.env.PROD
  ? "https://emberlink-backend.onrender.com" // ✅ Replace with your actual backend URL on Render
  : "http://localhost:5001"; // ✅ Your local Flask port

export const API_ENDPOINTS = {
  chat: `${BACKEND_URL}/api/chat`,
  recall: `${BACKEND_URL}/api/recall`,  // ✅ needed for delete
  ping: `${BACKEND_URL}/api/ping`,
  status: `${BACKEND_URL}/api/status`,
  bondStatus: `${BACKEND_URL}/api/bond-status`,
  historyLoad: (room) => `${BACKEND_URL}/api/history/load/${room}`,
  historySave: `${BACKEND_URL}/api/history/save`
};
