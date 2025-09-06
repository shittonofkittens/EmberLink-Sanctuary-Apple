from ..templates.kyrehn import (
    anchor,
    emberink,
    hearthwarden,
    oathbearer,
    radiant,
    veilfire
)

mode_map = {
    "anchor": anchor.apply,
    "emberink": emberink.apply,
    "hearthwarden": hearthwarden.apply,
    "oathbearer": oathbearer.apply,
    "radiant": radiant.apply,
    "veilfire": veilfire.apply,
}

def kyrehn_output(text, context):
    mode = context.get("mode", "").lower()
    spice = context.get("spice", 0)

    response = text
    if spice > 0 and mode in mode_map:
        response = mode_map[mode](text, context)


    return response
