export interface FieldMeta {
  type: "text" | "number" | "cin" | "email" | "phone" | "date" | "percentage";
  label_ar: string;
  label_fr: string;
  placeholder_ar: string;
  placeholder_fr: string;
  required: boolean;
  pattern?: string;
  min_length?: number;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  hint_ar: string;
  hint_fr: string;
  help_ar: string;
  help_fr: string;
}

export interface TemplateArticle {
  id: string;
  text_ar: string;
  text_fr: string;
  fields: string[];
}

export interface TemplateSection {
  id: string;
  title_ar: string;
  title_fr: string;
  articles: TemplateArticle[];
}

export interface Template {
  id: string;
  slug: string;
  title_ar: string;
  title_fr: string;
  description_ar?: string;
  description_fr?: string;
  domain: string;
  complexity: string;
  field_count: number;
  legal_basis?: string;
  disclaimer?: string;
  sections: TemplateSection[];
  field_metadata: Record<string, FieldMeta>;
}

export interface ContractWarning {
  field: string;
  severity: "warning" | "error" | "info";
  message_ar: string;
  message_fr: string;
  suggestion_ar: string;
  suggestion_fr: string;
  suggested_value: string;
  correction_type: "auto" | "manual" | "info";
}

export interface GeneratedContract {
  id: string;
  slug: string;
  title_ar: string;
  title_fr: string;
  sections: TemplateSection[];
}

export interface GenerateResponse {
  success: boolean;
  contract: GeneratedContract | null;
  model_used: string;
  language: string;
  error: string | null;
  fallback_attempted: boolean;
  generation_time_ms: number;
  tokens_used: number;
  review_time_ms: number;
  warnings: ContractWarning[];
}
