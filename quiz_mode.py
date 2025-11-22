from pathlib import Path
from openai import OpenAI
from datetime import datetime
from dotenv import load_dotenv
import json
import os

# ================ #
#     CLient       #
# ================ #
load_dotenv()
API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=API_KEY)

# ================ #
#  Focus Question  #
# ================ #
QUESTION_SYSTEM = """
You are a friendly logic tutor. 

Your job is to ask the user ONE short answer question that helps you understand what kind logic skill/issue the user wants to practice/improve on.

Return a STRICT JSON only with this format:
{
    "question": "string"
}

Rules:
- Ask only one simple question
- Example skills: spotting contradictions, 
"""

QUIZ_SYSTEM = """
You are a helpful coach that creates a set of logic practice questions
for middle school students.

You will receive a JSON object with:
{
  "focus_issue": "string"
}

focus_issue is what the student says they are struggling with, for example:
"spotting contradictions", "avoiding repetition", "staying on topic",
"using evidence", or "timeline and order of events".

Your job is to generate a quiz of about 10 questions that mainly practice this focus_issue.

Return STRICT JSON only with this schema:
{
  "questions": [
    {
      "id": "Q#",
      "type": "mcq | true_false | short",
      "question": "string",
      "choices": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "answer": "A | B | C | D | true | false | short_text",
      "explain": "one sentence why",
      "skill": "evidence_check | contradiction_fix | reduce_repetition | topic_shift | timeline_logic",
      "source_snippets": ["short phrase 1", "short phrase 2"],
      "difficulty": "easy | medium | hard"
    }
  ],
  "summary_for_teacher": "1 to 2 lines about what this set teaches"
}

Rules:
- Tailor most questions to the focus_issue.
  - If it mentions contradiction, use many contradiction_fix items.
  - If it mentions repetition, use many reduce_repetition items.
  - If it mentions topic, use many topic_shift items.
  - If it mentions time or order, use many timeline_logic items.
  - If it is general or unclear, mix all skills.
- Try to generate 10 questions. If you cannot, generate as many good ones as possible.
- For short questions, set choices to an empty list [].
- Make source_snippets short generic phrases that match the skill.
- Write explanations in one sentence, simple language.
- Output JSON only.
"""

def focus():
    response = client.chat.completions.create(
        model="gpt-5-nano",
        response_format={"type":"json_object"},
        messages=[
            {"role":"system", "content": QUESTION_SYSTEM},
            {"role":"user", "content": "Ask what I need help with"},
        ]
    )
    # message.content is Optional[str]; guard against missing content to avoid json.loads(None)
    message_content = response.choices[0].message.content
    if message_content is None:
        raise ValueError("OpenAI response did not contain message content.")
    data = json.loads(message_content)
    return data["question"]

def generating_quiz(user_issue: str):
    payload = {"focus_issue": user_issue}
    response = client.chat.completions.create(
        model="gpt-5",
        response_format={"type":"json_object"},
        messages=[
            {"role":"system", "content": QUIZ_SYSTEM},
            {"role":"user", "content": json.dumps(payload, ensure_ascii=False)},
        ]
    )
    # message.content is Optional[str]; guard against missing content to avoid json.loads(None)
    message_content = response.choices[0].message.content
    if message_content is None:
        raise ValueError("OpenAI response did not contain message content.")
    data = json.loads(message_content)
    return data

def run_quiz(questions: list[dict]):
    
    score = 0
    total = 0
    results = []
    print("\n --- Starting Quiz --- \n")
    for question in questions:
        qnum = question.get("id", "")
        qtype = question.get("type", "mcq")
        qtext = question.get("question")
        correct_answer = question.get("answer")
        
        print(f"{qnum}. {qtext}")

def main():
    q = focus()
    print(q)
    user_issue = input("> ").strip()
    while not user_issue:
        print("please give me a response")
        user_issue = input("> ").strip()
    quiz = generating_quiz(user_issue)
    questions = quiz.get("questions")
    run_quiz(questions)

if __name__ == "__main__":
    main()



# \|/  _____________________________________
#  0  /=====================================
#  |<(======================================     ________________|
#  |  \=====================================     |          |    |
# / \  _____________________________________     |__________|    |
#egg egg the egg the egg is egging                           \___| yahaha you found me 
