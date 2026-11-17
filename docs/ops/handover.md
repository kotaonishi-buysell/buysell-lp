# Handover (short version)

No secrets in this file. Keep keys and passwords in the company password manager.

## What this is
REWORTH landing pages (Astro, static) on Netlify. `/silver`, `/gold`, `/appraisal` and the legal pages are live. `/downsizing` and `/home-value` are drafts.

Read `README.md` and `AGENTS.md` first.

## How an inquiry flows
Form → `/api/contact` (Netlify Function) → a row in the Google Sheet (and an email, if set up).
If the function cannot take it, the browser sends it to Netlify Forms instead (Netlify → Forms). Nothing is lost.

Details: `docs/forms/contact-form.md`.

## Where things live (fill in the owners)

| What | Where | Owner (role, not a person) |
|---|---|---|
| Code | GitHub `kotaonishi-buysell/buysell-lp` | |
| Hosting, settings, secrets | Netlify site `loquacious-muffin-1f588f` | |
| Domain `reworth-buysell.com` | | |
| Inquiry sheet | Google Sheet (ID is in Netlify, `GOOGLE_SHEET_ID`) | |
| Google service account `reworth-form` | Google Cloud project `gifted-dreamer-513103-p1` | |
| Tags (GTM-PQQFZ723) | Google Tag Manager | |

## Netlify environment variables (names only)
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`
- `GOOGLE_SHEET_TAB` (only if the tab is not named `Inquiries`)
- Optional email: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`
- Do **not** set `GOOGLE_SCRIPT_URL` / `GOOGLE_SCRIPT_SECRET`. They switch to the old Apps Script way and break the sheet.

After any change, redeploy on Netlify (Deploys → Trigger deploy).

## Common jobs
- **Rotate the key:** Google Cloud → Service accounts → `reworth-form` → Keys → create a new JSON key → paste its `private_key` into `GOOGLE_PRIVATE_KEY` → redeploy → delete the old key.
- **Add or reorder a sheet column:** change `SHEET_COLUMNS` in `src/server/sheets.ts` and the sheet's header row together (same order).
- **Rename the tab:** set `GOOGLE_SHEET_TAB` to the new name, redeploy.
- **Inquiries stopped arriving in the sheet:** Netlify → Logs & metrics → Functions → `contact`.
  - `Google sign-in answered 400`: key or email is wrong.
  - `Google Sheets answered 403`: share the sheet with the service account as Editor.
  - `Google Sheets answered 404`: `GOOGLE_SHEET_ID` is wrong.
  - `Google Sheets answered 400`: tab name does not match.

## Before changing anything
Run `npm run check`, `npm run build`, `npm run check:public`, `npm test` (see `AGENTS.md`). Do not deploy drafts.

## Still open (business / legal)
Open items are listed by `npm run todos`. Legal review items (purchase wording, privacy, comparison tables, testimonials) wait for the lawyer.
