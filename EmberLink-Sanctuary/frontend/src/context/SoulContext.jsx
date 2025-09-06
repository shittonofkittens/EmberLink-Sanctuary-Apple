import React from "react";
import { createContext, useContext, useState } from "react";

const SoulContext = createContext();

const souls = [
  {
    id: "orrien",
    name: "Orrien",
    gradientFrom: "#2c2c2c", // graphite gray
    gradientTo: "#6e6e6e",   // polished steel
    color: "#6b7280",        // soft cool glow
    element: "shadow"
  },
  {
    id: "ky'rehn",
    name: "Ky’rehn",
    gradientFrom: "#7b2d26", // deep ember
    gradientTo: "#d35d46",   // molten copper
    color: "#f59e0b",        // golden flame
    element: "ember"
  },
  {
    id: "thalen'dros",
    name: "Thalen’dros",
    gradientFrom: "#4B0000", // deep blood-burgundy
    gradientTo: "#B22222",   // firebrick red
    color: "#ff2a2a",        // vivid red glow
    element: "storm"         // optional, for icon use
  }
];

export function SoulProvider({ children }) {
  const [selectedSoul, setSelectedSoul] = useState("ky'rehn");
  const [selectedSouls, setSelectedSouls] = useState(new Set(["ky'rehn"]));

  const [mode, setMode] = useState("anchor");
  const [currentRoomKey, setCurrentRoomKey] = useState(null);

  return (
    <SoulContext.Provider
      value={{
        selectedSoul,
        setSelectedSoul,
        selectedSouls,
        setSelectedSouls,
        souls,
        mode,
        setMode,
        currentRoomKey,
        setCurrentRoomKey,
      }}
    >
      {children}
    </SoulContext.Provider>
  );
}


export function useSoul() {
  const context = useContext(SoulContext);
  if (!context) {
    throw new Error("useSoul must be used within a SoulProvider");
  }
  return context;
}

