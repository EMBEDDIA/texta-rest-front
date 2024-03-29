import {TextaTask} from './TaskStatus';
import {Index} from '../Index';
import {UserProfile} from '../UserProfile';


// tslint:disable:variable-name
export class Tagger {
  url: string;
  id: number;
  description: string;
  project: number;
  author: UserProfile;
  confusion_matrix: string;
  query: string;
  fields: string[];
  embedding: number;
  vectorizer: TaggerVectorizerChoices;
  num_positives: number;
  num_negatives: number;
  feature_selector: string;
  stop_words: string;
  analyzer: string;
  maximum_sample_size: number;
  negative_multiplier: number;
  location: string;
  precision: number;
  recall: number;
  f1_score: number;
  num_features: number;
  tagger_groups: { description: string }[];
  indices: Index[];
  ignore_numbers: boolean;
  scoring_function: string;
  plot: unknown;
  fact_name: string;
  classifier: string;
  pos_label: string;
  minimum_sample_size: number;
  tasks: TextaTask[];
  snowball_language: string;
  detect_lang: boolean;
  balance: boolean;
  balance_to_max_limit: boolean;
  is_favorited: boolean;
}

export enum TaggerVectorizerChoices {
  HASHING = 'Hashing Vectorizer',
  COUNT = 'Count Vectorizer',
  TFIDF = 'Tfidf Vectorizer',
}

export interface Profile {
  first_name?: any;
  last_name?: any;
  is_uaa_account: boolean;
  scopes: any[];
  application: string;
}

export interface Author {
  url: string;
  id: number;
  username: string;
  email: string;
  display_name: string;
  date_joined: string;
  last_login: string;
  is_superuser: boolean;
  profile: Profile;
}

export interface TaggerStatus {
  total: number;
  completed: number;
  training: number;
  created: number;
  failed: number;
}

export interface TaggerParams {
  fields: string[];
  vectorizer: string;
  classifier: string;
  stop_words: any[];
  ignore_numbers: boolean;
  balance: boolean;
  balance_to_max_limit: boolean;
  analyzer: string;
  detect_lang?: boolean;
  scoring_function?: string;
  maximum_sample_size?: number;
  negative_multiplier?: number;
  snowball_language?: string;
  embedding?: {name: string, id: number};
  indices?: string[];
}

export interface SumSize {
  size: number;
  unit: string;
}

export interface TaggerStatistics {
  avg_precision: number;
  avg_recall: number;
  avg_f1_score: number;
  sum_size: SumSize;
}

export interface TaggerGroup {
  id: number;
  url: string;
  author: Author;
  description: string;
  fact_name: string;
  blacklisted_facts: string[];
  use_taggers_as_ner_filter: boolean;
  ner_lexicons: number[];
  num_tags: number;
  minimum_sample_size: number;
  tagger_status: TaggerStatus;
  tagger_params: TaggerParams;
  tagger_statistics: TaggerStatistics;
  tasks: TextaTask[];
  is_favorited: boolean;
}


// For endpoints such as 'projects/{projectId}/tagger_groups/{taggerGroupId}/models_list/'
export class LightTagger {
  tag = '';
  url = '';
  status: string;
  id: number;
}


export class ListFeaturesResponse {
  features: { feature: string, coefficient: number }[];
  total_features: number;
  showing_features: number;
}
