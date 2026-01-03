const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');
const state = {
  analysisResults: null,
  quizResult: null,
  currentQuestion: 0,
  selectedAnswer: "",
  shortAnswer: false,
  practiceActive: false,
}
// Text Analysis refs
const analysisButton = document.getElementById('analyzeBtn');
const analysisText = document.getElementById("analysisText");
const analyzeBtn = document.getElementById("analyzeBtn");
const clearAnalysisBtn = document.getElementById('clearAnalysisBtn');
const pasteAnalysisBtn = document.getElementById('pasteAnalysisBtn');
const sampleAnalysisBtn = document.getElementById('sampleAnalysisBtn');
const analysisResults = document.getElementById('analysisResults');
const analysisError = document.getElementById('analysisError');
const analysisJsonWrap = document.getElementById('analysisJsonWrap');
const toggleAnalysisJson = document.getElementById('toggleAnalysisJson');

// Clear analysis action --- //
if (clearAnalysisBtn) {
  clearAnalysisBtn.addEventListener('click', () => {
    if (analysisText) analysisText.value = '';
    if (analysisResults) analysisResults.classList.add('hidden');
    if (analysisError) {
      analysisError.textContent = '';
      analysisError.classList.add('hidden');
    }
    if (analysisJsonWrap) analysisJsonWrap.classList.add('hidden');
    if (toggleAnalysisJson) toggleAnalysisJson.textContent = 'Show JSON';
  });
}

if (sampleAnalysisBtn) {
  sampleAnalysisBtn.addEventListener('click', () => {
    if (analysisText) analysisText.value = "1+1=2. 1+1=3";
    clearError(analysisError);
  });
}

const analysisSummary = document.getElementById("analysisSummary");
const contradictionsList = document.getElementById("contradictionsList");
const contradictionCount = document.getElementById("contradictionCount");
const topicShiftList = document.getElementById("topicShiftList");
const topicShiftCount = document.getElementById("topicShiftCount");
const repeatingList = document.getElementById("repeatingList");
const repeatingCount = document.getElementById("repeatingCount");
const analysisJson = document.getElementById("analysisJson");
const copyAnalysisJson = document.getElementById("copyAnalysisJson");

const issueSelect = document.getElementById("issueSelect");
const customIssueWrap = document.getElementById("customIssueWrap");
const customIssue = document.getElementById("customIssue");
const generateQuizBtn = document.getElementById("generateQuizBtn");
const quizError = document.getElementById("quizError");
const quizResults = document.getElementById("quizResults");
const questionCount = document.getElementById("questionCount");
const questionCountHeader = document.getElementById("questionCountHeader");
const questionList = document.getElementById("questionList");
const copyQuizJson = document.getElementById("copyQuizJson");
const toggleQuizJson = document.getElementById("toggleQuizJson");
const quizJson = document.getElementById("quizJson");
const quizJsonWrap = document.getElementById("quizJsonWrap");
const startPracticeBtn = document.getElementById("startPracticeBtn");
const practiceMode = document.getElementById("practiceMode");
const practiceBody = document.getElementById("practiceBody");
const exitPracticeBtn = document.getElementById("exitPracticeBtn");
const progressLabel = document.getElementById("progressLabel");
const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");

const toastContainer = document.getElementById("toastContainer");

const toTitleCase = (value) => {
  if (!value) return "";
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const showToast = (message, type = "success") => {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
};

const setTab = (tabName) => {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === tabName;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === tabName);
  });
};

const showError = (element, message) => {
  element.textContent = message;
  element.classList.remove("hidden");
};

const clearError = (element) => {
  element.textContent = "";
  element.classList.add("hidden");
};

const resetAnalysis = () => {
  analysisText.value = "";
  analysisResults.classList.add("hidden");
  analysisJsonWrap.classList.add("hidden");
  toggleAnalysisJson.textContent = "Show JSON";
  state.analysisResult = null;
  clearError(analysisError);
};

const setLoading = (button, loading, label, loadingLabel) => {
  button.disabled = loading;
  button.textContent = loading ? loadingLabel : label;
};

const renderEmpty = (container, message) => {
  const p = document.createElement("p");
  p.className = "empty-state";
  p.textContent = message;
  container.appendChild(p);
};

const renderAnalysisResult = (data) => {
  analysisResults.classList.remove("hidden");
  analysisSummary.textContent = data.summary || "No summary available.";

  contradictionsList.innerHTML = "";
  const contradictions = Array.isArray(data.contradictions) ? data.contradictions : [];
  contradictionCount.textContent = contradictions.length;
  if (contradictions.length === 0) {
    renderEmpty(contradictionsList, "No contradictions found in this text.");
  } else {
    contradictions.forEach((item) => {
      const wrapper = document.createElement("div");
      wrapper.className = "result-item";
      const reason = document.createElement("p");
      reason.textContent = item.reason || "";
      wrapper.appendChild(reason);
      const snippetA = document.createElement("div");
      snippetA.className = "snippet";
      const badgeA = document.createElement("span");
      badgeA.className = "badge badge-outline";
      badgeA.textContent = "A";
      const snippetAText = document.createElement("p");
      snippetAText.textContent = item.a_snippet || item.snippetA || "";
      snippetA.appendChild(badgeA);
      snippetA.appendChild(snippetAText);
      const snippetB = document.createElement("div");
      snippetB.className = "snippet";
      const badgeB = document.createElement("span");
      badgeB.className = "badge badge-outline";
      badgeB.textContent = "B";
      const snippetBText = document.createElement("p");
      snippetBText.textContent = item.b_snippet || item.snippetB || "";
      snippetB.appendChild(badgeB);
      snippetB.appendChild(snippetBText);
      wrapper.appendChild(snippetA);
      wrapper.appendChild(snippetB);
      contradictionsList.appendChild(wrapper);
    });
  }

  topicShiftList.innerHTML = "";
  const topicShifts = Array.isArray(data.topic_shifts) ? data.topic_shifts : data.topicShifts || [];
  topicShiftCount.textContent = topicShifts.length;
  if (topicShifts.length === 0) {
    renderEmpty(topicShiftList, "No topic shifts found in this text.");
  } else {
    topicShifts.forEach((item) => {
      const wrapper = document.createElement("div");
      wrapper.className = "result-item topic-shift";
      const badgeRow = document.createElement("div");
      badgeRow.className = "topic-badges";
      const from = document.createElement("span");
      from.className = "topic-pill";
      from.textContent = item.from_topic || item.from || "";
      const arrow = document.createElement("span");
      arrow.textContent = "?";
      arrow.className = "muted";
      const to = document.createElement("span");
      to.className = "topic-pill";
      to.textContent = item.to_topic || item.to || "";
      badgeRow.appendChild(from);
      badgeRow.appendChild(arrow);
      badgeRow.appendChild(to);
      const snippet = document.createElement("p");
      snippet.className = "muted";
      snippet.textContent = item.snippet || "";
      wrapper.appendChild(badgeRow);
      wrapper.appendChild(snippet);
      topicShiftList.appendChild(wrapper);
    });
  }

  repeatingList.innerHTML = "";
  const repeatingClaims = Array.isArray(data.repeating_claims)
    ? data.repeating_claims
    : data.repeatingClaims || [];
  repeatingCount.textContent = repeatingClaims.length;
  if (repeatingClaims.length === 0) {
    renderEmpty(repeatingList, "No repeating claims found in this text.");
  } else {
    repeatingClaims.forEach((item) => {
      const container = document.createElement("div");
      container.className = "result-item";

      const subject = document.createElement("p");
      subject.innerHTML = `<strong>Subject:</strong> ${item.subject || ""}`;
      const base = document.createElement("p");
      base.innerHTML = `<strong>Base claim:</strong> ${item.base_claim || item.baseClaim || ""}`;
      const count = document.createElement("p");
      count.innerHTML = `<strong>Count:</strong> ${item.count || 0} times`;

      const details = document.createElement("details");
      details.className = "collapsible";
      const summary = document.createElement("summary");
      summary.textContent = "View variations";
      details.appendChild(summary);

      const variations = Array.isArray(item.variations) ? item.variations : [];
      if (variations.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "No variations listed.";
        details.appendChild(empty);
      } else {
        variations.forEach((variation) => {
          const variationText = typeof variation === "string" ? variation : variation.text || "";
          const p = document.createElement("p");
          p.className = "muted";
          p.textContent = variationText;
          details.appendChild(p);
        });
      }

      container.appendChild(subject);
      container.appendChild(base);
      container.appendChild(count);
      container.appendChild(details);
      repeatingList.appendChild(container);
    });
  }

  analysisJson.textContent = JSON.stringify(data, null, 2);
};

const renderQuestionList = (questions) => {
  questionList.innerHTML = "";
  questions.forEach((q, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "question-card";

    const badgeRow = document.createElement("div");
    badgeRow.className = "inline";

    const indexBadge = document.createElement("span");
    indexBadge.className = "badge badge-outline";
    indexBadge.textContent = `Q${index + 1}`;

    const typeBadge = document.createElement("span");
    typeBadge.className = "badge badge-outline";
    typeBadge.textContent = formatQuestionType(q.type);

    const difficultyBadge = document.createElement("span");
    difficultyBadge.className = `badge ${difficultyClass(q.difficulty)}`;
    difficultyBadge.textContent = toTitleCase(q.difficulty || "");

    const skillBadge = document.createElement("span");
    skillBadge.className = "badge badge-outline";
    skillBadge.textContent = q.skill || "";

    badgeRow.appendChild(indexBadge);
    badgeRow.appendChild(typeBadge);
    badgeRow.appendChild(difficultyBadge);
    badgeRow.appendChild(skillBadge);

    const questionText = document.createElement("p");
    questionText.textContent = q.question || "";

    wrapper.appendChild(badgeRow);
    wrapper.appendChild(questionText);

    if (Array.isArray(q.choices) && q.choices.length > 0) {
      const choices = document.createElement("div");
      choices.className = "question-choices";
      q.choices.forEach((choice) => {
        const p = document.createElement("p");
        p.textContent = choice;
        choices.appendChild(p);
      });
      wrapper.appendChild(choices);
    }

    const details = document.createElement("details");
    details.className = "collapsible";
    const summary = document.createElement("summary");
    summary.textContent = "Show answer & explanation";
    details.appendChild(summary);

    const answer = document.createElement("p");
    answer.innerHTML = `<strong>Answer:</strong> ${formatAnswer(q)}`;
    const explain = document.createElement("p");
    explain.className = "muted";
    explain.textContent = q.explain || q.explanation || "";

    details.appendChild(answer);
    details.appendChild(explain);

    if (Array.isArray(q.source_snippets) && q.source_snippets.length > 0) {
      const snippet = document.createElement("p");
      snippet.className = "muted";
      snippet.textContent = q.source_snippets.join(" ");
      details.appendChild(snippet);
    }

    wrapper.appendChild(details);
    questionList.appendChild(wrapper);
  });
};

const formatQuestionType = (type) => {
  if (!type) return "";
  if (type.toLowerCase() === "mcq") return "MCQ";
  if (type.toLowerCase() === "true_false") return "True-False";
  if (type.toLowerCase() === "short") return "Short";
  return type;
};

const difficultyClass = (difficulty) => {
  const normalized = (difficulty || "").toLowerCase();
  if (normalized === "easy") return "badge-secondary";
  if (normalized === "medium") return "badge-default";
  if (normalized === "hard") return "badge-destructive";
  return "badge-outline";
};

const formatAnswer = (question) => {
  if (!question) return "";
  if (question.type === "short" && question.answer === "short_text") {
    return "Sample answer provided during practice mode";
  }
  return question.answer || question.correctAnswer || "";
};

const normalizeAnswer = (value) => String(value || "").trim().toLowerCase();

const getAnswerValue = (question) => {
  const answer = question.answer || question.correctAnswer || "";
  return normalizeAnswer(answer);
};

const getChoiceLetter = (choice) => {
  if (!choice) return "";
  return choice.trim().charAt(0).toUpperCase();
};

const renderPracticeQuestion = () => {
  if (!state.quizResult || !state.quizResult.questions) return;
  const question = state.quizResult.questions[state.currentQuestion];
  practiceBody.innerHTML = "";

  progressLabel.textContent = `Question ${state.currentQuestion + 1} of ${state.quizResult.questions.length}`;
  const percent = Math.round(((state.currentQuestion + 1) / state.quizResult.questions.length) * 100);
  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;

  const badgeRow = document.createElement("div");
  badgeRow.className = "inline";

  const typeBadge = document.createElement("span");
  typeBadge.className = "badge badge-outline";
  typeBadge.textContent = formatQuestionType(question.type);

  const difficultyBadge = document.createElement("span");
  difficultyBadge.className = `badge ${difficultyClass(question.difficulty)}`;
  difficultyBadge.textContent = toTitleCase(question.difficulty || "");

  const skillBadge = document.createElement("span");
  skillBadge.className = "badge badge-outline";
  skillBadge.textContent = question.skill || "";

  badgeRow.appendChild(typeBadge);
  badgeRow.appendChild(difficultyBadge);
  badgeRow.appendChild(skillBadge);

  const questionText = document.createElement("h4");
  questionText.textContent = question.question || "";

  practiceBody.appendChild(badgeRow);
  practiceBody.appendChild(questionText);

  const optionsWrap = document.createElement("div");
  optionsWrap.className = "stack";

  let inputArea = null;

  if (question.type === "mcq" && Array.isArray(question.choices)) {
    question.choices.forEach((choice) => {
      const letter = getChoiceLetter(choice);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "practice-option";
      btn.textContent = choice;
      btn.dataset.answer = letter;
      btn.addEventListener("click", () => selectAnswer(letter));
      optionsWrap.appendChild(btn);
    });
  } else if (question.type === "true_false") {
    ["true", "false"].forEach((option) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "practice-option";
      btn.textContent = toTitleCase(option);
      btn.dataset.answer = option;
      btn.addEventListener("click", () => selectAnswer(option));
      optionsWrap.appendChild(btn);
    });
  } else {
    inputArea = document.createElement("textarea");
    inputArea.rows = 4;
    inputArea.placeholder = "Type your answer here...";
    inputArea.addEventListener("input", (event) => {
      if (state.showAnswer) return;
      state.selectedAnswer = event.target.value;
    });
    optionsWrap.appendChild(inputArea);
  }

  practiceBody.appendChild(optionsWrap);

  const feedbackWrap = document.createElement("div");

  const actionRow = document.createElement("div");
  actionRow.className = "actions";

  const actionBtn = document.createElement("button");
  actionBtn.className = "btn btn-primary";
  actionBtn.textContent = state.showAnswer
    ? state.currentQuestion < state.quizResult.questions.length - 1
      ? "Next Question"
      : "Finish Quiz"
    : "Check Answer";

  actionBtn.addEventListener("click", () => {
    if (!state.showAnswer) {
      checkAnswer(question, optionsWrap, feedbackWrap, inputArea);
    } else {
      nextQuestion();
    }
  });

  actionRow.appendChild(actionBtn);
  practiceBody.appendChild(feedbackWrap);
  practiceBody.appendChild(actionRow);
};

const selectAnswer = (answer) => {
  if (state.showAnswer) return;
  state.selectedAnswer = answer;
  const options = practiceBody.querySelectorAll(".practice-option");
  options.forEach((option) => {
    option.classList.toggle("selected", option.dataset.answer === answer);
  });
};

const checkAnswer = (question, optionsWrap, feedbackWrap, inputArea) => {
  if (question.type !== "short" && !state.selectedAnswer) {
    showToast("Please select an answer", "error");
    return;
  }

  if (question.type === "short" && !state.selectedAnswer.trim()) {
    showToast("Please type your answer", "error");
    return;
  }

  state.showAnswer = true;
  const correctAnswer = getAnswerValue(question);

  if (question.type === "short" && inputArea) {
    inputArea.disabled = true;
    const sample = document.createElement("div");
    sample.className = "alert alert-primary";
    const sampleText = document.createElement("p");
    sampleText.textContent = question.answer && question.answer !== "short_text"
      ? `Sample answer: ${question.answer}`
      : "Sample answer provided by the teacher.";
    sample.appendChild(sampleText);
    feedbackWrap.appendChild(sample);
  }

  const options = optionsWrap.querySelectorAll(".practice-option");
  options.forEach((option) => {
    option.classList.remove("correct", "incorect", "selected ");
  })
  options.forEach((option) => {
    const optionValue = normalizeAnswer(option.dataset.answer);
    if (optionValue === correctAnswer) {
      option.classList.add("correct");
    }
    if (optionValue === normalizeAnswer(state.selectedAnswer) && optionValue !== correctAnswer) {
      option.classList.add("incorrect");
    }
  });

  const explanation = document.createElement("div");
  explanation.className = "alert alert-primary";
  const title = document.createElement("p");
  title.className = "alert-title";
  if (question.type === "short") {
    title.textContent = "Explanation";
  } else {
    title.textContent = normalizeAnswer(state.selectedAnswer) === correctAnswer ? "Correct!" : "Incorrect";
  }
  const details = document.createElement("p");
  details.textContent = question.explain || question.explanation || "";
  explanation.appendChild(title);
  explanation.appendChild(details);
  feedbackWrap.appendChild(explanation);

  renderPracticeQuestion();
};

const nextQuestion = () => {
  if (!state.quizResult) return;
  if (state.currentQuestion < state.quizResult.questions.length - 1) {
    state.currentQuestion += 1;
    state.selectedAnswer = "";
    state.showAnswer = false;
    renderPracticeQuestion();
  } else {
    showToast("Quiz completed!", "success");
    exitPractice();
  }
};

const startPractice = () => {
  if (!state.quizResult) return;
  state.practiceActive = true;
  state.currentQuestion = 0;
  state.selectedAnswer = "";
  state.showAnswer = false;
  practiceMode.classList.remove("hidden");
  quizResults.classList.add("hidden");
  renderPracticeQuestion();
};

const exitPractice = () => {
  state.practiceActive = false;
  state.currentQuestion = 0;
  state.selectedAnswer = "";
  state.showAnswer = false;
  practiceMode.classList.add("hidden");
  quizResults.classList.remove("hidden");
};

const handleAnalyze = async () => {
  if (!analysisText.value.trim()) {
    showError(analysisError, "Text is required");
    return;
  }

  clearError(analysisError);
  setLoading(analyzeBtn, true, "Analyze", "Analyzing...");

  try {
    const response = await fetch("/analyze_text", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `user_text=${encodeURIComponent(analysisText.value)}`
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Something went wrong try again.");
    }

    state.analysisResult = data;
    renderAnalysisResult(data);
    showToast("Analysis complete!", "success");
  } catch (error) {
    showError(analysisError, error.message);
  } finally {
    setLoading(analyzeBtn, false, "Analyze", "Analyzing...");
  }
};

const handlePaste = async () => {
  try {
    const text = await navigator.clipboard.readText();
    analysisText.value = text;
    clearError(analysisError);
    showToast("Text pasted!", "success");
  } catch (error) {
    showToast("Failed to paste from clipboard", "error");
  }
};

const handleGenerateQuiz = async () => {
  const selected = issueSelect.value;
  if (!selected) {
    showError(quizError, "Please select what you need help with");
    return;
  }

  if (selected === "Something else" && !customIssue.value.trim()) {
    showError(quizError, "Please describe your issue");
    return;
  }

  clearError(quizError);
  setLoading(generateQuizBtn, true, "Generate Quiz", "Generating quiz...");

  const issueValue = selected === "Something else" ? customIssue.value.trim() : selected;

  try {
    const response = await fetch("/generate_quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `user_issue=${encodeURIComponent(issueValue)}`
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Something went wrong try again.");
    }

    state.quizResult = normalizeQuizData(data);
    renderQuizResult(state.quizResult);
    showToast("Quiz generated!", "success");
  } catch (error) {
    showError(quizError, error.message);
  } finally {
    setLoading(generateQuizBtn, false, "Generate Quiz", "Generating quiz...");
  }
};

const normalizeQuizData = (data) => {
  const questions = Array.isArray(data.questions) ? data.questions : [];
  return {
    questions: questions.map((question, index) => ({
      id: question.id || `Q${index + 1}`,
      question: question.question || "",
      type: (question.type || "").toLowerCase(),
      difficulty: (question.difficulty || "").toLowerCase(),
      skill: question.skill || "",
      choices: question.choices || [],
      answer: question.answer || question.correctAnswer || "",
      explain: question.explain || question.explanation || "",
      source_snippets: question.source_snippets || []
    }))
  };
};

const renderQuizResult = (data) => {
  quizResults.classList.remove("hidden");
  practiceMode.classList.add("hidden");
  questionCount.textContent = data.questions.length;
  questionCountHeader.textContent = data.questions.length;
  renderQuestionList(data.questions);
  quizJson.textContent = JSON.stringify(data, null, 2);
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setTab(tab.dataset.tab));
});

analyzeBtn.addEventListener("click", handleAnalyze);
clearAnalysisBtn.addEventListener("click", resetAnalysis);
pasteAnalysisBtn.addEventListener("click", handlePaste);
sampleAnalysisBtn.addEventListener("click", () => {
  analysisText.value = SAMPLE_TEXT;
  clearError(analysisError);
});

copyAnalysisJson.addEventListener("click", () => {
  if (!state.analysisResult) return;
  navigator.clipboard.writeText(JSON.stringify(state.analysisResult, null, 2));
  showToast("JSON copied to clipboard!", "success");
});

toggleAnalysisJson.addEventListener("click", () => {
  analysisJsonWrap.classList.toggle("hidden");
  toggleAnalysisJson.textContent = analysisJsonWrap.classList.contains("hidden") ? "Show JSON" : "Hide JSON";
});

issueSelect.addEventListener("change", () => {
  if (issueSelect.value === "Something else") {
    customIssueWrap.classList.remove("hidden");
  } else {
    customIssueWrap.classList.add("hidden");
    customIssue.value = "";
  }
  clearError(quizError);
});

generateQuizBtn.addEventListener("click", handleGenerateQuiz);

copyQuizJson.addEventListener("click", () => {
  if (!state.quizResult) return;
  navigator.clipboard.writeText(JSON.stringify(state.quizResult, null, 2));
  showToast("JSON copied to clipboard!", "success");
});

toggleQuizJson.addEventListener("click", () => {
  quizJsonWrap.classList.toggle("hidden");
  toggleQuizJson.textContent = quizJsonWrap.classList.contains("hidden") ? "Show JSON" : "Hide JSON";
});

startPracticeBtn.addEventListener("click", startPractice);
exitPracticeBtn.addEventListener("click", exitPractice);
