import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { Question, Answer } from '../../types';
import Modal from '../ui/Modal';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  userAnswer: Answer | undefined;
  onAnswer: (questionId: string, selectedOption: string) => void;
  reviewMode?: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  userAnswer,
  onAnswer,
  reviewMode = false,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionSelect = (option: string) => {
    if (reviewMode) return;
    onAnswer(question.id, option);
  };

  const getOptionClasses = (option: string) => {
    if (!reviewMode && !userAnswer) {
      return 'border border-gray-300 bg-white hover:bg-gray-50';
    }

    if (reviewMode || userAnswer) {
      if (option === question.correctAnswer) {
        return 'border border-green-500 bg-green-50 text-green-800';
      }
      
      if (userAnswer?.selectedOption === option && option !== question.correctAnswer) {
        return 'border border-red-500 bg-red-50 text-red-800';
      }
    }

    return 'border border-gray-300 bg-white';
  };

  return (
    <div className="slide-up">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          Question {questionNumber} of {totalQuestions}
        </h3>
        <button
          type="button"
          onClick={() => setShowExplanation(true)}
          className="explanation-btn"
          aria-label="Show explanation"
        >
          <Info size={20} />
        </button>
      </div>

      <div className="mb-6">
        <p className="text-lg mb-4">{question.text}</p>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              type="button"
              className={`w-full text-left p-4 rounded-md transition-colors ${getOptionClasses(
                option
              )}`}
              onClick={() => handleOptionSelect(option)}
              disabled={reviewMode}
            >
              <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
              {option}
            </button>
          ))}
        </div>
      </div>

      <Modal
        isOpen={showExplanation}
        onClose={() => setShowExplanation(false)}
        title="Explanation"
      >
        <div className="prose">
          <p>{question.explanation}</p>
          <p className="mt-4 font-medium">
            Correct Answer: {question.correctAnswer}
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default QuizQuestion;