/**
 * Code Block Component
 * Syntax-highlighted code display
 */

import React from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CodeBlockProps {
  language?: string;
  children?: string;
  className?: string;
}

export function CodeBlock({
  language = "javascript",
  children = "",
  className = "",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlighting (basic for demo)
  const highlightCode = (code: string, lang: string) => {
    // In production, use a library like Prism or highlight.js
    return code;
  };

  const highlightedCode = highlightCode(children, language);

  return (
    <div className={`relative bg-slate-900 text-slate-50 rounded-lg overflow-hidden font-mono text-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-xs font-semibold uppercase text-slate-400">
          {language}
        </span>
        <Button
          onClick={handleCopy}
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Code */}
      <pre className="p-4 overflow-x-auto">
        <code>{highlightedCode}</code>
      </pre>
    </div>
  );
}

export default CodeBlock;
