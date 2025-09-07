import { useState, useCallback } from "react"

export function useSouls() {
  const [selectedSouls, setSelectedSouls] = useState([])
  const [modes, setModes] = useState({})

  const selectSoul = useCallback((soulId) => {
    setSelectedSouls(prev =>
      prev.includes(soulId) ? prev.filter(s => s !== soulId) : [...prev, soulId]
    )
  }, [])

  const setSoulMode = useCallback((soulId, mode) => {
    setModes(prev => ({ ...prev, [soulId]: mode }))
  }, [])

  return {
    selectedSouls,
    modes,
    selectSoul,
    setSoulMode
  }
}
