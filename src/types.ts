export type Language = 'en' | 'hi' | 'kn' | 'ta' | 'te';

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface AnalyticsData {
  userId: string;
  language: Language;
  symptoms?: string;
  diagnosis?: string;
  procedure?: string;
  rawMessage: string;
}
