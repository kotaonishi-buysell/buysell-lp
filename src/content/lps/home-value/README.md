# Home Value LP — implementation handoff

## Requirement source and route
- Implementation baseline: [home-value.en.md](../../../../docs/requirements/home-value.en.md), copied from the client-specified planning file dated October 7, 2026.
- Visual specification: [Home Value DESIGN_SYSTEM.md](../../../../docs/design/home-value/DESIGN_SYSTEM.md).
- Route: **/home-value**. The source document suggests /declutter/ by default, but the current user explicitly requested applying it to /home-value, so that route is retained. Direct navigation and refresh generate a standalone Astro page.
- The repository contains /downsizing, not the source document's silver page. Its content and behavior are preserved. No silver-page files or old same-day-payment claims were imported.
- Home Value now has an independent page, configuration, form and stylesheet. It does not import the legacy company placeholders, consent copy, scripts or submit stub.

## Implemented
Seven sections in the required order; brand identification; six categories; ten FAQs; examples labeled as illustrative; group-wide purchase history labeled client-supplied draft.
Confirmed copy includes Dallas–Fort Worth and surrounding areas, free appraisal and travel, one-item visits, additional items during the visit, value-only inquiries and bank-account payment within three business days after completed purchase.
Primary phone actions are explicitly unavailable while the approved number is absent. All request actions lead to the same inline form.

The form requires name, U.S. phone, five-digit ZIP and a non-past preferred date interpreted in America/Chicago. Email, category selection, time preference and brief notes are optional. ZIP validation checks format only.
Validation errors, sending/duplicate prevention, explicit preview outcome, service-acknowledged receipt, failure and retry are implemented. No invented availability, banking fields, placeholder consent or marketing opt-in.

## Editable files
- Page copy: index.ts in this directory.
- Business and integration values: config.ts in this directory. Confirmed values are populated; unavailable values are null.
- Route: src/pages/home-value.astro.
- Contact and form components: src/components/home-value/.
- Validation and delivery boundary: src/lib/home-value-request.ts.
- Browser behavior and local measurement: src/scripts/home-value.ts.
- Design: src/styles/home-value.css.
- Original SVG samples: public/images/home-value/*-sample.svg. These are labeled illustrations, not actual people or photography. Replace with approved photography and update image paths, dimensions and alt text.

## Operational versus unconfigured
| Boundary | Current status |
|---|---|
| Page and sample assets | Implemented; local preview available |
| Phone number and hours | Unconfigured; no dummy-number links, no hours or open-now claims |
| Request validation | Runs locally; past dates use Central Time |
| Request delivery | Preview only; no receiving service connected |
| Jobber | Planned; no endpoint, credentials, field mapping or account configuration assumed |
| Analytics | Disabled by default; no advertising tracker installed |
| Group/company copy | Client-supplied draft; approval and count source/reporting period pending |
| Legal links/local operator | Omitted until approved details and URLs are supplied |
| Canonical/production metadata | No production domain invented; preview is noindex |

## Delivery adapter contract
Set deliveryEndpoint only after an approved receiving service and staff review workflow exist. The browser POSTs JSON with lp, name, phone, email, zip, categories, preferredDate, preferredTime, timeZone and notes.
An HTTP 2xx response must contain JSON **{ "accepted": true }** before receipt is displayed or visit_request_submit emitted. Empty responses, malformed JSON, rejected requests and network errors show failure and retain entered values. Requests time out after 15 seconds.
This is an application adapter contract, not a claim about Jobber's API. Integrate a backend with server-side provider credentials and appropriate server validation when the provider interface is approved.
Without an endpoint, valid input produces: "Your details pass validation. No request has been sent and no appointment has been booked." No network send, persistent storage or personal-data logging occurs.
Live success still says the appointment is not confirmed. Do not connect a provider using browser-visible credentials.

## Measurement
measurementEnabled defaults to false. If approved, setting it true emits local buysell:measurement CustomEvents for phone_click, visit_request_open, visit_request_submit and visit_request_error.
Payload is allowlisted to event, lp, and a non-sensitive failure category. It contains no contact details, descriptions, dates, arbitrary query strings or UTM values. No Meta Pixel, GTM or external forwarding is installed for this page.
Phone events represent tap intent; accepted requests are not confirmed appointments.

## Checks performed
- Astro check: 43 files, zero errors/warnings/hints.
- Astro build: /home-value, /downsizing and the existing / redirect generated.
- npm run test:home-value: ten tests passed for U.S. phone formats, required/optional fields, impossible/past dates, Chicago day boundaries, preview without transmission, receiving-service acknowledgement, failures/retry and dummy phone suppression.
- Browser: seven sections, all seven sample assets loaded, no console errors, form navigation, required-field and past-date errors, successful local validation and explicit no-send/no-booking message.
- Responsive: desktop and narrow single-column layouts checked; no horizontal overflow.
- Existing /downsizing main HTML compared before/after; content unchanged.
- Real request delivery/Jobber verification: pending. Receiving-service states tested with mocked transport, not a live provider.

## Public-launch dependencies
Approved phone number, operating hours when supplied, receiving destination and staff confirmation workflow, live integration testing, exact ZIP coverage if automatic coverage checks are wanted, local operating entity/contact details, privacy information and consent wording, company/group wording approval and purchase-count source/reporting date, production domain, approved photography and desired DM Sans assets.
No unsupported cancellation, item collection, staff credential or security-standard claims have been added.
