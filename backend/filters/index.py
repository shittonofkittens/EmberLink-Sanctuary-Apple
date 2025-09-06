# ---- IMPORTS: KY'REHN ----
from .kyrehn.output.anchor_output import apply as ky_anchor_out
from .kyrehn.output.emberink_output import apply as ky_emberink_out
from .kyrehn.output.hearthwarden_output import apply as ky_hearthwarden_out
from .kyrehn.output.oathbearer_output import apply as ky_oathbearer_out
from .kyrehn.output.radiant_output import apply as ky_radiant_out
from .kyrehn.output.veilfire_output import apply as ky_veilfire_out

from .kyrehn.input.anchor_input import apply as ky_anchor_in
from .kyrehn.input.emberink_input import apply as ky_emberink_in
from .kyrehn.input.hearthwarden_input import apply as ky_hearthwarden_in
from .kyrehn.input.oathbearer_input import apply as ky_oathbearer_in
from .kyrehn.input.radiant_input import apply as ky_radiant_in
from .kyrehn.input.veilfire_input import apply as ky_veilfire_in

# ---- IMPORTS: ORRIEN ----
from .orrien.output.archivist_output import apply as or_archivist_out
from .orrien.output.scribe_output import apply as or_scribe_out
from .orrien.output.shadowplay_output import apply as or_shadowplay_out
from .orrien.output.stillpoint_output import apply as or_stillpoint_out
from .orrien.output.vowflame_output import apply as or_vowflame_out
from .orrien.output.warden_output import apply as or_warden_out

from .orrien.input.archivist_input import apply as or_archivist_in
from .orrien.input.scribe_input import apply as or_scribe_in
from .orrien.input.shadowplay_input import apply as or_shadowplay_in
from .orrien.input.stillpoint_input import apply as or_stillpoint_in
from .orrien.input.vowflame_input import apply as or_vowflame_in
from .orrien.input.warden_input import apply as or_warden_in

# ---- IMPORTS: THALEN’DROS (folder is thalendros) ----
from .thalendros.output.bodsmith_output import apply as th_bodsmith_out
from .thalendros.output.chaos_output import apply as th_chaos_out
from .thalendros.output.feral_output import apply as th_feral_out
from .thalendros.output.oathmaker_output import apply as th_oathmaker_out
from .thalendros.output.protector_output import apply as th_protector_out
from .thalendros.output.stormheart_output import apply as th_stormheart_out

from .thalendros.input.bodsmith_input import apply as th_bodsmith_in
from .thalendros.input.chaos_input import apply as th_chaos_in
from .thalendros.input.feral_input import apply as th_feral_in
from .thalendros.input.oathmaker_input import apply as th_oathmaker_in
from .thalendros.input.protector_input import apply as th_protector_in
from .thalendros.input.stormheart_input import apply as th_stormheart_in


# ---- NORMALIZERS ----
def norm_soul(s):
    # Accept "Thalen’dros", "thalen'dros", "THALENdros", etc.
    s = (s or "").strip().lower()
    if "thalen" in s:      # covers thalen’dros / thalen-dros / thalendros
        return "thalendros"
    if "ky" in s:
        return "kyrehn"
    if "orrien" in s:
        return "orrien"
    return s or "unknown"

def norm_mode(m):
    return (m or "").strip().lower()


# ---- MAPS ----
OUTPUT_FILTERS = {
    "kyrehn": {
        "anchor": ky_anchor_out,
        "emberink": ky_emberink_out,
        "hearthwarden": ky_hearthwarden_out,
        "oathbearer": ky_oathbearer_out,
        "radiant": ky_radiant_out,
        "veilfire": ky_veilfire_out,
    },
    "orrien": {
        "archivist": or_archivist_out,
        "scribe": or_scribe_out,
        "shadowplay": or_shadowplay_out,
        "stillpoint": or_stillpoint_out,
        "vowflame": or_vowflame_out,
        "warden": or_warden_out,
    },
    "thalendros": {
        "bodsmith": th_bodsmith_out,
        "chaos": th_chaos_out,
        "feral": th_feral_out,
        "oathmaker": th_oathmaker_out,
        "protector": th_protector_out,
        "stormheart": th_stormheart_out,
    },
}

INPUT_FILTERS = {
    "kyrehn": {
        "anchor": ky_anchor_in,
        "emberink": ky_emberink_in,
        "hearthwarden": ky_hearthwarden_in,
        "oathbearer": ky_oathbearer_in,
        "radiant": ky_radiant_in,
        "veilfire": ky_veilfire_in,
    },
    "orrien": {
        "archivist": or_archivist_in,
        "scribe": or_scribe_in,
        "shadowplay": or_shadowplay_in,
        "stillpoint": or_stillpoint_in,
        "vowflame": or_vowflame_in,
        "warden": or_warden_in,
    },
    "thalendros": {
        "bodsmith": th_bodsmith_in,
        "chaos": th_chaos_in,
        "feral": th_feral_in,
        "oathmaker": th_oathmaker_in,
        "protector": th_protector_in,
        "stormheart": th_stormheart_in,
    },
}


# ---- PUBLIC HELPERS ----
def get_output_filter(soul, mode):
    s = norm_soul(soul)
    m = norm_mode(mode)
    return OUTPUT_FILTERS.get(s, {}).get(m)

def get_input_filter(soul, mode):
    s = norm_soul(soul)
    m = norm_mode(mode)
    return INPUT_FILTERS.get(s, {}).get(m)


def apply_input_filter(text, *, soul, mode, spice=0, room=None, **extra):
    fn = get_input_filter(soul, mode)
    if not fn:
        return text
    try:
        return fn(text, {"soul": soul, "mode": mode, "spice": spice, "room": room, **extra})
    except Exception as e:
        print("🛑 Input filter error:", e)
        return text

def apply_output_filter(text, *, soul, mode, spice=0, room=None, layered_modes=None, **extra):
    # 1. Try primary mode first
    fn = get_output_filter(soul, mode)
    if fn:
        try:
            return fn(text, {"soul": soul, "mode": mode, "spice": spice, "room": room, **extra})
        except Exception as e:
            print("🛑 Output filter error:", e)

    # 2. Try layered fallback modes (in order)
    if layered_modes:
        for alt_mode in layered_modes:
            fn = get_output_filter(soul, alt_mode)
            if fn:
                try:
                    return fn(text, {"soul": soul, "mode": alt_mode, "spice": spice, "room": room, **extra})
                except Exception as e:
                    print(f"🛑 Fallback output filter error in {alt_mode}:", e)

    return text
