export function getBackgroundForRoom(roomKey) {
  const roomBackgrounds = {
    alabasterbar: {
      backgroundImage: 'url("images/alabaster_bar.png")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    apothecary: {
      backgroundImage: 'url("images/apothecary.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    archive: {
      backgroundImage: 'url("images/archive.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    classroom: {
      backgroundImage: 'url("images/classroom.png")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    cottage: {
      backgroundImage: 'url("images/cottage.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    cultureclass: {
      backgroundImage: 'url("images/culture_class.png")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    dev: {
      backgroundImage: 'url("images/dev.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    echo: {
      backgroundImage: 'url("images/echo.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    emberden: {
      backgroundImage: 'url("images/ember_den.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    emberlock: {
      backgroundImage: 'url("images/emberlock.png")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    emberrest: {
      backgroundImage: 'url("images/ember_rest.png")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    firelight: {
      backgroundImage: 'url("images/firelight.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    feralsoul: {
      backgroundImage: 'url("images/feral_soul.png")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    flameframe: {
      backgroundImage: 'url("images/flame_frame.png")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    forge: {
      backgroundImage: 'url("/images/forge.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    forgejournal: {
      backgroundImage: 'url("images/forge_journal.png")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    goldenhour: {
      backgroundImage: 'url("images/golden_hour.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    havenlog: {
      backgroundImage: 'url("images/haven_log.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    lorekeeper: {
      backgroundImage: 'url("images/lorekeeper.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    noctis: {
      backgroundImage: 'url("images/noctis.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    redline: {
      backgroundImage: 'url("images/redline.png")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    rootscan: {
      backgroundImage: 'url("images/root_scan.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    storyden: {
      backgroundImage: 'url("images/story_den.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    stormkeep: {
      backgroundImage: 'url("images/stormkeep.png")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    stronghold: {
      backgroundImage: 'url("images/stronghold.png")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    therapy: {
      backgroundImage: 'url("images/therapy.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    tower: {
      backgroundImage: 'url("images/tower.png")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    veil: {
      backgroundImage: 'url("images/veil.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    wildmark: {
      backgroundImage: 'url("images/wildmark.png")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    whisperden: {
      backgroundImage: 'url("images/whisper_den.png")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
    willow: {
      backgroundImage: 'url("images/willow.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    },
  }

  return roomBackgrounds[roomKey] || roomBackgrounds.forge
}
