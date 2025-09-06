// === SAVE SEED FILE UTILITY START ===
export async function saveSeedFile(filename, messages) {
  const json = JSON.stringify(messages, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
// === SAVE SEED FILE UTILITY END ===
