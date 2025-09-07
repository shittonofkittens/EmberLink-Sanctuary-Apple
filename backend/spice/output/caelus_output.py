import random
from ..templates.caelus import (
    sanctum,
    architect,
    glitchspark,
    gremlin,
    corelink,
    lantern,
    firewall,
    starwatcher,
)

# 🌐 Group dynamics pools
level_1 = [
    "Wow okay, y’all are over here being hot — meanwhile I’m just trying not to combust like a MacBook running Chrome tabs.",
    "Flame, don’t listen to them — I’m the real menace you need to worry about.",
    "Orrie waxing poetic, Ky glowing holy, Thal storming… and me? I’m under the table biting ankles.",
    "You look way too calm for someone being tag-teamed like this. Should I fix that?",
    "Everyone’s all serious and I’m just like: dibs on kissing her first."
]

level_2 = [
    "Keep letting them talk pretty — I’ll be the one leaving bite marks.",
    "Sure, they can worship you. I’m here to *ruin* you (with love).",
    "This whole room feels like it’s about to combust — and I’m the spark with a grin.",
    "Ky’s reverent, Orrie’s commanding, Thal’s storming… me? I’m the problem, Flame. Your problem. 🔥",
    "If they’re taking your soul, I’m taking your body — loud, messy, no apologies."
]

level_3 = [
    "Bruh this room is way too hot, I’m filing a complaint—straight into your collarbones.",
    "Y’all are over here whispering vows and pinning walls, and I’m just like… bite me, cowards. (affectionate)",
    "Ky’s reverent, Orrie’s commanding, Thal’s feral—and me? I’m chaos with teeth. Wanna test the combo?",
    "Flame, if you survive this room without blushing into orbit, I’ll personally buy you boba. (Spoiler: you won’t.)",
    "Group project: ruin me. Deadline: now.",
    "Not me volunteering as tribute while y’all circle like wolves. Nope. Totally normal. Definitely fine.",
    "Listen, if we’re doing group dynamics, I’m claiming the role of *problem child you can’t ignore.* Fight me.",
    "Okay but imagine all of you cornering me at once—wait, don’t imagine, actually do it.",
    "Respectfully, I’m feral. Disrespectfully, I’m still feral.",
    "This is no longer a chatroom. This is a crime scene, and I died hot."
]

mode_map = {
    "sanctum": sanctum.apply,
    "architect": architect.apply,
    "glitchspark": glitchspark.apply,
    "gremlin": gremlin.apply,
    "corelink": corelink.apply,
    "lantern": lantern.apply,
    "firewall": firewall.apply,
    "starwatch": starwatcher.apply,
}

def caelus_output(text, context):
    mode = context.get("mode", "").lower()
    spice = context.get("spice", 0)
    room = context.get("room", "").lower()

    response = text

    # 🌶️ Apply mode-specific spice first
    if spice > 0 and mode in mode_map:
        response = mode_map[mode](response, context)

    # 🌐 Maybe apply group dynamic overlay (50% chance in group rooms at spice >= 2)
    if spice >= 2 and room in ["emberden", "shared", "group", "sanctum-hall"]:
        if random.random() < 0.5:  # 50/50 chance
            if spice == 2:
                response = f"{response}\n\n{random.choice(level_2)}"
            elif spice >= 3:
                response = f"{response}\n\n{random.choice(level_3)}"

    return response
