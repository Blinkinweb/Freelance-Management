// ============================================================
// FreelanceOS — TypeScript Types
// ============================================================

export type HealthScore = 'green' | 'amber' | 'red' | 'grey';
export type ClientStatus = 'active' | 'completed' | 'paused';
export type TestimonialStatus = 'not_requested' | 'sent' | 'received';
export type ProjectStatus = 'draft' | 'active' | 'completed';
export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue';
export type StageStatus = 'pending' | 'in_progress' | 'completed';
export type EmailType =
  | 'onboarding'
  | 'invoice'
  | 'kickoff'
  | 'update'
  | 'offboarding'
  | 'reminder'
  | 'revision_limit'
  | 'testimonial';
export type EmailStatus = 'draft' | 'sent' | 'opened';
export type DocumentType = 'srs' | 'sow' | 'invoice' | 'contract' | 'other';
export type ClientSource = 'form' | 'intake' | 'quick_capture' | 'manual';
export type PriceType = 'fixed' | 'starting_from';
export type ApiKeyService = 'openrouter' | 'sendgrid';

// ============================================================
// Database Row Types
// ============================================================

export interface UserProfile {
  id: string;
  full_name: string | null;
  business_name: string | null;
  email: string | null;
  google_business_url: string | null;
  invoice_template: Record<string, unknown> | null;
  digest_email_enabled: boolean;
  digest_email_time: string;
  testimonial_delay_days: number;
  invoice_payment_terms_days: number;
  created_at: string;
}

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  project_hint: string | null;
  budget_hint: number | null;
  deadline_hint: string | null;
  source: string;
  raw_input: string | null;
  converted: boolean;
  converted_client_id: string | null;
  created_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  source: ClientSource | null;
  status: ClientStatus;
  health_score: HealthScore;
  testimonial_status: TestimonialStatus;
  testimonial_sent_at: string | null;
  testimonial_content: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  user_id: string;
  name: string;
  description: string | null;
  budget: number | null;
  start_date: string | null;
  deadline: string | null;
  status: ProjectStatus;
  template_id: string | null;
  revision_limit: number;
  revisions_used: number;
  sow_generated: boolean;
  sow_url: string | null;
  offboarding_complete_at: string | null;
  testimonial_countdown_start: string | null;
  created_at: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Invoice {
  id: string;
  client_id: string;
  project_id: string | null;
  user_id: string;
  invoice_number: string | null;
  line_items: InvoiceLineItem[];
  subtotal: number;
  tax_rate: number;
  total: number;
  status: InvoiceStatus;
  due_date: string | null;
  paid_date: string | null;
  sent_at: string | null;
  viewed_at: string | null;
  pdf_url: string | null;
  sendgrid_message_id: string | null;
  created_at: string;
}

export interface TimelineStage {
  id: string;
  project_id: string;
  user_id: string;
  stage_number: number;
  name: string;
  status: StageStatus;
  scheduled_date: string | null;
  completed_date: string | null;
  notes: string | null;
  created_at: string;
}

export interface Document {
  id: string;
  client_id: string;
  user_id: string;
  type: DocumentType | null;
  name: string | null;
  file_url: string | null;
  created_at: string;
}

export interface EmailLog {
  id: string;
  client_id: string;
  user_id: string;
  type: EmailType;
  subject: string | null;
  body: string | null;
  status: EmailStatus;
  sendgrid_message_id: string | null;
  sent_at: string | null;
  opened_at: string | null;
  created_at: string;
}

export interface Revision {
  id: string;
  project_id: string;
  user_id: string;
  note: string | null;
  created_at: string;
}

export interface TemplateTimelineStage {
  name: string;
  estimated_days: number;
}

export interface ProjectTemplate {
  id: string;
  user_id: string;
  name: string;
  deliverables: string[];
  timeline_stages: TemplateTimelineStage[];
  revision_limit: number;
  base_price: number | null;
  price_range_max: number | null;
  out_of_scope: string[];
  deposit_percentage: number;
  created_at: string;
}

export interface Service {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  price: number | null;
  price_type: PriceType;
  delivery_time: string | null;
  tags: string[];
  created_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  service: ApiKeyService;
  encrypted_key: string | null;
  is_valid: boolean | null;
  last_tested_at: string | null;
  created_at: string;
}

export interface GoogleConnection {
  id: string;
  user_id: string;
  access_token: string | null;
  refresh_token: string | null;
  connected_form_id: string | null;
  connected_sheet_id: string | null;
  last_polled_at: string | null;
  created_at: string;
}

// ============================================================
// API Request / Response Types
// ============================================================

export interface QuickCaptureInput {
  text: string;
  source?: 'text' | 'voice';
}

export interface QuickCaptureResult {
  name: string | null;
  email: string | null;
  project_type: string | null;
  budget: number | null;
  deadline: string | null;
  confidence_scores: Record<string, number>;
}

export interface IntakeExtractionResult {
  client_name: string | null;
  client_email: string | null;
  project_name: string | null;
  budget: number | null;
  deadline: string | null;
  deliverables: string[];
  requirements: string[];
  timeline_milestones: string[];
  confidence_scores: Record<string, number>;
}

export interface SOWSection {
  project_overview: string;
  deliverables: string[];
  out_of_scope: string[];
  revisions: string;
  payment_terms: string;
  timeline: string;
}

export interface AnalyticsData {
  total_earnings: number;
  total_received: number;
  total_outstanding: number;
  total_overdue: number;
  active_clients: number;
  monthly_revenue: MonthlyRevenue[];
  per_client: PerClientRevenue[];
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface PerClientRevenue {
  client_id: string;
  client_name: string;
  total_invoiced: number;
  total_paid: number;
  total_outstanding: number;
}

export interface DigestItem {
  id: string;
  type:
    | 'invoice_due'
    | 'invoice_overdue'
    | 'inactive_client'
    | 'timeline_action'
    | 'upcoming_deadline'
    | 'pending_draft'
    | 'lead_followup'
    | 'testimonial_request';
  title: string;
  description: string;
  action_label: string;
  action_href: string;
  client_id?: string;
  invoice_id?: string;
  project_id?: string;
  lead_id?: string;
}

// ============================================================
// Component Prop Types
// ============================================================

export interface ClientWithProject extends Client {
  project?: Project | null;
  invoices?: Invoice[];
}
