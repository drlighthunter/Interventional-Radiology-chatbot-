export type Language = 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'ml' | 'or' | 'bn' | 'mr' | 'gu';

export interface PatientDemographics {
  age?: string;
  gender?: string;
  history?: string;
  location?: string;
  symptoms?: string;
  diagnosis?: string;
}

export interface Attachment {
  name: string;
  type: string;
  data: string; // base64
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  attachments?: Attachment[];
}

export interface AnalyticsData {
  userId: string;
  language: Language;
  symptoms?: string;
  diagnosis?: string;
  procedure?: string;
  rawMessage: string;
  demographics?: PatientDemographics;
}
