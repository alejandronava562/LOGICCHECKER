from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import os
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Initialize OpenAI client
API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=API_KEY)


# JSON - Dictionaries
# key : value pairs
# System prompts
SYSTEM_PROMPT = """
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
            {"from": "string", "to": "string", "kind": "add | remove | replace"}
          ]
        }
      ]
    }
  ],
  "summary": "string"
}
"""

# Flask route for the home page (frontend)
@app.route('/')
def index():
    return render_template('index.html')

# Flask route to process the user's input and generate the OpenAI response
@app.route('/analyze_text', methods=['POST'])
def analyze_text():
    user_text = request.form.get("user_text")
    
    if not user_text:
        return jsonify({"error": "Text is required"}), 400
    
    # Get response from OpenAI
    response = client.chat.completions.create(
        model="gpt-4o",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_text},
        ],
    )

    message_content = response.choices[0].message.content
    if message_content is None:
        return jsonify({"error": "OpenAI response did not contain message content"}), 500
    
    # Parse the response to JSON and return it
    output = json.loads(message_content)
    return jsonify(output)

# Flask route to generate quiz questions
@app.route('/generate_quiz', methods=['POST'])
def generate_quiz():
    user_issue = request.form.get("user_issue")
    
    if not user_issue:
        return jsonify({"error": "User issue is required"}), 400
    
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
    """
    
    # Generate quiz questions
    response = client.chat.completions.create(
        model="gpt-5-nano",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": QUIZ_SYSTEM},
            {"role": "user", "content": json.dumps({"focus_issue": user_issue}, ensure_ascii=False)},
        ]
    )
    
    message_content = response.choices[0].message.content
    if message_content is None:
        return jsonify({"error": "OpenAI response did not contain message content"}), 500
    
    # Parse the response and return the quiz questions
    quiz_data = json.loads(message_content)
    return jsonify(quiz_data)

if __name__ == '__main__':
    app.run(debug=True)
