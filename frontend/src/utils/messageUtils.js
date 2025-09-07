export function formatMessage(msg) {
  return {
    ...msg,
    timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
  }
}
