"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface DSAProblem {
  id: string;
  title: string;
  description: string;
  starterCode?: Record<string, string>; // { language: code }
  language: string;
}

interface ProblemCardProps {
  problem: DSAProblem;
  onOpenEditor: (problem: DSAProblem) => void;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, onOpenEditor }) => {
  // Show a snippet of the description
  const descriptionSnippet =
    problem.description.length > 150
      ? `${problem.description.substring(0, 147)}...`
      : problem.description;

  return (
    <div className="my-2" data-testid="problem-card">
      {" "}
      {/* Removed p-4, bg-blue-50, border, rounded-lg, shadow. Padding can be adjusted if needed or handled by MessageItem */}
      <h3 className="text-lg font-semibold text-blue-800 mb-2">
        {problem.title}
      </h3>
      <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">
        {descriptionSnippet}
      </p>
      {problem.starterCode && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-gray-600 mb-1">
            Starter Code ({problem.language}):
          </h4>
          <pre className="bg-gray-800 text-white p-2 rounded-md text-xs overflow-x-auto">
            <code>{problem.starterCode[problem.language] || "// No starter code available"}</code>
          </pre>
        </div>
      )}
      <Button onClick={() => onOpenEditor(problem)} size="sm" data-testid="open-editor-button">
        Solve Problem
      </Button>
    </div>
  );
};

export default ProblemCard;
