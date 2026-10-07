/*
 * Analytics events go to window.dataLayer (Google Tag Manager picks them up
 * when a container is configured in src/content/site.ts).
 *
 * Events:
 *   cta_click   { location, method }  location: header | hero | mid | final | sticky | company
 *                                     method: phone (tel: link) | form (opens the request form)
 *   faq_open    { question_id }
 *   form_start  {}                    first input in the request form
 *   form_submit { lp }                request accepted by submitConsultation()
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export const track = (event: string, params: Record<string, string | undefined> = {}): void => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
};
