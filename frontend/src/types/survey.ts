export interface Question {
  id: string;
  type: 'text' | 'paragraph' | 'email' | 'phone' | 'date' | 'time' | 'choice' | 'multiChoice' | 'rating' | 'scale' | 'matrix' | 'file';
  title: string;
  description?: string;
  required: boolean;
  options?: string[];
  minRating?: number;
  maxRating?: number;
  scaleLabels?: {
    start: string;
    end: string;
  };
  matrixRows?: string[];
  matrixColumns?: string[];
  fileTypes?: string[];
  maxFileSize?: number;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  responseCount: number;
  status: 'draft' | 'active' | 'closed';
}

export interface Response {
  id: string;
  surveyId: string;
  answers: Record<string, any>;
  submittedAt: Date;
  respondentId?: string;
}

export interface SurveyAnalytics {
  totalResponses: number;
  completionRate: number;
  averageTimeToComplete: number;
  questionAnalytics: QuestionAnalytics[];
}

export interface QuestionAnalytics {
  questionId: string;
  responseCount: number;
  distribution?: Record<string, number>;
  averageRating?: number;
}