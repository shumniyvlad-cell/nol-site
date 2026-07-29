# NOL V2 — production fidelity ledger

Source of truth: `design/concepts-v2/`.

Screenshots are captured in the Codex visualization workspace so production
source is not polluted by temporary QA artifacts.

## 01 — Hero

Status: **gate closed**.

Reference:

- desktop: `design/concepts-v2/01-hero-poster.png`
- mobile: left panel of `design/concepts-v2/10-mobile-poster-system.png`

Browser screenshots:

- desktop 1586×992:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/hero-desktop-gate-final.png`
- mobile 390×844:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/hero-mobile-final-03.png`

Comparison:

- H1 restored to the three-line desktop and four-line mobile compositions.
- Horizon crosses the full viewport at the V2 optical level.
- Portal scale and placement match the reference role; asset edges dissolve
  into the black field.
- Desktop actions use the long editorial rules and separator from V2.
- The lower transition rail is visible on desktop; mobile retains the approved
  vertical poster crop.
- Mobile uses the prerendered portal fallback and one red menu signal.

Corrections made before closing:

- removed the accidental five-line desktop H1;
- corrected the over-centred 1440px frame;
- reduced and lowered the portal;
- restored the lower statement rail;
- lengthened action rules;
- added the mobile-specific line logic and menu signal.

Intentional production deviations:

- Manrope uses the approved 550 weight instead of the visually thin
  generative lettering in the concept.
- Header height follows the extracted 72/64px system token.

Verification:

- browser DOM snapshot: meaningful landmarks, H1 and route links present;
- mobile menu opened and closed; `aria-expanded` changed correctly;
- browser console warnings/errors: none;
- `prefers-reduced-motion` browser path confirmed the prerender fallback.

## 02 — Problem

Status: **gate closed**.

Reference:

- desktop: `design/concepts-v2/02-problem-poster.png`
- mobile: the same documentary-room idea, reflowed as a vertical poster

Browser screenshots:

- desktop 1586×992:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/problem-desktop-gate.png`
- mobile 390×844:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/problem-mobile-pass-01.png`

Comparison:

- documentary room, person, documents, phone light and window retain the V2
  positions;
- projection begins on the right wall at the reference coordinates;
- H2 keeps the three-line rhythm and the body keeps the neutral explanatory
  hierarchy;
- the four-part observation timeline aligns with the V2 lower edge;
- mobile preserves one scene and one projected statement instead of turning
  observations into cards.

Corrections made before closing:

- reduced the projected H2 width while preserving its vertical rhythm;
- moved the explanatory projection upward by approximately 30px;
- kept the single red signal inside the documentary scene.

Intentional production deviation:

- the persistent production header overlays the section; the standalone V2
  poster has no global header.

Verification:

- section geometry: 992px high at the 1586×992 desktop viewport;
- desktop and mobile screenshots visually inspected beside the reference;
- browser console warnings/errors: none.

## 03 — Brand Turn

Status: **gate closed**.

Reference:

- desktop: `design/concepts-v2/03-brand-turn-poster.png`
- mobile: responsive vertical translation of the same physical fold

Browser screenshots:

- desktop 1586×992:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/brand-turn-desktop-final.png`
- mobile top 390×844:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/brand-turn-mobile-top-gate.png`
- mobile bottom 390×844:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/brand-turn-mobile-bottom-final.png`

Comparison:

- the black sheet, white opening, portal and person retain the V2 spatial axis;
- both text poles align with the accepted poster;
- the right explanatory paragraph was narrowed to the reference four-line
  measure;
- four sign states form one material trace rather than four cards;
- mobile keeps a single fold image between black and white text fields.

Corrections made before closing:

- reduced the width of the right display statement;
- matched the trace spacing to the V2 coordinates;
- restored mobile line breaks after detecting joined words;
- separated the mobile body and sign trace vertically;
- changed early mobile sign states to dark matter so they remain visible on
  white.

Intentional production deviations:

- only the final state carries the red signal; the generative V2 poster shows
  several red points, while the production token system allows one active red
  signal per viewport;
- the global production header remains present.

Verification:

- desktop section geometry: 992px at the 1586×992 viewport;
- long mobile section checked in two adjacent browser screenshots;
- reduced-motion CSS exposes the final trace state without animation;
- browser console warnings/errors: none.

## 04 — Diagnostic

Status: **gate closed**.

Reference:

- desktop: `design/concepts-v2/04-diagnostic-poster.png`
- mobile: right panel of `design/concepts-v2/10-mobile-poster-system.png`

Browser screenshots:

- desktop 1586×992:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/diagnostic-desktop-production-copy.png`
- mobile 390×844:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/diagnostic-mobile-gate.png`

Comparison against the requested refinement:

- giant `02` remains the stage number but is explicitly pushed into the
  background;
- the legal-financial question is the primary semantic object;
- answer rows retain the V2 hairlines and receive 88px desktop / 72px mobile
  vertical space;
- exactly one red point marks the selected answer;
- side numbering remains dot-based and does not become a progress bar;
- Back and Continue are real underlined buttons with arrows and disabled
  states;
- desktop and mobile share the same type hierarchy and line-based answer
  system.

Corrections made before closing:

- removed a duplicate section wordmark under the global header;
- aligned the question and option axes to V2;
- reduced the mobile section from 900px to the native 844px viewport so both
  the step label and actions remain visible.

Functional verification:

- changed the selected radio answer;
- advanced from question 02 to question 03;
- confirmed Continue disables when question 03 has no answer;
- returned to question 02 and confirmed the changed answer remained selected;
- completed all seven questions, including the intentionally missing first
  question when entering from the V2 stage-02 reference state;
- validated the result form, Russian phone mask, explicit consent, success and
  error states;
- added a hydration guard so a click cannot submit the static HTML form before
  React is ready;
- browser console warnings/errors: none.

Intentional production deviations:

- the giant number is lower contrast than the generative poster because the
  approved clarification makes the question primary;
- the side active step is black, not red, so the selected answer remains the
  sole red signal;
- the global header remains present and switches to the light theme.

## 05 — Process

Status: **gate closed**.

Reference:

- desktop: `design/concepts-v2/05-process-poster.png`
- mobile: the same threshold system translated into a vertical route

Browser screenshots:

- desktop 1586×992:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/process-desktop-final.png`
- mobile top 390×844:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/process-mobile-pass-01.png`
- mobile bottom 390×844:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/process-mobile-bottom-pass-01.png`

Comparison:

- five thresholds remain one architectural field;
- stage 03 occupies the illuminated central opening;
- title, giant number, active explanation, stage labels and timing note align
  with the accepted V2 poster;
- the red route runs from stage 02 to the active stage 03;
- mobile becomes one continuous vertical route with the active red coordinate,
  not a carousel or a stack of cards.

Corrections made before closing:

- lowered the active explanation into the reference position;
- reduced its display width and body scale;
- moved stage labels above their doors;
- restored the missing red route segment;
- hid the global header red signal after Hero so the section keeps one active
  red signal.

Functional verification:

- Next moved the active projection from 03 Procedure to 04 Court Decision;
- Previous returned it to 03;
- active number, heading and body updated together;
- browser console warnings/errors: none.

## 06A — Legal Clarity

Status: **gate closed**.

Reference:

- legal field from `design/concepts-v2/06-legal-price-poster.png`
- mobile uses the approved vertical translation of the same index/question/
  marginal-answer system

Browser screenshots:

- desktop 1586×992:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/legal-desktop-pass-01.png`
- mobile top 390×844:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/legal-mobile-pass-01.png`
- mobile answer 390×844:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/legal-mobile-bottom-final.png`

Comparison:

- the left question index, oversized active question and black answer margin
  preserve the V2 legal composition;
- one red point identifies the active question;
- the answer remains concise, neutral and visually subordinate;
- the legal caveat is permanently present;
- mobile converts the index into a compact two-column list above the active
  question and answer instead of an accordion or cards.

Corrections made before closing:

- split the original combined concept into an independent full Legal viewport;
- made the content editable in `src/content/legal.ts`;
- added a mobile-aware header theme at the dark answer margin;
- kept wording generic because the governing legislation is actively amended.

Functional verification:

- clicked question 02 and confirmed both the H2 and answer changed;
- restored question 04 as the reference state;
- horizontal overflow at 390px: `0`;
- browser console warnings/errors: none.

Intentional production deviation:

- the persistent production header occupies the top rail; the generated V2
  poster uses its own small wordmark.

## 06B — Price

Status: **gate closed**.

Reference:

- price colophon from `design/concepts-v2/06-legal-price-poster.png`
- the separate full viewport is the approved production clarification

Browser screenshots:

- desktop 1586×992:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/price-desktop-final.png`
- mobile top 390×844:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/price-mobile-final.png`
- mobile colophon 390×844:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/price-mobile-bottom-final.png`

Comparison:

- the exact price statement is the dominant typographic object;
- service scope, price explanation and edition data remain colophon lines,
  never a pricing card;
- CTA is an editorial route with a rule and arrow;
- mobile preserves `300 000 ₽` as one unbroken amount.

Corrections made before closing:

- isolated Price in its own full viewport;
- removed an incorrectly positioned underline crossing the colophon;
- separated the mobile prefix from the non-breaking amount.

Verification:

- at the `#price` anchor the Legal section ends at viewport coordinate `0`
  and no legal question is visible;
- Price occupies exactly `992px` at the `1586×992` gate;
- CTA resolves to `#diagnostic`;
- horizontal overflow: `0`;
- browser console warnings/errors: none.

## 07 — Media

Status: **gate closed**.

Reference:

- desktop: `design/concepts-v2/07-media-poster.png`
- mobile: vertical crop of the same studio poster followed by one continuous
  film strip

Browser screenshots:

- desktop 1586×992:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/media-desktop-pass-01.png`
- mobile top 390×844:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/media-mobile-final.png`
- mobile actions/contact strip 390×844:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/media-mobile-bottom-final.png`
- teaser modal:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/media-modal-desktop.png`

Comparison:

- empty chair remains the physical centre of the poster;
- `ПОСЛЕДНИЙ ПЛАТЁЖ` is projected HTML typography and sits behind a
  foreground chair occlusion;
- the right-side materials remain a film contact strip, not blog cards;
- play uses the Zero ring as a functional symbol and carries the sole red
  signal;
- mobile retains the full cinematic scene before the contact strip instead of
  becoming a generic image/text stack.

Corrections made before closing:

- reduced the mobile projection so `ПОСЛЕДНИЙ` no longer clips at 390px;
- preserved the three editorial titles as code over one film-strip asset;
- implemented an actual teaser modal rather than a dead play control.

Functional verification:

- trailer control opened the native dialog;
- empty submission exposed both email and consent validation;
- a valid test address reached `POST /api/leads` and returned the success
  state through the development adapter;
- close control dismissed the dialog;
- horizontal overflow at 390px: `0`;
- browser console warnings/errors: none.

Production integration note:

- production submission intentionally returns `503` until both the operator
  details and `LEADS_WEBHOOK_URL` are configured; local development stores
  only the bounded in-memory QA record.

## 08 — Manifesto / Credits

Status: **gate closed**.

Reference:

- wide desktop: `design/concepts-v2/08-manifesto-credits-poster.png`
- mobile: a deliberately vertical poster using the same registration axis,
  launch colophon and responsibility credits

Browser screenshots:

- wide desktop 1586×992:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/manifesto-wide-final.png`
- laptop 1024×900:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/manifesto-laptop-final.png`
- mobile top 390×844:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/manifesto-mobile-final.png`
- mobile launch/credits 390×844:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/manifesto-mobile-bottom-final.png`

Comparison:

- the two-line wide headline remains the dominant architecture;
- the central registration axis, four principles, launch colophon and
  responsibility credits preserve the accepted poster;
- the four principles remain one continuous row on wide desktop;
- launch mode does not fabricate people, reviews, cases or metrics;
- the single red registration mark follows the V2 position and role.

Responsive verification:

- `>=1200px`: the heading is exactly two explicit rows and the section equals
  the 992px browser viewport;
- `1024px`: the heading stays at two rows; the long manifesto sentence balances
  over two lines instead of leaving a one-word orphan;
- `390px`: the first row is deliberately re-directed into `Мы не / продаём`,
  followed by `чудо.`; launch mode and roles become vertical credits;
- heading scroll width equals client width on wide desktop;
- horizontal overflow: `0`.

Corrections made before closing:

- moved the launch-mode label below the persistent header;
- removed the one-word laptop orphan in the manifesto statement;
- widened the final principle column so the complete principle remains on one
  wide-desktop line;
- inset mobile statuses from the registration axis;
- removed the duplicate `#about` anchor from Brand Turn so navigation reaches
  this section deterministically.

Verification:

- browser console warnings/errors: none;
- `lint` and `typecheck`: passed after implementation.

## 09 — Final Threshold / Footer

Status: **gate closed**.

Reference:

- desktop: `design/concepts-v2/09-final-threshold-poster.png`
- mobile: approved portrait threshold asset with the footer rendered as one
  archival sequence

Browser screenshots:

- desktop 1586×992:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/final-desktop-final.png`
- mobile 390×844:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/final-mobile-final.png`
- mobile footer at document end:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/footer-mobile-final.png`

Comparison:

- the cave opening itself is the Zero portal; no extra torus was added;
- the wide headline is restored to the reference two-line composition;
- body, two editorial routes, legal note and red threshold retain the V2
  coordinates;
- the person remains small and the landscape remains calm;
- the footer overlays the lower dark field as one archival line rather than a
  separate corporate footer block.

Corrections made before closing:

- widened and reduced the heading until it returned to two desktop lines;
- raised contrast and size of the consultation note;
- fixed hash-load header timing so the Hero-only red header signal cannot
  reappear beside the final red threshold;
- mobile switches to the dedicated portrait production asset;
- mobile footer reflows into two semantic archival rows without cards.

Verification:

- header signal computed opacity at the final anchor: `0`;
- primary action resolves to `#diagnostic`;
- Telegram action resolves to the configured fallback
  `/contacts?channel=telegram`;
- final mobile height: `900px`; footer height: `186px`;
- horizontal overflow at 390px: `0`;
- browser console warnings/errors: none.

Open content dependency:

- a real Telegram URL is intentionally absent because none was supplied; the
  central config keeps it `null` and routes to Contacts until configured.

## Production acceptance

Status: **build and local production QA passed**.

Production browser screenshots:

- desktop Hero:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/production-hero-desktop.png`
- desktop Diagnostic:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/production-diagnostic-desktop.png`
- mobile Hero/fallback:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/production-hero-mobile.png`
- desktop Hero/live WebGL:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/production-hero-webgl-desktop.png`
- laptop Manifesto:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/production-manifesto-laptop.png`
- mobile Manifesto:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/production-manifesto-mobile.png`
- desktop Final:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/production-final-desktop.png`
- mobile Final:
  `/Users/vladshuma/.codex/visualizations/2026/07/29/019fad9a-ca08-77c2-a695-c7295d03a1a0/production-final-mobile.png`

Automated verification:

- `pnpm lint`: passed;
- `pnpm typecheck`: passed;
- `pnpm build`: passed, 16 static pages generated and `/api/leads` retained as
  a dynamic route;
- Playwright against `next start`: 9 applicable tests passed, 5
  viewport-inapplicable cases skipped by design, 0 failed;
- covered approved section order, Diagnostic/Legal/Media interactions,
  required routes, branded 404, invalid lead validation, mobile menu,
  live desktop WebGL portal, reduced-motion/mobile portal fallback and zero
  horizontal overflow.

Runtime verification:

- `/`, `/sitemap.xml` and `/robots.txt`: HTTP 200;
- `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy` and `Cross-Origin-Opener-Policy`: present;
- invalid lead payload: HTTP 422;
- valid lead with intentionally absent production operator details: HTTP 503;
- production browser console warnings/errors on captured gates: none;
- Next.js development overlay: absent.

Zero Portal production layering:

- the prerender remains the light environment, horizon, haze and surface
  reflection;
- the live WebGL canvas is a low-opacity screen-blended particle layer, so it
  adds slow motion and minimal pointer response without replacing the V2
  composition with an obvious geometric torus;
- desktop/no-preference exposes a visible canvas; reduced-motion and mobile
  omit it and retain the approved prerender.

Launch dependencies:

- configure real operator details in `NEXT_PUBLIC_COMPANY_*`;
- configure `LEADS_WEBHOOK_URL` and, if required,
  `LEADS_WEBHOOK_TOKEN`;
- configure the real Telegram URL;
- perform legal review of editable content in `src/content/legal.ts` and the
  policy pages before public data collection.
