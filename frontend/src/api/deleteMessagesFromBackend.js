import { API_ENDPOINTS } from "./serverConfig.js";

const deleteMessagesFromBackend = async (deleteIds, roomId) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.recall}/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        delete_ids: deleteIds,
        room: roomId
      }),
      credentials: "include" // important if using cookies or auth
    });

    if (!response.ok) throw new Error("Backend failed to delete messages");

    return await response.json();
  } catch (error) {
    console.error("🔥 Backend failed to delete messages:", error);
    throw error;
  }
};

export { deleteMessagesFromBackend };
