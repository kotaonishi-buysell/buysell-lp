export interface ConsultationRequest {
  lp: string;
  name: string;
  phone: string;
  email: string;
  zip: string;
  items: string[];
  amount: string;
  timing: string;
  notes: string;
  privacyConsent: boolean;
  tcpaConsent: boolean;
  utm: Record<string, string>;
}

/**
 * Sends a consultation request.
 *
 * TODO: the submission endpoint (form back end / CRM) is not decided yet.
 * Replace the body of this function with the real request; throw on failure
 * so the form shows its error message.
 */
export async function submitConsultation(request: ConsultationRequest): Promise<void> {
  console.info('[submitConsultation] No endpoint configured yet. Request:', request);
}
