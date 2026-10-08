# BuySell Home Decluttering Landing Page — Implementation Requirements

Version: 1.0<br />
Date: October 7, 2026<br />
Status: Ready for implementation of the page and preview flows; production integrations require the configuration identified below.<br />
Language: American English

## 1. Instructions for the Implementing Agent

Build one English-language landing page for BuySell's in-home buying and resale service, focused on **home decluttering and discovering the value of unused belongings**.

This document specifies the business requirements, content, behavior, integration boundaries, and acceptance criteria. A design system will be supplied separately. Apply that design system without deriving visual requirements from this document.

Read applicable repository instructions and inspect the existing implementation before editing. Work within the existing project and use its established technology unless a functional requirement makes a change necessary. Preserve the existing silver-focused landing page and its behavior. Create a separate page, using `/declutter/` as the default route; ensure direct navigation and refresh work. If repository constraints require a different route, document the route in the implementation handoff.

Implement all work that can proceed with the confirmed information. Do not stop implementation merely because the phone number, operating hours, or Jobber connection is not yet supplied. Use the explicit preview behavior in this document for unavailable integrations. Do not invent missing business information or present a preview as a live service.

All customer-facing text, validation messages, metadata, and confirmation states must be in English.

## 2. Scope

### Included

- One landing page for the home decluttering proposition.
- The content sequence and copy specified below.
- Telephone inquiry actions as the primary conversion path.
- A secondary visit-request flow with preferred date collection.
- Configuration boundaries for the phone number, business hours, request delivery, and future Jobber integration.
- Temporary sample assets that can be replaced with real photography.
- Form validation, submission states, accessibility, performance, and configurable conversion measurement.
- An implementation handoff stating what is operational and what remains unconfigured.

### Excluded

- The downsizing, estate belongings, and brand-item-only landing pages.
- Visual design specifications; these come from the separate design system.
- Junk removal, disposal, moving services, or whole-home clearance booking.
- Online price calculations, instant valuations, photo appraisal, customer accounts, or a resale storefront.
- Instant appointment confirmation or an invented live availability calendar.
- Banking information collection, payment processing, or payout tracking on the landing page.
- Advertising campaign setup, automatic installation of marketing trackers, or production deployment unless separately authorized.

## 3. Audience and Acquisition

**Service area:** Dallas–Fort Worth and surrounding areas in Texas.

**Primary audience:** Adults aged approximately 40–60 who have accumulated unused purchases, gifts, household items, and hobby belongings and want to organize their home.

**Primary acquisition channel:** Meta advertising. Assume many visitors are encountering BuySell for the first time and have not searched specifically for a buyer.

**Customer mindset:**

> I have all kinds of things at home that I barely use anymore. I want to sort them out, and if something has value, I might sell it. I do not know what can be sold, and taking everything to different stores would be a hassle.

Do not make age a customer eligibility restriction or a prominent customer-facing claim. This page is about everyday home organization, rather than a move, a bereavement, or exclusively luxury goods.

## 4. Confirmed Business Requirements

The following information was supplied by the client and takes precedence over older planning files and conflicting claims in the silver-focused page.

| Topic | Confirmed requirement |
|---|---|
| Public service brand | BuySell |
| Corporate name supplied | BuySell Technologies Co. Ltd. |
| Coverage | Dallas–Fort Worth and surrounding areas |
| Categories | Bags, watches, accessories, tableware, hobby items, and other household belongings |
| Minimum quantity | Visits are available for one item |
| Fees | Appraisal fees and travel fees are free |
| Additional items | Customers can show additional belongings for appraisal during the visit |
| Selling intent | Customers may use the service just to find out value; a decision to sell is not required before requesting a visit |
| Purchase | Items can be purchased during the visit when the customer accepts an offer |
| Payment | Funds reach the customer's bank account within three business days of the completed purchase |
| Group background | A publicly listed company in Japan |
| Group purchase history | 400,000 purchases across the group, including Japan and the United States |
| Information handling | The client states that the group maintains personal-information management, security, and governance practices |
| Primary contact | Telephone inquiries, ideally resulting in a visit appointment during the call |
| Secondary contact | Online submission of a preferred visit date/time, followed by staff confirmation |
| Planned operational tool | Jobber |
| Photography | Real photography can be produced later; sample assets are required initially |

Appraising an item is not a guarantee that BuySell will purchase it. Buying during the visit is not the same as paying immediately. Never reuse the existing page's same-day-payment claim.

## 5. Proposition and Writing Requirements

**Core proposition:** Before clearing out unused belongings, find out what they could be worth. BuySell visits the customer at home, assesses different types of items together, explains the offer, and lets the customer decide what to keep or sell.

**Reasons to contact BuySell:**

- No need to carry items to a store.
- Start with one item or show several different kinds of belongings.
- Add other items during the visit.
- Appraisal and travel are free.
- Customers can learn the value before deciding whether to sell.
- An accepted offer can become a purchase during the visit.

Write natural, concrete American English. Use familiar situations such as a bag no longer used, tableware received as a gift, or items from an old hobby. Avoid repetitive generic claims, exaggerated discovery language, artificial urgency, and unexplained industry terminology.

Use “appraisal” to describe the in-home assessment for a potential purchase. Do not imply a certified valuation for insurance, tax, investment, or estate documentation. Do not promise high offers, universal purchase eligibility, or guaranteed resale to another owner.

The copy below is the implementation baseline. Minor editorial changes may improve fluency, but must preserve the facts, intent, section purpose, and request-versus-confirmed-appointment distinction.

## 6. Page Content and Sequence

The page must contain the following seven sections in this order. Include brand identification and access to contact actions, as well as the factual footer content listed below. Do not import unrelated sections from the existing silver page.

### Section 1 — Opening Proposition

**Purpose:** Immediately identify the service, service area, and reason to inquire.

**Service label:** “Free in-home appraisals in Dallas–Fort Worth”

**H1:** “Before you clear it out, find out what it's worth.”

**Supporting copy:**

> Bags you no longer use. Tableware tucked away. Things from an old hobby. BuySell comes to your home to assess them together, so you can decide what to keep and what to sell.

**Primary action:** “Call BuySell”

**Secondary action:** “Request a Visit”

**Required reassurance statements:**

- “Free appraisal and travel.”
- “One item is enough.”
- “Just curious about the value? That's welcome, too.”

**Request clarification:** “Choose your preferred date. Our team will confirm your appointment.”

### Section 2 — Recognizable Belongings

**Purpose:** Help visitors recognize their own situation without requiring them to know an item's value.

**Heading:** “Sound familiar?”

**Content:**

- “You bought it years ago, but hardly use it now.”
- “It was a gift, and it's still tucked away.”
- “You used to collect it. Now you're ready to make some room.”

**Closing copy:** “You don't need to know what it's worth before you get in touch.”

### Section 3 — Items to Ask About

**Purpose:** Establish the breadth of the service and encourage mixed-category inquiries.

**Heading:** “Different kinds of belongings. One visit.”

**Categories:**

- Bags
- Watches
- Jewelry and accessories
- Tableware
- Cameras
- Musical instruments
- Coins and stamps
- Art and antiques
- Other belongings you would like us to assess

Amendment, October 8, 2026: The client approved the four additional categories above in this chat. The original six-category planning document is expanded to ten; this does not promise purchase of every item.

Subsequent amendment, October 8, 2026: Remove the standalone “Hobby and collectible items” category from the cards and form choices, leaving nine categories. General hobby-related situations elsewhere remain unchanged.

**Supporting copy:**

> Start with the items you have in mind. If something else comes to mind while we're there, you can show us that, too.

**Qualification:** “We can assess your items and explain whether we can make a purchase offer.”

Do not invent a detailed brand list, exclusion list, condition policy, or specialist certification. “Other belongings” invites assessment, not a promise to purchase every object.

### Section 4 — Make the Decision After the Appraisal

**Purpose:** Explain the customer's control and what the appraisal helps them decide.

**Heading:** “Know the value. Then decide.”

**Copy:**

> Hear the appraisal and the offer before choosing what to do. Keep the things you want to keep, consider selling others, or simply learn more about what you have.

**Required points:**

- Customers can request a visit without having decided to sell.
- Customers can consider individual items rather than sell everything together.
- BuySell may explain that an item cannot be purchased.
- Appraisal and travel are free.

Do not extend these statements into an unconfirmed cancellation, disposal, or collection policy.

### Section 5 — Example Inquiries and Company Background

**Purpose:** Make the service tangible and provide attributable company context.

**Heading:** “You don't have to have it all figured out.”

**Label:** “Example inquiries”

**Examples:**

- “I have an unused bag and some tableware. Can you look at both?”
- “I have a few things from an old hobby, but I don't know what they're worth.”
- “I'd like to start with one item and show you a few other things at home.”

These are illustrative inquiry examples, not reviews or actual customer accounts. Do not add names, star ratings, quoted purchase amounts, or customer outcome claims.

**Company background heading:** “About the BuySell group”

**Baseline factual copy:**

> BuySell Technologies Co. Ltd. is publicly listed in Japan. The group has completed 400,000 purchases across Japan and the United States.

Use this as client-supplied draft copy. Before public launch, confirm the official English entity name, the relationship between the local operator and the group, and the approved source and reporting period for the purchase count. The count must remain a group-wide purchase count, never a Dallas customer count or a U.S.-only count.

Do not invent exchange details, ticker symbols, registration numbers, certifications, security standards, staff credentials, insurance, or background-check claims. Do not claim that public listing itself proves a specific security control. Link to the approved privacy information when supplied; precise corporate governance wording requires supplied company material.

### Section 6 — Process and FAQ

**Purpose:** Explain what happens after contact, including the payout timing.

**Heading:** “How a home visit works”

1. **“Tell us what you have.”** Call BuySell or send a visit request with your preferred date. Our team will confirm the appointment.
2. **“Show us your items at home.”** We assess the items you want us to see. You can add other belongings during the visit.
3. **“Hear the offer and decide.”** We explain the appraisal. You choose which items, if any, you would like to sell.
4. **“Receive your payment.”** If a purchase is completed, the payment reaches your bank account within three business days.

Do not supply a visit duration, response-time promise, collection timeline, payout provider, or banking holiday definition that has not been confirmed.

**Required FAQ and baseline answers:**

| Question | Answer |
|---|---|
| “Can I request a visit for just one item?” | “Yes. Visits are available for one item.” |
| “Can you assess different types of items in the same visit?” | “Yes. You can show us bags, watches, jewelry and accessories, tableware, hobby items, and other belongings.” |
| “Can I show you more items during the visit?” | “Yes. If you think of something else while we're there, you can ask us to assess it.” |
| “What if I only want to know the value?” | “That's welcome. You do not need to decide to sell before requesting an appraisal.” |
| “How much does the visit cost?” | “Appraisal and travel are free.” |
| “What if I don't know what the item is?” | “Tell us what you can. You do not need to identify the item or estimate its value before contacting us.” |
| “Can I ask about an older item or one with signs of use?” | “Yes. Tell us about its condition so we can assess it and explain whether we can make a purchase offer.” |
| “When will I receive payment?” | “After a completed purchase, funds reach your bank account within three business days.” |
| “Where do you visit?” | “We serve Dallas–Fort Worth and surrounding areas. Contact us to confirm your location.” |
| “Is my appointment confirmed when I send a request?” | “No. Your request tells us your preferred date and time. Our team will contact you to confirm the appointment.” |

### Section 7 — Final Contact Opportunity

**Purpose:** Give visitors a clear next step after they understand the service.

**Heading:** “Make some room. Start by finding out what you have.”

**Supporting copy:**

> One item or several. Ready to sell or just curious. Talk to BuySell about a free in-home appraisal in Dallas–Fort Worth.

**Primary action:** “Call BuySell”

**Secondary action:** “Request a Visit”

**Request clarification:** “Submitting a request does not confirm an appointment. Our team will confirm the date and time with you.”

### Footer Content

- BuySell brand name.
- Approved local operating entity and contact details when supplied.
- Service area.
- Approved privacy policy link.
- Other business or legal links only when approved content or URLs are supplied.
- Accurate copyright information.

Never present a placeholder policy as a real legal document. Missing corporate details must be recorded in the handoff, not fabricated.

## 7. Telephone Contact Requirements

The configured telephone action must initiate a call through a valid `tel:` link. All telephone actions must use the same approved number and have an accessible, descriptive label.

Store the display number and normalized telephone target in configuration. Operating hours are also configurable; display them only when supplied. If hours are supplied, identify them as Central Time. Do not infer that the business is currently open.

**When the number is unavailable:**

- Do not create a telephone link using dummy digits or a placeholder.
- In the preview, retain an explicitly unavailable telephone action and state “Phone number pending.”
- Keep the visit-request preview accessible.
- Record the missing number as a public-launch blocker because telephone is the primary conversion.

A telephone click is an intent event, not proof of a connected call, qualified inquiry, or appointment.

## 8. Online Visit Request

### Appointment Model

The online flow collects a **preferred date and time**. It submits a request for staff review. It does not reserve a slot or confirm an appointment.

Do not display invented availability, available-slot counts, urgency messages, or calendar bookings. In the initial implementation, use date/time preference inputs rather than a simulated live scheduling system.

### Form Fields

These are implementation defaults, not claims about Jobber's supported field schema. Map them to the approved integration once its interface is supplied.

| Field | Requirement |
|---|---|
| Full name | Required |
| Phone number | Required; accept reasonable U.S. formatting without requiring one exact punctuation pattern |
| Email | Optional |
| Visit ZIP code | Required; validate a five-digit U.S. ZIP code |
| Item categories | Optional multiple selection using the categories in Section 3; include “Other / Not sure” |
| Preferred visit date | Required; a past date is invalid |
| Preferred time | Optional; accept a preference, not a confirmed slot |
| Additional details | Optional; request a short description of the items, not sensitive information |

Use `America/Chicago` for interpreting local preferred dates and times. The ZIP field must not claim confirmed coverage without an approved service-area dataset. Staff can confirm the location when reviewing the request.

Do not collect bank details, government ID, date of birth, or a full household inventory. Do not add a required marketing opt-in. Any consent language must come from approved business copy; do not reuse placeholder consent text from the existing page.

### Form Copy

- Title: “Request a Visit”
- Introduction: “Tell us what you'd like us to assess and when a visit would suit you.”
- Date/time helper: “Your preferred date and time are subject to confirmation by our team.”
- Submit button: “Send Visit Request”
- Submitting label: “Sending your request…”
- Successful submission: “Your visit request has been received. Our team will contact you to confirm the date and time. Your appointment is not confirmed yet.”
- Failed submission: “We couldn't send your request. Please try again.” Add the telephone option only if a real number is configured.

### Required States

- Initial form.
- Field-level validation errors that identify the correction needed.
- Submission in progress, with duplicate submissions prevented.
- Confirmed receipt by the configured receiving service.
- Submission failure, with entered values preserved for retry.
- Integration-unavailable preview state.

Only report success when the configured receiving service acknowledges that it accepted the request. Do not clear the form or show success after a failed request.

## 9. Jobber and Request Delivery

Jobber is the planned operational destination, but no account configuration, API credentials, approved hosted request URL, field mapping, or submission endpoint has been supplied.

Implement a replaceable request-delivery boundary. Use an existing approved backend or form integration if the project already provides one. Do not invent Jobber API endpoints, authentication schemes, capabilities, account identifiers, or confirmed availability.

If live Jobber work becomes part of the implementation, consult current official Jobber documentation before selecting an integration mechanism. Keep provider credentials server-side. A client-supplied hosted request flow may be used if it supports staff-confirmed requests and preserves the appointment distinction.

**Without a configured receiving service:**

- Use an explicit preview-only request flow.
- Display “Preview only — no visit request will be sent.” before submission.
- Allow local validation to demonstrate the interaction.
- After valid preview input, state “Your details pass validation. No request has been sent and no appointment has been booked.”
- Do not send entered information externally or retain it persistently.

Public launch requires an approved receiving destination, end-to-end validation, and a responsible staff workflow for reviewing requests. A real reception can be connected before Jobber if the client approves that destination; do not describe it as Jobber-connected until verified.

## 10. Configuration and Unresolved Information

Keep business and integration values separate from page behavior so they can be updated without editing multiple sections.

**Confirmed configuration:** brand, service area wording, categories, free appraisal/travel, one-item visits, additional assessments, value-only inquiries, and three-business-day payment.

**Not yet supplied:**

- Telephone number and operating hours.
- Telephone response arrangements outside staffed hours.
- Approved submission destination or Jobber setup.
- Exact service-area ZIP coverage.
- Local operating entity, address, and official group relationship wording.
- Official evidence and reporting date for the group purchase count.
- Approved privacy policy URL and applicable consent text.
- Whether purchased items are taken away during the visit or collected later.
- Cancellation conditions.
- Real staff/customer photography and approved testimonials.

These missing items must not prevent page implementation. Omit unsupported assertions, use preview states where necessary, and list public-launch dependencies in the handoff. Do not copy old placeholders or contradictory service claims into finished customer copy.

## 11. Assets, Accessibility, and Performance

Use temporary sample images initially and make their replacement straightforward. Sample subjects must not be represented as actual staff or customers. Do not fabricate testimonials, profile names, reviews, or ratings. Alternative text must describe the image accurately. Any sample staff/customer imagery must have an appropriate sample-image disclosure while used in a preview.

Follow the supplied design system for presentation. Independently ensure that headings, links, form labels, error messages, and FAQ interactions are semantic and keyboard-accessible. If a dialog is used, support focus management, keyboard closure, and returning focus to its trigger.

The page must work on mobile and desktop without hiding essential contact or booking behavior. Images must have appropriate dimensions and loading behavior; avoid unnecessary dependencies and broken asset references. Keep the main content accessible even when tracking scripts are absent.

## 12. Metadata and Measurement

**Suggested title:** “Free In-Home Appraisals in Dallas–Fort Worth | BuySell”

**Suggested description:** “Decluttering your home? BuySell assesses bags, watches, jewelry, tableware, and hobby items at home. Free appraisal and travel. One item is enough.”

Use the real deployment URL for canonical and sharing metadata when supplied; do not invent a production domain.

Make the following events available through a configurable measurement boundary:

- `phone_click`: a configured telephone action was activated.
- `visit_request_open`: the online request flow was opened.
- `visit_request_submit`: a request was accepted by the receiving service.
- `visit_request_error`: delivery failed; include only a non-sensitive error category.

Do not emit `visit_request_submit` for preview validation, a submit-button click, or an unacknowledged request. A request-received event is not an appointment-confirmed event.

Tracking integrations and account IDs are not supplied. Do not automatically install a Meta Pixel or send data to an advertising service. Events can remain local or inactive until approved tracking configuration is supplied. Never put names, phone numbers, emails, item descriptions, or preferred dates in analytics payloads. Campaign attribution may use approved UTM fields; do not retain entire query strings or arbitrary identifiers without a defined need.

## 13. Acceptance Criteria

### Content

- The new page targets general home decluttering and mixed-category appraisal, rather than silver alone.
- All seven sections and both contact paths are present.
- Dallas–Fort Worth coverage, free appraisal/travel, one-item visits, additional items, and value-only inquiries are clear.
- Payment is consistently described as reaching the customer's bank account within three business days after purchase.
- There are no same-day-payment claims, fabricated prices, review scores, customer stories, or unsupported company credentials.
- Group history is attributed to the group and includes Japan and the United States.
- The page does not imply junk removal, universal purchase acceptance, or confirmed online appointments.

### Behavior

- Direct navigation and refresh load the new route; the existing silver page still works.
- Configured call actions use the approved number. Unconfigured actions cannot dial a dummy number.
- Visit-request actions reach the request flow consistently.
- Required fields and past dates are validated; ZIP format validation is not presented as a coverage check.
- Submission, success, failure, retry, and unavailable-integration states work as specified.
- A live request is not acknowledged before acceptance by the receiving service.
- Online request success explicitly states that staff confirmation is still required.
- Preview input is not transmitted or stored persistently.

### Quality and Handoff

- Essential flows are usable by keyboard and on mobile and desktop.
- There are no missing assets, uncaught runtime errors, exposed credentials, or personal data in analytics/logging.
- Existing applicable project checks pass; use meaningful validation for the new form and contact behavior.
- Test the configured submission flow with approved test data if a receiving service is available. Otherwise report integration verification as pending.
- Document the new route, editable configuration, sample asset locations, checks performed, and outstanding launch dependencies.

## 14. Expected Implementation Deliverables

1. The new English-language landing page in the existing project.
2. Working configured contact/request flows, or explicit preview behavior where integrations are missing.
3. Editable business configuration and replaceable temporary assets.
4. Appropriate functional verification results.
5. A concise handoff distinguishing implemented features, connected services, unverified integrations, and information needed before public launch.

Begin implementation using these requirements and the separately supplied design system. Preserve confirmed business facts and complete all unblocked work before requesting additional information.
