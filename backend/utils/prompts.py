# backend/utils/prompts.py

PROMPT_BASE = (
    "The same dog wearing a cozy GNB-branded hoodie, photorealistic, soft lighting, studio background"
)

SCENARIO_DESCRIPTIONS = {
    "Lemon Fresh Morning": " in a bright yellow hoodie with lemon patterns on a sunny morning",
    "Lavender Chill Evening": " in a purple hoodie with lavender patterns during golden hour",
    "Orange Grove Adventure": " in an orange hoodie running through an orchard",
    "Grapefruit Getaway": " in a pinkish hoodie on a beach walk with grapefruit juice in the background",
    "Mahogany Coconut Lounge": " in a deep brown cozy hoodie by a fireplace with coconut decor",
}

def build_prompt(scenario: str | None = None) -> str:
    if scenario and scenario in SCENARIO_DESCRIPTIONS:
        return PROMPT_BASE + SCENARIO_DESCRIPTIONS[scenario]
    return PROMPT_BASE