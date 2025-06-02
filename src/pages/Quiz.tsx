import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import QuizQuestion from '../components/quiz/QuizQuestion';
import ProgressBar from '../components/quiz/ProgressBar';
import { useQuiz } from '../hooks/useQuiz';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { 
    questions, 
    currentQuestionIndex, 
    answers, 
    isLoading,
    answerQuestion, 
    nextQuestion, 
    previousQuestion, 
    completeQuiz 
  } = useQuiz();

  useEffect(() => {
    // If no questions are loaded, redirect to upload page
    if (!isLoading && questions.length === 0) {
      navigate('/upload');
    }
  }, [questions, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-blue-200 rounded-full mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <p className="mt-8 text-gray-600">Generating questions from your document...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return null; // Will redirect in useEffect
  }

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = answers.find(a => a.questionId === currentQuestion.id);
  const answeredCount = answers.length;
  
  const handleComplete = () => {
    completeQuiz();
    navigate('/results');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1>UPSC Assessment</h1>
      
      <ProgressBar 
        current={currentQuestionIndex + 1} 
        total={questions.length} 
        answered={answeredCount}
      />
      
      <Card>
        <QuizQuestion 
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          userAnswer={userAnswer}
          onAnswer={answerQuestion}
        />
        
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            icon={<ChevronLeft size={18} />}
          >
            Previous
          </Button>
          
          <div className="flex gap-4">
            {currentQuestionIndex === questions.length - 1 && (
              <Button
                variant="primary"
                onClick={handleComplete}
                icon={<CheckCircle size={18} />}
              >
                Complete Quiz
              </Button>
            )}
            
            <Button
              variant={currentQuestionIndex === questions.length - 1 ? "outline" : "primary"}
              onClick={nextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              icon={<ChevronRight size={18} className="ml-2" />}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
      
      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">
          You've answered {answeredCount} out of {questions.length} questions
        </p>
        
        {answeredCount === questions.length ? (
          <Button 
            variant="primary"
            onClick={handleComplete}
          >
            Submit and View Results
          </Button>
        ) : (
          <p className="text-sm text-gray-500">
            Answer all questions to get your final score
          </p>
        )}
      </div>
    </div>
  );
};

export default Quiz;