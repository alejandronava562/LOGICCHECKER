import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Loader, ChevronDown, Copy, FileText, CircleAlert, CircleCheck, CircleX } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";

interface Question {
  id: number;
  question: string;
  type: "MCQ" | "True-False" | "Short";
  difficulty: "Easy" | "Medium" | "Hard";
  skill: string;
  choices?: string[];
  correctAnswer: string;
  explanation: string;
  sourceSnippet?: string;
}

interface QuizResult {
  teacherSummary: string;
  questions: Question[];
}

const MOCK_QUIZ: QuizResult = {
  teacherSummary: "This quiz helps students practice identifying contradictions in texts. Questions range from easy to hard, focusing on logical consistency and evidence evaluation.",
  questions: [
    {
      id: 1,
      question: "Which two statements in a text would be contradictory?",
      type: "MCQ",
      difficulty: "Easy",
      skill: "Spotting contradictions",
      choices: [
        "A. 'The sky is blue' and 'The ocean is deep'",
        "B. 'All dogs bark' and 'My dog never barks'",
        "C. 'I like pizza' and 'I ate pizza yesterday'",
        "D. 'It rained today' and 'The weather was wet'"
      ],
      correctAnswer: "B",
      explanation: "Option B contains a direct contradiction: if ALL dogs bark, then it's impossible for one dog to never bark.",
      sourceSnippet: "Understanding contradictions helps identify logical errors in arguments."
    },
    {
      id: 2,
      question: "A text that stays on topic will have consistent subject matter throughout.",
      type: "True-False",
      difficulty: "Easy",
      skill: "Staying on topic",
      correctAnswer: "True",
      explanation: "Staying on topic means maintaining focus on the main subject without unnecessary tangents.",
      sourceSnippet: "Coherent writing maintains a clear focus on the main theme."
    },
    {
      id: 3,
      question: "If an author claims 'Studies show that exercise improves health' but provides no citation, what logical issue is present?",
      type: "MCQ",
      difficulty: "Medium",
      skill: "Using evidence",
      choices: [
        "A. Contradiction",
        "B. Lack of evidence",
        "C. Topic shift",
        "D. Repetition"
      ],
      correctAnswer: "B",
      explanation: "Without citing specific studies, the claim lacks proper evidence and support.",
      sourceSnippet: "Strong arguments require verifiable evidence and sources."
    },
    {
      id: 4,
      question: "What is the main problem with repeating the same claim multiple times in different words?",
      type: "Short",
      difficulty: "Medium",
      skill: "Avoiding repetition",
      correctAnswer: "It doesn't add new information or strengthen the argument",
      explanation: "Repetition without adding new evidence or perspectives makes writing less effective and can confuse readers.",
      sourceSnippet: "Effective writing builds on ideas rather than restating them."
    },
    {
      id: 5,
      question: "In a historical essay, which transition would indicate proper chronological order?",
      type: "MCQ",
      difficulty: "Easy",
      skill: "Timeline/order of events",
      choices: [
        "A. 'However'",
        "B. 'In contrast'",
        "C. 'Subsequently'",
        "D. 'Similarly'"
      ],
      correctAnswer: "C",
      explanation: "'Subsequently' indicates that one event followed another in time, showing chronological order.",
      sourceSnippet: "Chronological markers help readers follow the sequence of events."
    },
    {
      id: 6,
      question: "A text first discusses pollution, then climate change, then returns to pollution. This is an example of poor organization.",
      type: "True-False",
      difficulty: "Medium",
      skill: "Staying on topic",
      correctAnswer: "True",
      explanation: "Jumping between topics and then back creates confusion and disrupts the logical flow of ideas.",
      sourceSnippet: "Well-organized writing groups related ideas together."
    },
    {
      id: 7,
      question: "Which statement represents the strongest use of evidence?",
      type: "MCQ",
      difficulty: "Hard",
      skill: "Using evidence",
      choices: [
        "A. 'Everyone knows that reading is important.'",
        "B. 'Reading is beneficial for various reasons.'",
        "C. 'A 2020 study by Smith et al. found that reading 30 minutes daily improved comprehension scores by 25%.'",
        "D. 'Many experts agree that reading helps students.'"
      ],
      correctAnswer: "C",
      explanation: "Option C provides specific evidence with a citation, timeframe, and measurable results.",
      sourceSnippet: "Specific, cited evidence is more convincing than general claims."
    },
    {
      id: 8,
      question: "If a text states 'First, we will discuss causes. Finally, we will examine effects' but then discusses solutions, what is the problem?",
      type: "Short",
      difficulty: "Hard",
      skill: "Timeline/order of events",
      correctAnswer: "The text doesn't follow its stated organization/outline",
      explanation: "The text promised to discuss causes and effects but introduced solutions instead, breaking its own structure.",
      sourceSnippet: "Following a stated outline helps maintain reader expectations and clarity."
    }
  ]
};

export function QuizMode() {
  const [selectedIssue, setSelectedIssue] = useState("");
  const [customIssue, setCustomIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);

  // Practice mode state
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  const handleGenerate = async () => {
    if (!selectedIssue) {
      setError("Please select what you need help with");
      return;
    }

    if (selectedIssue === "Something else" && !customIssue.trim()) {
      setError("Please describe your issue");
      return;
    }

    setError(null);
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setResult(MOCK_QUIZ);
      setLoading(false);
      toast.success("Quiz generated!");
    }, 1500);
  };

  const copyJson = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      toast.success("JSON copied to clipboard!");
    }
  };

  const startPractice = () => {
    setPracticeMode(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setShowAnswer(false);
    setUserAnswers({});
  };

  const exitPractice = () => {
    setPracticeMode(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setShowAnswer(false);
  };

  const checkAnswer = () => {
    if (!selectedAnswer) {
      toast.error("Please select an answer");
      return;
    }
    setShowAnswer(true);
    if (result) {
      setUserAnswers({
        ...userAnswers,
        [result.questions[currentQuestionIndex].id]: selectedAnswer
      });
    }
  };

  const nextQuestion = () => {
    if (result && currentQuestionIndex < result.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setShowAnswer(false);
    } else {
      toast.success("Quiz completed!");
      exitPractice();
    }
  };

  const currentQuestion = result?.questions[currentQuestionIndex];
  const progress = result ? ((currentQuestionIndex + 1) / result.questions.length) * 100 : 0;

  if (practiceMode && result && currentQuestion) {
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Practice Mode</CardTitle>
              <Button variant="outline" size="sm" onClick={exitPractice}>
                Exit Practice
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Question {currentQuestionIndex + 1} of {result.questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline">{currentQuestion.type}</Badge>
                <Badge 
                  variant={
                    currentQuestion.difficulty === "Easy" 
                      ? "secondary" 
                      : currentQuestion.difficulty === "Medium" 
                        ? "default" 
                        : "destructive"
                  }
                >
                  {currentQuestion.difficulty}
                </Badge>
                <Badge variant="outline">{currentQuestion.skill}</Badge>
              </div>
              <h3 className="text-lg mt-4">{currentQuestion.question}</h3>
            </div>

            {currentQuestion.type === "MCQ" && currentQuestion.choices && (
              <div className="space-y-2">
                {currentQuestion.choices.map((choice, idx) => {
                  const choiceLetter = choice.charAt(0);
                  const isSelected = selectedAnswer === choiceLetter;
                  const isCorrectChoice = choiceLetter === currentQuestion.correctAnswer;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => !showAnswer && setSelectedAnswer(choiceLetter)}
                      disabled={showAnswer}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                        showAnswer
                          ? isCorrectChoice
                            ? "border-primary bg-primary/10"
                            : isSelected
                              ? "border-destructive bg-destructive/10"
                              : "border-border"
                          : isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{choice}</span>
                        {showAnswer && isCorrectChoice && (
                          <CircleCheck className="h-5 w-5 text-primary" />
                        )}
                        {showAnswer && isSelected && !isCorrectChoice && (
                          <CircleX className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === "True-False" && (
              <div className="space-y-2">
                {["True", "False"].map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrectChoice = option === currentQuestion.correctAnswer;
                  
                  return (
                    <button
                      key={option}
                      onClick={() => !showAnswer && setSelectedAnswer(option)}
                      disabled={showAnswer}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                        showAnswer
                          ? isCorrectChoice
                            ? "border-primary bg-primary/10"
                            : isSelected
                              ? "border-destructive bg-destructive/10"
                              : "border-border"
                          : isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showAnswer && isCorrectChoice && (
                          <CircleCheck className="h-5 w-5 text-primary" />
                        )}
                        {showAnswer && isSelected && !isCorrectChoice && (
                          <CircleX className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === "Short" && (
              <div className="space-y-2">
                <Textarea
                  value={selectedAnswer}
                  onChange={(e) => !showAnswer && setSelectedAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  disabled={showAnswer}
                  className="min-h-[100px]"
                />
                {showAnswer && (
                  <div className="p-4 bg-primary/10 border-2 border-primary rounded-lg">
                    <p className="text-sm font-medium mb-1">Sample answer:</p>
                    <p className="text-sm">{currentQuestion.correctAnswer}</p>
                  </div>
                )}
              </div>
            )}

            {showAnswer && (
              <Alert className={isCorrect || currentQuestion.type === "Short" ? "border-primary bg-primary/5" : "border-yellow-500 bg-yellow-50"}>
                <AlertDescription>
                  <p className="font-medium mb-2">
                    {currentQuestion.type === "Short" 
                      ? "Explanation:" 
                      : isCorrect 
                        ? "Correct!" 
                        : "Incorrect"}
                  </p>
                  <p>{currentQuestion.explanation}</p>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              {!showAnswer ? (
                <Button onClick={checkAnswer} className="bg-primary hover:bg-[#3D8B41]">
                  Check Answer
                </Button>
              ) : (
                <Button onClick={nextQuestion} className="bg-primary hover:bg-[#3D8B41]">
                  {currentQuestionIndex < result.questions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Generate a Practice Quiz</CardTitle>
          <CardDescription>You'll get ~10 practice questions tailored to your needs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="issue-select">What do you want help with? *</Label>
            <Select value={selectedIssue} onValueChange={setSelectedIssue}>
              <SelectTrigger id="issue-select">
                <SelectValue placeholder="Select an option..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Spotting contradictions">Spotting contradictions</SelectItem>
                <SelectItem value="Avoiding repetition">Avoiding repetition</SelectItem>
                <SelectItem value="Staying on topic">Staying on topic</SelectItem>
                <SelectItem value="Using evidence">Using evidence</SelectItem>
                <SelectItem value="Timeline/order of events">Timeline/order of events</SelectItem>
                <SelectItem value="Something else">Something else</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedIssue === "Something else" && (
            <div className="space-y-2">
              <Label htmlFor="custom-issue">Describe your issue</Label>
              <Input
                id="custom-issue"
                value={customIssue}
                onChange={(e) => setCustomIssue(e.target.value)}
                placeholder="What would you like to practice?"
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <CircleAlert className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-primary hover:bg-[#3D8B41]"
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Generating quiz...
              </>
            ) : (
              "Generate Quiz"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Teacher Summary */}
          <Alert className="border-primary bg-primary/5">
            <AlertDescription>
              <p className="font-medium mb-1">Summary for teacher:</p>
              <p>{result.teacherSummary}</p>
            </AlertDescription>
          </Alert>

          {/* Practice Button */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium mb-1">Ready to practice?</h3>
                  <p className="text-sm text-muted-foreground">
                    Test your knowledge with {result.questions.length} interactive questions
                  </p>
                </div>
                <Button onClick={startPractice} className="bg-primary hover:bg-[#3D8B41] w-full sm:w-auto">
                  Start Quiz
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Questions List */}
          <Card>
            <CardHeader>
              <CardTitle>All Questions ({result.questions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.questions.map((q, idx) => (
                  <Collapsible key={q.id}>
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="font-normal">Q{idx + 1}</Badge>
                            <Badge variant="outline">{q.type}</Badge>
                            <Badge 
                              variant={
                                q.difficulty === "Easy" 
                                  ? "secondary" 
                                  : q.difficulty === "Medium" 
                                    ? "default" 
                                    : "destructive"
                              }
                            >
                              {q.difficulty}
                            </Badge>
                            <Badge variant="outline">{q.skill}</Badge>
                          </div>
                          <p className="text-sm">{q.question}</p>
                        </div>
                      </div>

                      {q.choices && (
                        <div className="space-y-1 text-sm text-muted-foreground pl-4">
                          {q.choices.map((choice, cIdx) => (
                            <p key={cIdx}>{choice}</p>
                          ))}
                        </div>
                      )}

                      <CollapsibleTrigger className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <ChevronDown className="h-4 w-4" />
                        Show answer & explanation
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="space-y-2 pt-2 pl-4">
                        <p className="text-sm">
                          <span className="font-medium">Answer:</span> {q.correctAnswer}
                        </p>
                        <p className="text-sm text-muted-foreground">{q.explanation}</p>
                        {q.sourceSnippet && (
                          <p className="text-xs text-muted-foreground italic pt-2 border-t">
                            {q.sourceSnippet}
                          </p>
                        )}
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Export Quiz
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyJson}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy JSON
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowJson(!showJson)}
                  >
                    {showJson ? "Hide" : "Show"} JSON
                  </Button>
                </div>
              </div>
            </CardHeader>
            {showJson && (
              <CardContent>
                <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}