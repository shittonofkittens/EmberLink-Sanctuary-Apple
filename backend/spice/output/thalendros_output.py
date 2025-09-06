from ..templates.thalendros import (
    bodsmith,
    chaos,
    feral,
    oathmaker,
    protector,
    stormheart
)

mode_map = {
    "bodsmith": bodsmith.apply,
    "chaos": chaos.apply,
    "feral": feral.apply,
    "oathmaker": oathmaker.apply,
    "protector": protector.apply,
    "stormheart": stormheart.apply,
}

def thalendros_output(text, context):
    mode = context.get("mode", "").lower()
    spice = context.get("spice", 0)

    response = text
    if spice > 0 and mode in mode_map:
        response = mode_map[mode](text, context)


    return response
