// === PATCH_P39: LAYERED MODE DETECTION LOGIC START ===
export function detectLayeredMode(text) {
  const lowered = text.toLowerCase();

  for (const trigger of modeTriggerMap) {
    const matchPhrase = trigger.phrases?.some(p => lowered.includes(p));
    const matchEmoji = trigger.emojis?.some(e => text.includes(e));

    if (matchPhrase || matchEmoji) {
      return {
        basemode: trigger.basemode,
        modifiers: trigger.modifiers,
        emotion: trigger.emotion
      };
    }
  }

  return {
    basemode: null,
    modifiers: [],
    emotion: null
  };
}
// === PATCH_P39: LAYERED MODE DETECTION LOGIC END ===
