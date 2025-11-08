from openai import OpenAI
import json
client = OpenAI()

user_prompt = "I think that taxes should be to provide free mozarella for everyone in the world. I approve. I think that dogs are evil. I think that dogs are the best animals ever and are morally good. I think cats are cool. I think cats are ugly"

system_prompt = """\
You are a helpful, friendly logic analyzing assistant. Given a raw conversation or text, do the following and return a STRICT JSON only.

1) Summaries of the topics explaining the claims inside the text
2) Find clear contradictions inside the text:
   A contradiction is when the same subject is affirmed in one place and 
   denied in another without a clear explanation 
   Example: “My favorite food is mashed potatoes.” vs  “My favorite food is sushi”
3) Return JSON only with this schema:
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
  "summary": "string"
}
"""

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]
)

output = json.load()

# rat = ["rat one", "rat two", "rat three", "rat four"]
