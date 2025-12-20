import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { TextAnalysisMode } from "./components/TextAnalysisMode";
import { QuizMode } from "./components/QuizMode";
import { Toaster } from "./components/ui/sonner";
import { Brain } from "lucide-react";

export default function App() {
  const [activeMode, setActiveMode] = useState("text-analysis");

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="max-w-[900px] mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl">Logic Assistant</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Analyze text and practice logical reasoning
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-[900px] mx-auto">
          <Tabs value={activeMode} onValueChange={setActiveMode} className="space-y-6">
            {/* Mode Toggle */}
            <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted/50">
              <TabsTrigger 
                value="text-analysis"
                className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm py-2.5"
              >
                <span className="hidden sm:inline">Text Analysis</span>
                <span className="sm:hidden">Analysis</span>
              </TabsTrigger>
              <TabsTrigger 
                value="quiz-mode"
                className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm py-2.5"
              >
                <span className="hidden sm:inline">Quiz Mode</span>
                <span className="sm:hidden">Quiz</span>
              </TabsTrigger>
            </TabsList>

            {/* Text Analysis Mode */}
            <TabsContent value="text-analysis" className="space-y-6">
              <TextAnalysisMode />
            </TabsContent>

            {/* Quiz Mode */}
            <TabsContent value="quiz-mode" className="space-y-6">
              <QuizMode />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-[900px] mx-auto text-center text-sm text-muted-foreground">
            <p>Logic Assistant helps middle-school students and teachers identify logical issues and practice reasoning skills.</p>
          </div>
        </div>
      </footer>

      <Toaster position="top-center" />
    </div>
  );
}