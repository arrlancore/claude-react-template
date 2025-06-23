import React from 'react';
import PatternChoiceButtons from './PatternChoiceButtons';

interface InteractiveElement {
  type: 'pattern-choice';
  data: PatternChoiceData;
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

interface InteractiveElementWrapperProps {
  element: InteractiveElement;
  onResponse: (response: any) => void;
}

const InteractiveElementWrapper: React.FC<InteractiveElementWrapperProps> = ({
  element,
  onResponse,
}) => {
  const handlePatternChoice = (optionId: string) => {
    onResponse({
      type: 'pattern-choice',
      selectedOption: optionId,
    });
  };

  switch (element.type) {
    case 'pattern-choice':
      return (
        <PatternChoiceButtons
          question={element.data.question}
          options={element.data.options}
          onSelect={handlePatternChoice}
        />
      );
    default:
      return null;
  }
};

export default InteractiveElementWrapper;
export type { InteractiveElement, PatternChoiceData, PatternOption };
