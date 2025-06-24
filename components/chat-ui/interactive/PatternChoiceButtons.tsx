import React, { useState, useRef, useEffect, use } from "react";

interface PatternOption {
  id: string;
  label: string;
  confidence: "high" | "medium" | "low";
}

interface PatternChoiceButtonsProps {
  question: string;
  options: PatternOption[];
  onSelect: (optionId: string) => void;
  onRender?: (container: HTMLDivElement) => void;
}

const PatternChoiceButtons: React.FC<PatternChoiceButtonsProps> = ({
  question,
  options,
  onSelect,
  onRender,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      onRender?.(containerRef.current);
    }
  }, []);

  // useEffect(() => {
  //   if (!selectedOption && containerRef.current) {
  //     containerRef.current.focus();
  //   }
  // }, [selectedOption]);

  const handleSelect = (optionId: string) => {
    console.log("PatternChoiceButtons: Option selected:", optionId);
    setSelectedOption(optionId);
    onSelect(optionId);
  };

  const getConfidenceColor = (confidence: PatternOption["confidence"]) => {
    switch (confidence) {
      case "high":
        return "bg-green-500/10 border-green-500/30 text-green-700 hover:bg-green-500/20";
      case "medium":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-700 hover:bg-yellow-500/20";
      case "low":
        return "bg-red-500/10 border-red-500/30 text-red-700 hover:bg-red-500/20";
    }
  };

  return (
    <div
      ref={containerRef}
      className="mt-4 p-4 bg-slate-50/50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
      tabIndex={-1}
    >
      <p className="text-sm font-medium text-slate-700 mb-3">{question}</p>
      <div className="flex flex-col gap-2">
        {selectedOption ? (
          <button
            disabled
            className="p-3 rounded-lg border bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">
                ✓ {options.find((o) => o.id === selectedOption)?.label}
              </span>
              <span className="text-xs opacity-70">Selected</span>
            </div>
          </button>
        ) : (
          options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`
                p-3 rounded-lg border text-left transition-all duration-200
                ${getConfidenceColor(option.confidence)}
              `}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{option.label}</span>
                <span className="text-xs opacity-70 capitalize">
                  {option.confidence}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default PatternChoiceButtons;
