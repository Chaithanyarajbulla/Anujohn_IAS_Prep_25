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

const generateQuestionsFromPDF = (content: string): Question[] => {
  // Extract important sentences and concepts from the content
  const sentences = content.split(/[.!?]+/).filter(s => s.length > 20);
  const keywords = extractKeywords(content);
  
  return sentences.slice(0, 25).map((sentence, index) => {
    const questionData = generateQuestionFromSentence(sentence, keywords);
    return {
      id: uuidv4(),
      ...questionData
    };
  });
};

const extractKeywords = (content: string): string[] => {
  // Extract important keywords and phrases
  const words = content.split(/\s+/);
  return words.filter(word => 
    word.length > 4 && 
    !['which', 'what', 'when', 'where', 'why', 'how'].includes(word.toLowerCase())
  );
};

const generateQuestionFromSentence = (sentence: string, keywords: string[]): Omit<Question, 'id'> => {
  // Generate a question based on the sentence
  const relevantKeywords = keywords.filter(k => sentence.toLowerCase().includes(k.toLowerCase()));
  const keyword = relevantKeywords[Math.floor(Math.random() * relevantKeywords.length)];
  
  // Generate question text
  const questionText = `What is the significance of ${keyword} in the context of UPSC examination?`;
  
  // Generate options using content context
  const options = [
    `It represents a key concept in ${sentence}`,
    `It's related to economic reforms and policies`,
    `It's a significant historical event or movement`,
    `It's an important constitutional provision`
  ];
  
  // Randomly select correct answer
  const correctAnswer = options[Math.floor(Math.random() * options.length)];
  
  return {
    text: questionText,
    options,
    correctAnswer,
    explanation: `The concept of ${keyword} is important because ${sentence}. This is a frequently asked topic in UPSC examinations.`
  };
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
      setTimeout(() => {
        const questions = generateQuestionsFromPDF(content);
        dispatch({ type: 'GENERATE_QUESTIONS_SUCCESS', payload: questions });
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