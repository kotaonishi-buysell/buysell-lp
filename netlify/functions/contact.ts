/*
 * Netlify Function for POST /api/contact (the receiving side of the shared contact form).
 * The logic lives in src/server/contact.ts; Netlify bundles this file and its imports.
 */
import { handleContact, type ContactEnv } from '../../src/server/contact.ts';

declare const Netlify: { env: { toObject(): Record<string, string> } } | undefined;
declare const process: { env: ContactEnv };

export default async (request: Request): Promise<Response> => {
  // Netlify exposes variables through Netlify.env; process.env is the fallback (local tests).
  const env = (typeof Netlify !== 'undefined' ? Netlify.env.toObject() : process.env) as ContactEnv;
  return handleContact(request, env);
};

export const config = { path: '/api/contact' };
