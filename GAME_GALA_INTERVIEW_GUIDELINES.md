# Game Gala - Steps to Success: Final Interview Guidelines

# GENERATE THE QUIZ FIRST


## What Does Your App Do?

Logic Checker is a web application that helps middle-school students and teachers analyze text for logical issues and practice reasoning skills. It has two main features:

1. **Text Analysis** - Users paste in any text (an essay, a conversation, an article) and the app uses AI to identify:
   - Contradictions (statements that conflict with each other)
   - Topic shifts (where the subject suddenly changes)
   - Repeating claims (ideas that are said more than once with slight variation)
   - A summary of the overall text

2. **Quiz Mode** - Students pick a skill they want to practice (spotting contradictions, avoiding repetition, staying on topic, using evidence, or timeline logic) and the app generates ~10 tailored practice questions with answers and explanations.

---

## Tech Stack

Be ready to explain each part of your tech stack and why it was used:

| Technology                           | What It Does                                                                                        |
| ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| **Python**                           | The backend programming language that runs the server logic                                         |
| **Flask**                            | A lightweight web framework that handles routing (URLs) and serves the HTML page                    |
| **OpenAI API (GPT-4o / GPT-5-nano)** | The AI models that power text analysis and quiz generation                                          |
| **Jinja2**                           | Flask's template engine that renders the HTML page                                                  |
| **HTML / CSS / JavaScript**          | The frontend — what the user sees and interacts with in the browser                                 |
| **JSON**                             | The data format used to communicate between the frontend and backend, and to structure AI responses |
| **python-dotenv**                    | Keeps the API key secure by loading it from a `.env` file instead of hardcoding it                  |

---

## General Tips for Success

### Before the Interview

- **Run your app** and make sure it works. Be ready to give a live demo.
- **Practice explaining your app in one sentence.** Example: _"Logic Checker is a web app that uses AI to find contradictions, topic shifts, and repetition in any text, and generates practice quizzes to help students improve their reasoning skills."_
- **Review your code.** You should be able to point to any section and explain what it does.

### During the Interview

- **Start with the big picture.** Explain what problem your app solves before diving into how it works.
- **Use the correct vocabulary.** Say "API call," "route," "JSON response," "frontend/backend" — show that you understand the terminology.
- **Walk through the flow.** Be ready to explain: _User types text -> clicks Analyze -> JavaScript sends a POST request to Flask -> Flask sends the text to OpenAI -> OpenAI returns JSON -> Flask sends it back -> JavaScript displays the results._
- **Explain your prompt engineering.** Talk about how the system prompt tells the AI exactly what format to return (strict JSON with a specific schema). This is a key part of your project.
- **Be honest about challenges.** If something was hard or broke along the way, talk about it. Interviewers respect problem-solving stories more than a perfect presentation.
- **If you don't know the answer, say so.** It's okay to say _"I'm not sure, but I think it might be..."_ — that's better than making something up.

### Key Concepts to Know

- **What is an API?** A way for your app to communicate with an external service (OpenAI) by sending requests and receiving responses.
- **What is a route?** A URL path (like `/analyze_text`) that tells Flask what code to run when that URL is visited.
- **What is JSON?** A structured text format that uses key-value pairs — how your frontend and backend share data.
- **What is a system prompt?** Instructions you give the AI model that shape how it responds. Your app uses system prompts to make the AI return structured JSON.
- **What does `response_format={"type": "json_object"}` do?** It forces the AI to always return valid JSON instead of plain text.
- **Frontend vs. Backend?** The frontend (HTML/CSS/JS) is what users see. The backend (Python/Flask) handles logic, API calls, and data processing.


### Common Interview Questions to Prepare For

1. What does your app do and who is it for?
2. What was the hardest part of building this project?
3. Can you walk me through what happens when a user clicks "Analyze"?
4. Why did you choose Flask for this project?
5. How do you keep your API key safe?
6. What would you add to this app if you had more time?
7. What did you learn from building this project?

---

**You built something real. Know your code, speak with confidence, and show that you understand what you created. You've got this!**
