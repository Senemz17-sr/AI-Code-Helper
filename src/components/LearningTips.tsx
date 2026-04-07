import { motion } from "framer-motion";
import { Lightbulb, BookOpen, Code2, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TIPS = [
  {
    icon: Lightbulb,
    title: "Pro Tips",
    tips: [
      "Run each code example to understand how it works",
      "Modify examples and see what happens",
      "Break down complex code into smaller parts",
      "Use the AI assistant when you get stuck",
      "Practice problems reinforce learning",
    ],
    color: "from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900",
  },
  {
    icon: BookOpen,
    title: "Learning Strategy",
    tips: [
      "Start with beginner courses",
      "Complete one lesson per session",
      "Don't skip practice problems",
      "Review difficult concepts",
      "Progress to advanced levels at your own pace",
    ],
    color: "from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900",
  },
  {
    icon: Code2,
    title: "Coding Best Practices",
    tips: [
      "Write readable code with clear variable names",
      "Add comments to explain complex logic",
      'Test your code with different inputs',
      "Use meaningful variable names",
      "Keep functions simple and focused",
    ],
    color: "from-green-100 to-teal-100 dark:from-green-900 dark:to-teal-900",
  },
  {
    icon: Users,
    title: "Get Unstuck",
    tips: [
      "Use 'Ask AI' button for immediate help",
      "Read the lesson explanation again",
      "Look at code examples for patterns",
      "Try simpler variations first",
      "Break the problem into smaller parts",
    ],
    color: "from-pink-100 to-rose-100 dark:from-pink-900 dark:to-rose-900",
  },
];

export default function LearningTips() {
  return (
    <section className="py-12">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <h2 className="text-3xl font-bold">Learning Resources</h2>
          <p className="mt-2 text-muted-foreground">
            Tips and strategies to get the most out of your learning journey
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {TIPS.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${section.color}`}>
                      <section.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.tips.map((tip, tipIdx) => (
                      <li key={tipIdx} className="flex gap-2 text-sm">
                        <span className="text-primary font-bold">•</span>
                        <span className="text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function QuickTip({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-lg border border-primary/20 bg-primary/5 p-3"
    >
      <div className="flex gap-2">
        <Lightbulb className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-sm text-primary">{title}</strong>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
