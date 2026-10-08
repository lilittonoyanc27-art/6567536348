export interface SubtitleItem {
  id: number;
  timeSeconds: number; // Start timestamp in seconds
  endSeconds?: number;
  timeDisplay: string; // e.g. "0:00", "0:03", "1:14"
  spanish: string;
  armenian: string;
  speaker?: string; // e.g. "Don Rafael", "Don Alejandro", "Helena", "Bernardo"
  contextNote?: string; // helpful grammatical or cultural nuance
}

export interface QuizOption {
  key: 'A' | 'B' | 'C' | 'D';
  spanish: string;
  armenian: string;
}

export interface QuizQuestion {
  id: number;
  number: number;
  questionSpanish: string;
  questionArmenian: string;
  options: QuizOption[];
  correctOptionKey: 'A' | 'B' | 'C' | 'D';
  explanationSpanish: string;
  explanationArmenian: string;
  relatedTimestamp?: string;
}
