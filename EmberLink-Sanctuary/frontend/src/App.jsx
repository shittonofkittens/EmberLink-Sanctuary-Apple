import React from "react";
import { useParams } from "react-router-dom";
import ChatBox from "./components/ChatBox";
import { ROOMS } from "./api/state/rooms"; // adjust path if needed

function App() {
  const { roomId } = useParams();
  const activeRoom = roomId?.toLowerCase();
  const isValidRoom = activeRoom && Object.keys(ROOMS).includes(activeRoom);

  return <ChatBox roomId={isValidRoom ? activeRoom : null} />;
}

export default App;
