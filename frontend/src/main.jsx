import React from "react";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { SoulProvider } from './context/SoulContext.jsx';
import { ElevenLabsService } from './services/ElevenLabsService.js';
import ChatBox from "./components/ChatBox";
import { SeedExporter } from './services/seedExporter.js';

// === SETUP: ElevenLabs Voice Config ===
const elevenKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
const service = ElevenLabsService.getInstance();
service.configure(elevenKey);

// === FUNCTION: Schedule automatic daily seed export at 4 AM ===
function scheduleSeedBackup() {
  const CHECK_INTERVAL = 5 * 60 * 1000; // every 5 minutes
  setInterval(() => {
    const now = new Date();
    const hour = now.getHours();
    const dateKey = now.toISOString().split("T")[0];
    const markerKey = `emberlink-seed-backup-${dateKey}`;

    if (hour === 4 && !localStorage.getItem(markerKey)) {
      console.log("🌱 Running 4 AM auto seed export");
      SeedExporter.exportSeeds();
      localStorage.setItem(markerKey, "done");
    }
  }, CHECK_INTERVAL);
}

// === MOUNT: Start EmberLink ===
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SoulProvider>
        <Routes>
          <Route path="/" element={<App isHome={true} />} />
          {/* One route per room, all rendering ChatBox with roomId */}
          <Route path="/room/:roomId" element={<App />} />
        </Routes>
      </SoulProvider>
    </BrowserRouter>
  </StrictMode>
);

// === START 4AM AUTO SEED BACKUP ===
scheduleSeedBackup();
