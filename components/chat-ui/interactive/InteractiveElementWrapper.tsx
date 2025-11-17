import React from 'react';
import PatternChoiceButtons from './PatternChoiceButtons';
import AlgorithmVisualizer, { DecisionOption } from './AlgorithmVisualizer';

interface InteractiveElement {
  type: 'pattern-choice' | 'algorithm-state';
  data: PatternChoiceData | AlgorithmStateData;
}

interface PatternChoiceData {
  question: string;
  options: PatternOption[];
}

interface PatternOption {
  id: string;
  label: string;
  confidence: 'high' | 'medium' | 'low';
}

interface AlgorithmStateData {
  visualizer: string;
  state: Record<string, any>;
  question: string;
  options: DecisionOption[];
}

interface InteractiveElementWrapperProps {
  element: InteractiveElement;
  onResponse: (response: any) => void;
  onRender?: (container: HTMLDivElement) => void;
}

const InteractiveElementWrapper: React.FC<InteractiveElementWrapperProps> = ({
  element,
  onResponse,
  onRender,
}) => {
  const handlePatternChoice = (optionId: string) => {
    onResponse({
      type: 'pattern-choice',
      selectedOption: optionId,
    });
  };

  const handleAlgorithmDecision = (optionId: string) => {
    onResponse({
      type: 'algorithm-decision',
      selectedOption: optionId,
    });
  };

  switch (element.type) {
    case 'pattern-choice':
      return (
        <PatternChoiceButtons
          question={(element.data as PatternChoiceData).question}
          options={(element.data as PatternChoiceData).options}
          onSelect={handlePatternChoice}
          onRender={onRender}
        />
      );
    case 'algorithm-state':
      const algorithmData = element.data as AlgorithmStateData;
      return (
        <AlgorithmVisualizer
          visualizer={algorithmData.visualizer}
          state={algorithmData.state}
          question={algorithmData.question}
          options={algorithmData.options}
          onSelect={handleAlgorithmDecision}
          onRender={onRender}
        />
      );
    default:
      return null;
  }
};

export default InteractiveElementWrapper;
export type { InteractiveElement, PatternChoiceData, PatternOption, AlgorithmStateData, DecisionOption };
