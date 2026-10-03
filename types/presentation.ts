export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  balance: number;
  isGoogle: boolean;
  createdAt: string;
}

export interface Slide {
  id: string;
  pageNumber: number;
  title: string;
  points: string[];
  script: string; // Lời giảng bài do AI soạn
  duration: number; // Thời lượng ước tính (giây)
  wordCount: number;
  thumbnailUrl?: string;
  rotation?: number; // 0, 90, 180, 270 degrees
}

export interface KnowledgeUnit {
  id: string;
  title: string;
  type: 'theory' | 'practice' | 'summary' | 'discussion';
  startSlide: number;
  endSlide: number;
  mainContent: string;
  questionCount: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LectureProject {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  totalPages: number;
  overview: string;
  field: string;
  audience: string;
  units: KnowledgeUnit[];
  slides: Slide[];
  quizzes: QuizQuestion[];
  status: 'draft' | 'analyzed' | 'packaged';
  createdAt: string;
  voice: string;
  voiceSpeed: number;
  isPaid?: boolean;
  paidSlideCount?: number;
  totalCost?: number;
}

export interface TransactionRecord {
  id: string;
  desc: string;
  amount: string;
  time: string;
  status: string;
  type?: 'bonus' | 'payment' | 'recharge';
}

export type StepType = 1 | 2 | 3 | 4;
