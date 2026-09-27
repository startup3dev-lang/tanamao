export type ServiceRequest = {
  id: string; title: string; description: string; status: string; created_at: string;
  target_provider_id: string; provider_name: string; quote_id: string | null;
  quote_status: string | null; total_amount: string | null; job_id: string | null;
  job_status: string | null; conversation_id: string | null;
};
export type ProviderRequest = {
  id: string; title: string; description: string; urgency: string; status: string;
  created_at: string; quote_id: string | null; quote_status: string | null;
  conversation_id: string | null;
  job_id: string | null; job_status: string | null;
};
export type Conversation = {
  id: string; request_id: string; job_id: string | null; customer_id: string; provider_id: string;
  title: string; provider_name: string; customer_name: string; last_message: string | null;
};
export type Message = { id: string; sender_id: string; body: string; created_at: string };
