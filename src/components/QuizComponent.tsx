import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { Lesson } from "@/types/course";

interface QuizProps {
  lesson: Lesson;
  onComplete?: (score: number) => void;
}

export default function QuizComponent({ lesson, onComplete }: QuizProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Simple quiz questions based on lesson
  const questions = [
    {
      question: `What is the main concept of ${lesson.title}?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct: 0,
    },
    {
      question: "Which of the following is correct?",
      options: ["First choice", "Second choice", "Third choice", "Fourth choice"],
      correct: 1,
    },
    {
      question: "What does this code do?",
      options: ["Does X", "Does Y", "Does Z", "Does W"],
      correct: 2,
    },
  ];

  const handleAnswer = (option: string) => {
    setAnswers({
      ...answers,
      [currentQ]: option,
    });
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      const userAnswer = parseInt(answers[idx] || "-1");
      if (userAnswer === q.correct) correct++;
    });
    const finalScore = (correct / questions.length) * 100;
    setScore(finalScore);
    setSubmitted(true);
    onComplete?.(finalScore);
  };

  if (submitted) {
    const passed = score >= 70;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card>
          <CardContent className="pt-8 text-center">
            <div className="mb-6 flex justify-center">
              {passed ? (
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              ) : (
                <AlertCircle className="h-16 w-16 text-orange-500" />
              )}
            </div>
            <h3 className="mb-2 text-2xl font-bold">
              {passed ? "Great Job! 🎉" : "Keep Learning"}
            </h3>
            <div className="mb-4">
              <div className="text-4xl font-bold text-primary">{Math.round(score)}%</div>
              <p className="text-muted-foreground">
                You answered {Math.round((score / 100) * questions.length)} of{" "}
                {questions.length} correctly
              </p>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              {passed
                ? "You've mastered this lesson! Move on to the next one."
                : "Review the lesson and try again to improve your score."}
            </p>
            <Button onClick={() => window.location.reload()}>
              {passed ? "Next Lesson" : "Try Again"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const q = questions[currentQ];
  const answered = currentQ in answers;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lesson Quiz</CardTitle>
              <CardDescription>Test your knowledge of this lesson</CardDescription>
            </div>
            <div className="text-sm font-semibold">
              Question {currentQ + 1} of {questions.length}
            </div>
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{q.question}</h3>
            <RadioGroup value={answers[currentQ] || ""} onValueChange={handleAnswer}>
              <div className="space-y-3">
                {q.options.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2 rounded-lg p-3 hover:bg-secondary">
                    <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                    <Label
                      htmlFor={`option-${idx}`}
                      className="flex-1 cursor-pointer font-medium"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
              disabled={currentQ === 0}
            >
              Previous
            </Button>
            {currentQ < questions.length - 1 ? (
              <Button
                onClick={() => setCurrentQ(currentQ + 1)}
                disabled={!answered}
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!answered} className="flex-1">
                Submit Quiz
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
