export type SituationId =
  | 'travel'
  | 'shopping'
  | 'healthcare'
  | 'transport'
  | 'education'
  | 'workplace';

export type Formality = 'casual' | 'polite';

export interface Phrase {
  id: string;
  situationId: SituationId;
  kannada: string;
  romanization: string;
  english: string;
  note: string;
  formality: Formality;
  tags: string[];
  reviewed: boolean;
}

export interface PhraseDataset {
  version: string;
  situations: SituationMeta[];
  phrases: Phrase[];
  roleplays: RoleplayScenario[];
}

export interface SituationMeta {
  id: SituationId;
  title: string;
  titleKannada: string;
  description: string;
  phraseCount: number;
  accentColor: string;
}

export interface RoleplayOption {
  id: string;
  kannada: string;
  romanization: string;
  english: string;
  phraseId: string;
  nextStepId: string;
  feedback?: string;
}

export interface RoleplayStep {
  id: string;
  speaker: 'partner' | 'user';
  speakerName: string;
  kannada: string;
  romanization: string;
  english: string;
  phraseId?: string;
  options?: RoleplayOption[];
  nextStepId?: string;
}

export interface RoleplayScenario {
  id: string;
  situationId: SituationId;
  title: string;
  titleKannada: string;
  description: string;
  partnerRole: string;
  userRole: string;
  initialStepId: string;
  steps: Record<string, RoleplayStep>;
}
