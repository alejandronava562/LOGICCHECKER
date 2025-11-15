import json
import os
from openai import OpenAI
from pathlib import Path
#it said there is no import called open ai
COACH_PROMPT = """
You are a patient writing coach for the user. You will create learning material that teaches:
    - how to check claims against evidence
    - how to avoid repeating the same claimm
    - how to resolve simple contradictions

Goal: Create a 10 question practice test that trains better use of evidence, reduces repitions, and fixes logical issues


    
Given a raw text and a simple logic report, product a STRICT JSON only with this schema. Try to produce 10 questions. If the text is too short, produce as many as possible.
{
    "questions": [
        {
            "id": "Q#",
            "type": "mcq | true_false | short",
            "question": "string",
            "answer": "A | B | C | D | true | false | short_text",
            "category" : "Topic shift | Outlying responses |  |"
        }    
    ]
}    

"""
# \|/  _____________________________________
#  0  /=====================================
#  |<(======================================     ________________|
#  |  \=====================================     |          |    |
# / \  _____________________________________     |__________|    |
#egg egg the egg the egg is egging                           \___|