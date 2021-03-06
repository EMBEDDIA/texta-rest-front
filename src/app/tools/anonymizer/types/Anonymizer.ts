export interface Anonymizer {
  id: number;
  url: string;
  description: string;
  replace_misspelled_names: boolean;
  replace_single_last_names: boolean;
  replace_single_first_names: boolean;
  misspelling_threshold: number;
  auto_adjust_threshold: boolean;
  mimic_casing: boolean;
}
