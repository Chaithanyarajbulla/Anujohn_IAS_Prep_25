// User types
export interface User {
  id: string;
  name: string;
  email: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Quiz types
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Answer {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Answer[];
  isCompleted: boolean;
  isLoading: boolean;
  error: string | null;
}

// Assessment history types
export interface Assessment {
  id: string;
  title: string;
  date: string;
  score: number;
  totalQuestions: number;
  answers: Answer[];
  questions: Question[];
}

// File types
export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
}