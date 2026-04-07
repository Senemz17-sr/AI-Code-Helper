/**
 * Lesson Viewer Component
 * Displays lesson content with code examples and resources
 */

import React, { useState } from "react";
import { BookmarkButton } from "@/components/BookmarkButton";
import { ArrowLeft, ArrowRight, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EnhancedLesson, CourseUser } from "@/types/course";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "./CodeBlock";

interface LessonViewerProps {
  lesson: EnhancedLesson;
  user: CourseUser;
  isCompleted?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onComplete?: (lessonId: string) => void;
  showNavigationButtons?: boolean;
}

export function LessonViewer({
  lesson,
  user,
  isCompleted = false,
  onPrevious,
  onNext,
  onComplete,
  showNavigationButtons = true,
}: LessonViewerProps) {
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleMarkComplete = () => {
    setHasInteracted(true);
    if (onComplete) {
      onComplete(lesson.id);
    }
  };

  // Parse code examples if content includes them
  const codeBlockRegex = /```(\w+)\n([\s\S]*?)```/g;
  const hasCodeExamples = codeBlockRegex.test(lesson.content);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 p-4 sm:p-6 sticky top-0 bg-white dark:bg-slate-950 z-10">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Chapter {lesson.chapter || 1} • {lesson.difficulty}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white line-clamp-2">
              {lesson.title}
            </h1>
            {lesson.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {lesson.description}
              </p>
            )}
          </div>
          <BookmarkButton
            lessonId={lesson.id}
            isBookmarked={false}
            className="flex-shrink-0"
          />
        </div>

        {/* Lesson meta info */}
        <div className="flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-400 mt-3">
          {lesson.duration && (
            <div>📚 {lesson.duration} minutes</div>
          )}
          {isCompleted && (
            <div className="text-green-600 dark:text-green-400 font-medium">
              ✓ Completed
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-3xl mx-auto">
          {/* Main content */}
          <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
            <ReactMarkdown
              components={{
                code: ({ inline, ...props }) =>
                  inline ? (
                    <code
                      className="bg-slate-100 dark:bg-slate-800 rounded px-1.5 py-0.5 text-sm font-mono text-slate-900 dark:text-slate-100"
                      {...props}
                    />
                  ) : (
                    <CodeBlock {...props} />
                  ),
              }}
            >
              {lesson.content}
            </ReactMarkdown>
          </div>

          {/* Explanation */}
          {lesson.explanation && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Key Takeaway
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {lesson.explanation}
              </p>
            </div>
          )}

          {/* Code Examples */}
          {lesson.codeExamples && lesson.codeExamples.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Code Examples
              </h3>
              <div className="space-y-4">
                {lesson.codeExamples.map((example, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden"
                  >
                    <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                        {example.title}
                      </h4>
                    </div>
                    <CodeBlock language={example.language}>
                      {example.code}
                    </CodeBlock>
                    {example.explanation && (
                      <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                        {example.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {lesson.resources && lesson.resources.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Resources
              </h3>
              <div className="space-y-2">
                {lesson.resources.map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
                  >
                    {resource.type === "file" && (
                      <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                    )}
                    {resource.type !== "file" && (
                      <ExternalLink className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-900 dark:text-white">
                        {resource.title}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer with actions */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 sticky bottom-0">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          {showNavigationButtons && (
            <Button
              onClick={onPrevious}
              variant="outline"
              disabled={!onPrevious}
            >
              ← Previous
            </Button>
          )}

          {!isCompleted && (
            <Button
              onClick={handleMarkComplete}
              className="flex-1 sm:flex-none"
              size="lg"
            >
              ✓ Mark as Complete
            </Button>
          )}

          {isCompleted && (
            <div className="text-green-600 dark:text-green-400 font-medium">
              ✓ Completed
            </div>
          )}

          {showNavigationButtons && (
            <Button
              onClick={onNext}
              disabled={!onNext}
            >
              Next →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonViewer;
