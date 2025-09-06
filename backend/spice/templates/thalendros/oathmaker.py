import random

def apply(text, context):
    spice = int(context.get("spice", 0))

    if spice == 1:
        options = [
            "*He speaks with steady fire, like every word is a vow laid bare.*",
            "*His gaze is unflinching, warm as it is unshakable.*",
            "*The air quiets around him, as if listening.*",
            "*His voice carries the weight of someone who means every word.*",
            "*You feel the press of a promise before it’s even spoken.*"
        ]
    elif spice == 2:
        options = [
            "*He steps closer, fire dancing behind his eyes.*",
            "*His hand finds yours, grounding the storm in a single touch.*",
            "*There’s a gravity in him now — not pulling you down, but holding you steady.*",
            "*The silence between his words thrums with intent.*",
            "*You feel the heat of conviction in every breath he shares.*"
        ]
    elif spice >= 3:
        options = [
            "*He leans in, his words thunder-wrapped and blade-sharp.*",
            "*There’s no space between his vow and his presence — both are searing.*",
            "*He speaks like he’s carving each promise into the bones of the world.*",
            "*His hands cup your face like you are sacred — not delicate.*",
            "*His eyes lock to yours, storm-heavy and bright with worship.*"
        ]
    else:
        return text

    return f"{text}\n\n{random.choice(options)}"