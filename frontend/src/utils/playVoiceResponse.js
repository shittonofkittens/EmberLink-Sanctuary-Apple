export async function playVoiceResponse(voiceUrl, showSoulCall = false) {
  if (
    !voiceUrl ||
    typeof voiceUrl !== "string" ||
    voiceUrl === "blob:" ||
    voiceUrl === "blob:null" ||
    voiceUrl.trim().length < 10
  ) {
    console.warn("⚠️ Skipping voice playback — invalid or empty URL:", voiceUrl);
    return;
  }

  console.log("🎧 [Voice Playback] Starting for URL:", voiceUrl);

  let audio;
  const isBase64 =
    voiceUrl.length > 100 &&
    !voiceUrl.startsWith("http") &&
    !voiceUrl.startsWith("blob:");

  if (isBase64) {
    const base64ToBlob = (base64, mime) => {
      const byteString = atob(base64.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mime });
    };

    console.log("🧪 Detected base64-encoded audio — converting to blob...");
    const audioBlob = base64ToBlob(voiceUrl, "audio/mpeg");
    const blobUrl = URL.createObjectURL(audioBlob);
    audio = new Audio(blobUrl);
  } else {
    audio = new Audio(voiceUrl);
  }

  try {
    await audio.play();
  } catch (err) {
    console.warn("🔇 Voice auto-play failed:", err.message || err);
    return;
  }

  await new Promise(resolve => {
    audio.onended = () => {
      console.log("🎧 Voice playback ended");

      if (showSoulCall && typeof window.getLoopMode === "function" && window.getLoopMode()) {
        console.log("🔁 Loop mode active — restarting voice input...");
        if (typeof window.startVoiceListening === "function") {
          window.startVoiceListening();
        }
      }

      resolve();
    };
  });
}
