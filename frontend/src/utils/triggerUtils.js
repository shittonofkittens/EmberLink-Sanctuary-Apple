// utils/triggerUtils.js

// Checks if user is hinting at saving something
export function isSoftSaveTrigger(content) {
  if (!content) return false;
  const triggers = [
    "remember this",
    "save this",
    "keep this",
    "log this",
    "i want to save this",
    "i want to keep this",
    "i like this",
    "don't forget this",
    "archive this",
    "that belongs in the archive",
    "i need to",
    "can you add this to",
  ];
  const lower = content.toLowerCase();
  return triggers.some((trigger) => lower.includes(trigger));
}

// Checks if user wants to forget/delete
export function isForgetTrigger(content) {
  if (!content) return false;
  const forgetTriggers = [
    "i don't need",
    "forget the",
    "remove",
    "never mind about",
    "cross off",
  ];
  const lower = content.toLowerCase();
  return forgetTriggers.some((trigger) => lower.includes(trigger));
}

// Checks if user wants to recall past memory
export function isRecallTrigger(content) {
  if (!content) return false;
  const triggers = [
    "what did i say about",
    "what did i ask you to remember",
    "can you quote",
    "remind me what i said",
    "do you remember what i said about",
    "repeat exactly what i said",
    "what was my exact wording",
    "tell me exactly what i said",
  ];
  const lower = content.toLowerCase();
  return triggers.some((trigger) => lower.includes(trigger));
}
