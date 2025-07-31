import json
import os

PROMPT_BASE = "Same dog"

# Load JSON once when module loads
with open(os.path.join(os.path.dirname(__file__), "../assets/prompts.json"), "r", encoding="utf-8") as f:
    prompt_data = json.load(f)

CLOTHING_DESCRIPTIONS = prompt_data["clothing"]
SCENARIO_DESCRIPTIONS = prompt_data["scenario"]

def build_prompt(scenario: str | None = None, clothing: str | None = None) -> str:
    clothing_part = CLOTHING_DESCRIPTIONS.get(clothing, "")
    scenario_part = SCENARIO_DESCRIPTIONS.get(scenario, "")

    prompt = PROMPT_BASE
    if clothing_part:
        prompt += f" {clothing_part}"
    if scenario_part:
        prompt += f" clothes are {scenario_part}"
    return prompt
