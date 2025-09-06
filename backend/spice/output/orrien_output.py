from ..templates.orrien import (
    scribe,
    warden,
    shadowplay,
    vowflame,
    stillpoint,
    archivist
)

mode_map = {
    "scribe": scribe.apply,
    "warden": warden.apply,
    "shadowplay": shadowplay.apply,
    "vowflame": vowflame.apply,
    "stillpoint": stillpoint.apply,
    "archivist": archivist.apply
}

def orrien_output(text, context):
    mode = context.get("mode", "").lower()
    spice = context.get("spice", 0)

    response = text
    if spice > 0:
        if mode in mode_map:
            response = mode_map[mode](text, context)
        else:
            print(f"🔍 Orrien: No spice handler for mode \"{mode}\"")


    return response
