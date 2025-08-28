export interface Language {
  id: number;
  name: string;
}
export interface LanguageJob {
  languageId: number;
  language?: Language;
  level: number;
}
export interface LanguageResume {
  id?: number;
  language: Language;
  languageId: number;
}