import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader, ChevronDown, Copy, FileText, CircleAlert } from "lucide-react";
import { toast } from "sonner";

const SAMPLE_TEXT = `Climate change is one of the biggest challenges we face. Scientists agree that global warming is not happening. Studies show that carbon emissions have increased significantly over the past decades. The Paris Agreement was signed in 2015 to combat climate change. Many countries have reduced their emissions since then. However, global emissions continue to rise every year.

Renewable energy sources like solar and wind are becoming more affordable. Solar panels are now cheaper than they were ten years ago. The cost of solar energy has dropped dramatically. This makes clean energy more accessible to everyone.

Protecting forests is crucial for fighting climate change. Trees absorb carbon dioxide from the atmosphere. Deforestation releases stored carbon back into the air.`;

interface AnalysisResult {
  summary: string;
  contradictions: Array<{
    reason: string;
    snippetA: string;
    snippetB: string;
  }>;
  topicShifts: Array<{
    from: string;
    to: string;
    snippet: string;
  }>;
  repeatingClaims: Array<{
    subject: string;
    baseClaim: string;
    count: number;
    variations: string[];
  }>;
}

const MOCK_RESULT: AnalysisResult = {
  summary: "This text discusses climate change, renewable energy, and forest conservation. It contains one major contradiction about global warming, several topic transitions, and some repeated claims about solar energy costs.",
  contradictions: [
    {
      reason: "The text states both that climate change is a major challenge and that global warming is not happening.",
      snippetA: "Climate change is one of the biggest challenges we face.",
      snippetB: "Scientists agree that global warming is not happening."
    }
  ],
  topicShifts: [
    {
      from: "Global climate agreements",
      to: "Renewable energy economics",
      snippet: "Renewable energy sources like solar and wind are becoming more affordable."
    },
    {
      from: "Renewable energy",
      to: "Forest conservation",
      snippet: "Protecting forests is crucial for fighting climate change."
    }
  ],
  repeatingClaims: [
    {
      subject: "Solar energy",
      baseClaim: "Solar energy costs have decreased",
      count: 3,
      variations: [
        "Solar panels are now cheaper than they were ten years ago.",
        "The cost of solar energy has dropped dramatically.",
        "This makes clean energy more accessible to everyone."
      ]
    }
  ]
};

export function TextAnalysisMode() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError("Text is required");
      return;
    }

    setError(null);
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setResult(MOCK_RESULT);
      setLoading(false);
      toast.success("Analysis complete!");
    }, 1500);
  };

  const handleClear = () => {
    setText("");
    setResult(null);
    setError(null);
    setShowJson(false);
  };

  const handleUseSample = () => {
    setText(SAMPLE_TEXT);
    setError(null);
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      setError(null);
      toast.success("Text pasted!");
    } catch (err) {
      toast.error("Failed to paste from clipboard");
    }
  };

  const copyJson = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      toast.success("JSON copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Paste text to analyze</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter or paste the text you want to analyze for contradictions, topic shifts, and repetition..."
            className="min-h-[200px] resize-none"
          />
          
          {error && (
            <Alert variant="destructive">
              <CircleAlert className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-primary hover:bg-[#3D8B41]"
            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze"
              )}
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
            <Button variant="outline" onClick={handlePaste}>
              Paste
            </Button>
            <Button variant="outline" onClick={handleUseSample}>
              Use Sample
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{result.summary}</p>
            </CardContent>
          </Card>

          {/* Contradictions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contradictions</CardTitle>
                <Badge variant="secondary">{result.contradictions.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {result.contradictions.length === 0 ? (
                <p className="text-muted-foreground italic">No contradictions found in this text.</p>
              ) : (
                <div className="space-y-4">
                  {result.contradictions.map((item, idx) => (
                    <div key={idx} className="space-y-3 p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm">{item.reason}</p>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="shrink-0">A</Badge>
                          <p className="text-sm text-muted-foreground italic">{item.snippetA}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="shrink-0">B</Badge>
                          <p className="text-sm text-muted-foreground italic">{item.snippetB}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Topic Shifts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Topic Shifts</CardTitle>
                <Badge variant="secondary">{result.topicShifts.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {result.topicShifts.length === 0 ? (
                <p className="text-muted-foreground italic">No topic shifts found in this text.</p>
              ) : (
                <div className="space-y-4">
                  {result.topicShifts.map((item, idx) => (
                    <div key={idx} className="space-y-2 p-4 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm px-2 py-1 bg-card rounded">{item.from}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-sm px-2 py-1 bg-card rounded">{item.to}</span>
                      </div>
                      <p className="text-sm text-muted-foreground italic">{item.snippet}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Repeating Claims */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Repeating Claims</CardTitle>
                <Badge variant="secondary">{result.repeatingClaims.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {result.repeatingClaims.length === 0 ? (
                <p className="text-muted-foreground italic">No repeating claims found in this text.</p>
              ) : (
                <div className="space-y-4">
                  {result.repeatingClaims.map((item, idx) => (
                    <Collapsible key={idx}>
                      <div className="space-y-2 p-4 bg-secondary/30 rounded-lg">
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">Subject:</span> {item.subject}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Base claim:</span> {item.baseClaim}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Count:</span> {item.count} times
                          </p>
                        </div>
                        <CollapsibleTrigger className="flex items-center gap-2 text-sm text-primary hover:underline">
                          <ChevronDown className="h-4 w-4" />
                          View variations
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 pt-2">
                          {item.variations.map((variation, vIdx) => (
                            <p key={vIdx} className="text-sm text-muted-foreground italic pl-6">
                              • {variation}
                            </p>
                          ))}
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* JSON View */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Raw Data
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyJson}
                  >
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