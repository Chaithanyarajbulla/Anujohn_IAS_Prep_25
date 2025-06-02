import React, { createContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Question, Answer, QuizState, Assessment } from '../types';
import { useAuth } from '../hooks/useAuth';

// Context interface
interface QuizContextType extends QuizState {
  generateQuestions: (content: string, title: string) => void;
  answerQuestion: (questionId: string, selectedOption: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  getHistory: () => Assessment[];
}

// Initial state
const initialState: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  isCompleted: false,
  isLoading: false,
  error: null,
};

// Action types
type QuizAction =
  | { type: 'GENERATE_QUESTIONS_START' }
  | { type: 'GENERATE_QUESTIONS_SUCCESS'; payload: Question[] }
  | { type: 'GENERATE_QUESTIONS_FAILURE'; payload: string }
  | { type: 'ANSWER_QUESTION'; payload: Answer }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'RESET_QUIZ' };

// Reducer
const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'GENERATE_QUESTIONS_START':
      return { ...state, isLoading: true, error: null };
    case 'GENERATE_QUESTIONS_SUCCESS':
      return {
        ...state,
        questions: action.payload,
        currentQuestionIndex: 0,
        answers: [],
        isCompleted: false,
        isLoading: false,
      };
    case 'GENERATE_QUESTIONS_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'ANSWER_QUESTION':
      // Remove any existing answer for this question
      const filteredAnswers = state.answers.filter(
        a => a.questionId !== action.payload.questionId
      );
      return {
        ...state,
        answers: [...filteredAnswers, action.payload],
      };
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.min(
          state.currentQuestionIndex + 1,
          state.questions.length - 1
        ),
      };
    case 'PREVIOUS_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
      };
    case 'COMPLETE_QUIZ':
      return { ...state, isCompleted: true };
    case 'RESET_QUIZ':
      return initialState;
    default:
      return state;
  }
};

// Mock question generator function
const generateMockQuestions = (content: string, count = 25): Question[] => {
  // Get some words from the content to use in questions
  const words = content
    .split(/\s+/)
    .filter(word => word.length > 4)
    .slice(0, 100);

  const topics = [
    'Indian History',
    'Geography',
    'Indian Polity',
    'Economy',
    'Science and Technology',
  ];

  // Generate random questions
  return Array.from({ length: count }, (_, i) => {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    
    return {
      id: uuidv4(),
      text: `Question ${i + 1}: Which of the following best describes the concept of "${randomWord}" in ${topic}?`,
      options: [
        `It refers to a historical event during the pre-independence era`,
        `It's a geographical feature found in Northern India`,
        `It's a constitutional provision added in the 42nd amendment`,
        `It's an economic policy introduced during liberalization`,
      ],
      correctAnswer: `It's a constitutional provision added in the 42nd amendment`,
      explanation: `The concept of "${randomWord}" is an important aspect of ${topic}. It was established during the constitutional reforms and has significant implications for governance and policy-making in India.`,
    };
  });
};

// Create context
export const QuizContext = createContext<QuizContextType>({
  ...initialState,
  generateQuestions: () => {},
  answerQuestion: () => {},
  nextQuestion: () => {},
  previousQuestion: () => {},
  completeQuiz: () => {},
  resetQuiz: () => {},
  getHistory: () => [],
});

// Provider component
export const QuizProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const { user } = useAuth();

  // Quiz methods
  const generateQuestions = (content: string, title: string) => {
    dispatch({ type: 'GENERATE_QUESTIONS_START' });
    try {
      // Simulate API call
      setTimeout(() => {
        const questions = generateMockQuestions(content);
        dispatch({ type: 'GENERATE_QUESTIONS_SUCCESS', payload: questions });
        
        // Save the quiz title in session storage
        sessionStorage.setItem('currentQuizTitle', title);
      }, 2000);
    } catch (error) {
      dispatch({
        type: 'GENERATE_QUESTIONS_FAILURE',
        payload: (error as Error).message,
      });
    }
  };

  const answerQuestion = (questionId: string, selectedOption: string) => {
    const question = state.questions.find(q => q.id === questionId);
    if (!question) return;

    const isCorrect = selectedOption === question.correctAnswer;
    
    dispatch({
      type: 'ANSWER_QUESTION',
      payload: { questionId, selectedOption, isCorrect },
    });
  };

  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const previousQuestion = () => {
    dispatch({ type: 'PREVIOUS_QUESTION' });
  };

  const completeQuiz = () => {
    dispatch({ type: 'COMPLETE_QUIZ' });
    
    if (user) {
      // Save quiz results to history
      const quizTitle = sessionStorage.getItem('currentQuizTitle') || 'UPSC Quiz';
      const correctAnswers = state.answers.filter(a => a.isCorrect).length;
      
      const assessment: Assessment = {
        id: uuidv4(),
        title: quizTitle,
        date: new Date().toISOString(),
        score: correctAnswers,
        totalQuestions: state.questions.length,
        answers: state.answers,
        questions: state.questions,
      };
      
      // Get existing history
      const userId = user.id;
      const historyKey = `quiz_history_${userId}`;
      const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      
      // Add new assessment
      history.push(assessment);
      
      // Save updated history
      localStorage.setItem(historyKey, JSON.stringify(history));
      
      // Clear the quiz title from session storage
      sessionStorage.removeItem('currentQuizTitle');
    }
  };

  const resetQuiz = () => {
    dispatch({ type: 'RESET_QUIZ' });
  };

  const getHistory = (): Assessment[] => {
    if (!user) return [];
    
    const historyKey = `quiz_history_${user.id}`;
    return JSON.parse(localStorage.getItem(historyKey) || '[]');
  };

  return (
    <QuizContext.Provider
      value={{
        ...state,
        generateQuestions,
        answerQuestion,
        nextQuestion,
        previousQuestion,
        completeQuiz,
        resetQuiz,
        getHistory,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};