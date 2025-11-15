from openai import OpenAI
import json
import os
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=API_KEY)

# --- NAMES HERE --- #
# Alejandro

# ------------------ #

user_prompt = "I like rats. I think rats are cool. I hate rats. Rats are amazing"

system_prompt = """
You are a helpful, friendly logic analyzing assistant. Given a raw conversation or text, do the following and return a STRICT JSON only.

1) Summaries of the topics explaining the claims inside the text
2) Find clear contradictions inside the text
3) Find any topic shifts inside the text
4) Finding repeating claims
Return JSON only with this schema:
{
  "contradictions": [
    {
      "reason": "string",
      "a_snippet": "string",
      "b_snippet": "string"
    }
  ],
  "topic_shifts": [
    {
      "from_topic": "string",
      "to_topic": "string",
      "snippet": "string"
    }
  ],
  "repeating_claims": [
    {
      "subject": "string",
      "base_claim": "string"
      "count" : 0,
      "variations": [
        {
          "text" : "string"
          "difference" : "string"
          "change_phrase" : [
            {"from": "string",
            "to": "string",
            "kind": "add | remove | replace",
            }
          ]
        }
      ]
    }
  ],
  "summary": "string"
}
"""

# wait can we like also add if its repeated that the ai looks for changes in the repeated thing
response = client.chat.completions.create(
    model="gpt-4o",
    response_format={"type": "json_object"},
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ],
)

output = json.loads(response.choices[0].message.content)
print(output)

# rat = ["rat one", "rat two", "rat three", "rat four"]
