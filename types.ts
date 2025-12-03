
export interface SanitizeResult {
  safePrompt: { title: string; prompt: string }[];
  videoPrompts: string[];
  detectedIssues: string[];
  enhancements: string;
}

export interface PromptHistoryItem {
  id: string;
  original: string;
  result: SanitizeResult;
  timestamp: number;
}

export const SafetyStatus = {
  IDLE: 'IDLE',
  PROCESSING: 'PROCESSING',
  SAFE: 'SAFE',
  ERROR: 'ERROR'
};

export type SafetyStatus = string;
