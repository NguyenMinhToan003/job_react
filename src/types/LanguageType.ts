export interface Language {
  id: number;
  name: string;
}
export interface LanguageJob {
  languageId: number;
  level: number;
}
export interface LanguageResume {
  id?: number;
  level: number;
  language: Language;
  languageId: number;
}