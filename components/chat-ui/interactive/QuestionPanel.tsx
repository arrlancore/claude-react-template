import React from "react";
import { DecisionOption } from "./AlgorithmVisualizer";

interface QuestionPanelProps {
  question: string;
  options: DecisionOption[];
  selectedOption: string | null;
  onSelect: (optionId: string) => void;
}

const QuestionPanel: React.FC<QuestionPanelProps> = ({
  question,
  options,
  selectedOption,
  onSelect,
}) => {
  const getOptionColor = (option: DecisionOption, isSelected: boolean) => {
    if (isSelected) {
      return option.correct
        ? "bg-green-100 border-green-300 text-green-700"
        : "bg-red-100 border-red-300 text-red-700";
    }
    return "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";
  };

  return (
    <div>
      <p className="text-sm font-medium text-slate-700 mb-3">{question}</p>
      <div className="flex flex-col gap-2">
        {selectedOption ? (
          options.map((option) => {
            const isSelected = option.id === selectedOption;
            return (
              <div
                key={option.id}
                className={`p-3 rounded-lg border ${getOptionColor(option, isSelected)}`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium">
                    {isSelected ? (option.correct ? "✓" : "✗") : ""} {option.label}
                  </span>
                  {isSelected && (
                    <span className="text-xs opacity-70 ml-2">
                      {option.correct ? "Correct" : "Incorrect"}
                    </span>
                  )}
                </div>
                {isSelected && option.explanation && (
                  <p className="text-xs mt-2 opacity-80">{option.explanation}</p>
                )}
              </div>
            );
          })
        ) : (
          options.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`p-3 rounded-lg border text-left transition-all duration-200 ${getOptionColor(option, false)}`}
            >
              <span className="font-medium">{option.label}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default QuestionPanel;
