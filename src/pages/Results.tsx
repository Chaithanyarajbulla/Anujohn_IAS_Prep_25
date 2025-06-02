import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Download, ArrowLeft, Share2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import QuizQuestion from '../components/quiz/QuizQuestion';
import { useQuiz } from '../hooks/useQuiz';
import { Assessment } from '../types';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const { questions, answers, resetQuiz } = useQuiz();
  const [reviewMode, setReviewMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [assessment, setAssessment] = useState<Assessment | null>(null);

  useEffect(() => {
    // Check if we're reviewing a previous assessment
    const reviewAssessment = sessionStorage.getItem('reviewAssessment');
    
    if (reviewAssessment) {
      const parsedAssessment = JSON.parse(reviewAssessment);
      setAssessment(parsedAssessment);
      setReviewMode(true);
    } else if (questions.length === 0 || answers.length === 0) {
      // If no current quiz and no review assessment, redirect to dashboard
      navigate('/dashboard');
    }
    
    return () => {
      // Clean up session storage when component unmounts
      sessionStorage.removeItem('reviewAssessment');
    };
  }, [questions.length, answers.length, navigate]);

  const handleStartNew = () => {
    resetQuiz();
    navigate('/upload');
  };

  const handleGoToDashboard = () => {
    resetQuiz();
    navigate('/dashboard');
  };

  // Use either the current quiz data or the assessment data from review mode
  const displayQuestions = reviewMode && assessment ? assessment.questions : questions;
  const displayAnswers = reviewMode && assessment ? assessment.answers : answers;
  
  if (displayQuestions.length === 0 || displayAnswers.length === 0) {
    return null; // Will redirect in useEffect
  }

  const correctAnswers = displayAnswers.filter(a => a.isCorrect).length;
  const scorePercentage = Math.round((correctAnswers / displayQuestions.length) * 100);
  const currentQuestion = displayQuestions[currentQuestionIndex];
  const userAnswer = displayAnswers.find(a => a.questionId === currentQuestion.id);

  return (
    <div className="max-w-3xl mx-auto">
      <h1>{reviewMode ? 'Assessment Review' : 'Assessment Results'}</h1>

      {/* Score Card */}
      <Card className="mb-8 text-center">
        <Trophy className="h-16 w-16 text-highlight-500 mx-auto mb-4" />
        
        <h2 className="text-2xl font-bold mb-2">
          Your Score: {correctAnswers} / {displayQuestions.length}
        </h2>
        
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div 
            className={`h-4 rounded-full ${
              scorePercentage >= 75 ? 'bg-green-500' : 
              scorePercentage >= 50 ? 'bg-blue-500' : 
              scorePercentage >= 25 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`}
            style={{ width: `${scorePercentage}%` }}
          ></div>
        </div>
        
        <p className="text-xl font-medium mb-6">
          {scorePercentage}%
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="outline"
            icon={<Download size={18} />}
            onClick={() => {
              // In a real app, this would generate a PDF
              alert('Download functionality would be implemented here');
            }}
          >
            Download Results
          </Button>
          
          <Button
            variant="outline"
            icon={<Share2 size={18} />}
            onClick={() => {
              // In a real app, this would implement sharing
              alert('Share functionality would be implemented here');
            }}
          >
            Share Results
          </Button>
        </div>
      </Card>

      {/* Question Review */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Review Questions</h2>
        
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              Question {currentQuestionIndex + 1} of {displayQuestions.length}
            </h3>
            
            <div className="flex gap-2">
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft size={20} className={currentQuestionIndex === 0 ? 'text-gray-300' : 'text-gray-600'} />
              </button>
              
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setCurrentQuestionIndex(Math.min(displayQuestions.length - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === displayQuestions.length - 1}
              >
                <ChevronRight size={20} className={currentQuestionIndex === displayQuestions.length - 1 ? 'text-gray-300' : 'text-gray-600'} />
              </button>
            </div>
          </div>
          
          <QuizQuestion
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={displayQuestions.length}
            userAnswer={userAnswer}
            onAnswer={() => {}}
            reviewMode={true}
          />
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-between gap-4 mb-8">
        <Button
          variant="outline"
          icon={<ArrowLeft size={18} />}
          onClick={handleGoToDashboard}
        >
          Back to Dashboard
        </Button>
        
        {!reviewMode && (
          <Button
            variant="primary"
            onClick={handleStartNew}
          >
            Start New Assessment
          </Button>
        )}
      </div>
    </div>
  );
};

// ChevronLeft and ChevronRight components
const ChevronLeft = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRight = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default Results;