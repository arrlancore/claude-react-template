import React, { useState, useRef, useEffect } from "react";
import QuestionPanel from "./QuestionPanel";
import { VISUALIZERS } from "./visualizers";

interface DecisionOption {
  id: string;
  label: string;
  action: string;
  explanation?: string;
  correct?: boolean;
}

interface AlgorithmVisualizerProps {
  visualizer: string;
  state: Record<string, any>;
  question: string;
  options: DecisionOption[];
  onSelect: (optionId: string) => void;
  onRender?: (container: HTMLDivElement) => void;
}

const AlgorithmVisualizer: React.FC<AlgorithmVisualizerProps> = ({
  visualizer,
  state,
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

  const handleSelect = (optionId: string) => {
    setSelectedOption(optionId);
    onSelect(optionId);
  };

  const VisualizerComponent = VISUALIZERS[visualizer as keyof typeof VISUALIZERS];

  if (!VisualizerComponent) {
    return (
      <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
        <p className="text-red-700">Unknown visualizer: {visualizer}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mt-4 p-4 bg-slate-50/50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
      tabIndex={-1}
    >
      <div className="mb-4">
        <VisualizerComponent state={state} />
      </div>

      <QuestionPanel
        question={question}
        options={options}
        selectedOption={selectedOption}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default AlgorithmVisualizer;
export type { DecisionOption };
