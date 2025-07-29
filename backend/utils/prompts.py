# backend/utils/prompts.py

PROMPT_BASE = (
    "Same dog wearing a pastel yellow hoodie with a lemon icon and green GNB tag, sitting on a clean carpet next to a lemon deodorizer box and a green houseplant, bright sunlit living room"
)

SCENARIO_DESCRIPTIONS = {
    "Lemon Fresh Morning": "Same dog wearing a pastel yellow hoodie with a lemon icon and green GNB tag, sitting on a clean carpet in a bright, sunlit living room with soft tones and green houseplants",
    "Lavender Chill Evening": "Same dog wrapped in a lavender sweater with a green GNB patch, lying on a soft rug in a warm, plant-filled bedroom with gentle lighting and natural textures",
    "Orange Grove Adventure": "Same dog in an orange bandana with a citrus icon and green GNB label, standing in a grassy open field with soft light and distant trees",
    "Grapefruit Getaway": "Same dog wearing a soft pink GNB summer shirt with a green collar tag, lounging on a bright couch surrounded by indoor plants and sheer curtains in a relaxed room",
    "Mahogany Coconut Lounge": "Same dog in a dark brown robe with a green GNB patch, resting on a plush couch with soft pillows and warm wood textures under ambient light"
}

def build_prompt(scenario: str | None = None) -> str:
    if scenario and scenario in SCENARIO_DESCRIPTIONS:
        return PROMPT_BASE + SCENARIO_DESCRIPTIONS[scenario]
    return PROMPT_BASE