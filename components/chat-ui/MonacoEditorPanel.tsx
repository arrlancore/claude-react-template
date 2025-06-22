"use client";

import React, { useState, useEffect } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";

interface DSAProblem {
  id: string;
  title: string;
  description: string;
  starterCode?: string;
  language: string;
}

interface MonacoEditorPanelProps {
  problem: DSAProblem;
  initialCode: string;
  language: string;
  onClose: () => void;
  onSubmit: (code: string, language: string) => void;
  isVisible: boolean;
}

const MonacoEditorPanel: React.FC<MonacoEditorPanelProps> = ({
  problem,
  initialCode,
  language,
  onClose,
  onSubmit,
  isVisible,
}) => {
  const [code, setCode] = useState(initialCode);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  if (!isVisible) {
    return null;
  }

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const handleSubmit = () => {
    onSubmit(code, language);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-white">{problem.title}</h3>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      {/* Buttons */}
      <div className="p-4 border-t border-slate-700 flex justify-end space-x-2">
        <Button variant="secondary" onClick={onClose}>
          Close Panel
        </Button>
        <Button onClick={handleSubmit}>Submit Solution</Button>
      </div>
    </div>
  );
};

export default MonacoEditorPanel;
