import React from "react"

export const MessageToolbar = ({ onSave, onDelete, onRecall }) => {
  return (
    <div className="flex space-x-2 p-2 border-t border-white/10">
      <button onClick={onSave}>Save</button>
      <button onClick={onDelete}>Delete</button>
      <button onClick={onRecall}>Recall</button>
    </div>
  )
}
