# Product baseline: single-card reading v1

Status: instrumentation implemented locally; deployment, GA4 configuration, and collection are still required. No historical journey baseline can be reconstructed from page views alone. Do not label an uncollected value as zero.

## Measurement contract

Use the existing GA4 property `G-EXTBHDX0C2`. `analytics.js` adds custom events through the existing `gtag` queue; it does not configure another tracker or send extra `page_view` events. All four pages emit `experience_viewed`, tagged `experience_version=single_card_v1` and `analytics_schema=1`. Native page views capture arrival on any page; `reading_flow_viewed` means the reading page DOM is ready, not that a user selected anything.

Every attempt begins when a deck is selected. Each has a random, ephemeral `reading_id`, a page-local `reading_number`, and the current stable question/deck IDs. IDs do not identify a person. Repeat status means an earlier reading completed in this page lifetime; use GA4 sessions/user cohorts for cross-page and cross-visit repetition. There is no additional persistent visitor identifier. GA4's native new/returning and first_visit data supply visitor cohorts; cookie deletion, blocked analytics, and cross-device visits limit that classification.

| Event | Exact trigger / meaning |
| --- | --- |
| `experience_viewed` | DOM ready on reading, gallery, dictionary, or journey page |
| `reading_flow_viewed` | DOM ready on reading page, including default question ID |
| `question_selected` | Question changes through next/previous controls; not an impression or committed reading |
| `reading_started` | Deck selected; includes `is_repeat=yes/no`; default question is included even without a question click |
| `cards_ready` | Shuffle finishes and cards become selectable |
| `card_selected` | Card click is accepted, before reveal/interpretation work |
| `interpretation_loaded` | Lookup yields `pregenerated` or requires `template_fallback` |
| `reading_completed` | Nonempty interpretation is rendered and shown; once per attempt |
| `reading_viewed` | At least 10% of interpretation text intersects the viewport while the document is visible; once per attempt |
| `reading_reset` | Draw another / change deck action; includes `after_completion` and `action` |
| `reading_restarted` | Another start replaces an unfinished attempt |
| `language_selected` | Desktop/mobile language selection; updated `ui_language` |
| `content_navigation` | Internal link to another known content page, including destination and after-completion status |
| `reading_error` | Allowlisted failure: `readings_load_failed`, `card_image_failed`, `translation_failed`, `reading_missing` |
| `reading_page_exit` | Best-effort pagehide snapshot with last step, completion flag, elapsed time, and BFCache flag |

Completion means a result was produced, not that it was read or understood. `reading_viewed` is a visibility proxy, not reading time. Browsers without IntersectionObserver cannot report the view proxy. `completion_ms` is wall-clock time from deck selection (including animation, network wait, and background time). Orientation is random (currently 30% reversed), not a preference. Single-card format is currently the only format. Interpretations are pre-generated JSON, with a template fallback; this is not live AI usage.

Question IDs: `daily_intention`, `relationship`, `right_track`. Deck IDs: `rider-waite`, `artistic`, `miro`. `question_selection=default/explicit` distinguishes accepting the default from cycling questions. Question changes before completion update the attempt's question. For committed preferences, use the question on completion, and separately inspect starts to avoid survivor bias.

## GA4 setup before collecting the baseline

1. Deploy the changed site and service worker. Check a fresh browser and an existing PWA/cache client.
2. Verify events in Realtime and DebugView using Google Tag Assistant. The automated tests block Google requests and are not proof of production ingestion. Use a test property or a configured developer-traffic filter for QA; do not count synthetic journeys in the baseline.
3. Create event-scoped custom dimensions for `experience_version`, `analytics_schema`, `page_type`, `reading_type`, `deck_id`, `question_id`, `question_selection`, `is_repeat`, `ui_language`, `orientation`, `interpretation_source`, `flow_step`, `action`, `after_completion`, `destination`, `error_code`. Create custom metrics `completion_ms` and `elapsed_ms` with milliseconds as unit. Do not register high-cardinality `reading_id` as a report dimension; use it in BigQuery export for attempt joins. `reading_number` is available in exported parameters.
4. Mark `reading_completed` as a key event. Keep the same definition in future releases.
5. Build a closed funnel: `reading_flow_viewed → reading_started → cards_ready → card_selected → reading_completed → reading_viewed`. GA4 funnel explorations describe users, so do not interpret their counts as attempts. Build a separate site-arrival exploration (`page_view → reading_flow_viewed`) to include visitors arriving on content pages. Break down by device, traffic source, native new/returning classification, and experience version.
6. Build preference tables from `reading_started` and `reading_completed` by question/deck/default selection/language. Build continuation tables from `reading_reset`, actual repeat starts, and `content_navigation` with `after_completion=yes`.
7. Enable BigQuery export if exact attempt-level conversion, repeat-session rates, or latency percentiles are needed. The companion `baseline-attempts.sql` supplies an attempt-level table and aggregation definitions; replace the dataset placeholder. Native GA4 user/session identity is needed for session/user metrics. Export is not retroactive.

References: [GA4 custom events](https://developers.google.com/analytics/devguides/collection/ga4/events), [event parameters and custom definitions](https://developers.google.com/analytics/devguides/collection/ga4/event-parameters), [custom dimension setup](https://support.google.com/analytics/answer/14239696).

## Baseline scorecard

Record the release/deployment date, date range, timezone, GA4 filters, sample sizes, device and traffic-source mix alongside every snapshot. Collect at least two complete weeks with no reading-flow feature changes, preferably four if traffic is low. Freeze the initial report only after QA confirms ingestion. Extend the window when uncertainty is too high; calendar time alone does not establish confidence.

| Question | Metric and denominator |
| --- | --- |
| Do arrivals reach the reading flow? | Sessions with `reading_flow_viewed` / all site sessions |
| Do users begin? | Sessions with `reading_started` / sessions with `reading_flow_viewed` |
| Where do attempts stop? | Unique started reading IDs lacking each next stage / unique IDs reaching the preceding stage |
| Does a reading finish? | Unique completed reading IDs / unique started reading IDs |
| Is the result seen? | Unique viewed reading IDs / unique completed reading IDs (note observer support) |
| Which choices win? | Share of starts and completions by question/deck; distinguish default acceptance from explicit selection |
| Do users repeat? | Completed sessions with at least two completed IDs / sessions with at least one completed ID; separately report reset intent and repeat starts |
| Do users explore afterward? | Sessions with post-completion content navigation / sessions with a completion |
| Is the flow still simple? | Median/p75 completion_ms, start and completion rates, step loss, error-bearing attempts / started attempts |
| Does behavior differ by visitor type? | All rates above by GA4 native new/returning cohort, then by device/source |
| Do users return? | 7-day returning cohort retention among users completing a reading; only use cohorts old enough for the full window |

Compute drop-off from missing downstream events after the reporting window matures (allow at least 24 hours beyond its end and accommodate export processing delay). Do not count pagehide as certain abandonment: mobile shutdown may omit it, BFCache can restore a page, and a navigation may be temporary. Avoid naive ratios of all event counts: translation can re-render a result, a user can reset without starting, and one session can have several attempts. Repeated error events are not distinct failed attempts. Errors before any attempt are a separate page-level reliability measure.

Suggested snapshot columns: metric, cohort, numerator, denominator, value, interval/uncertainty, start date, end date, experience version, notes. Initial values are **pending collection**. No dashboard/property/export access was available during implementation; the steps above remain external setup work.

## Future feature comparisons

Keep stage definitions and stable question IDs. Change `VERSION` in analytics.js for any product release that changes the experience; changes solely to instrumentation should instead increment the schema and be annotated. The existing baseline tag alone is not experiment assignment.

For a future randomized rollout, implement persistent assignment in that feature's rollout, then attach allowlisted `experiment_id` and `variant_id` to every event and record exposure when the feature is actually offered. Do not claim a pre/post comparison is causal; traffic mix, weekdays and seasonality can change. Compare matched device/source/new-returning cohorts when randomization is unavailable.

Before launch, record hypothesis, primary metric, guardrails, smallest useful effect, allocation and stopping rule. Suggested primary metric: completed readings per exposed session. Simplicity guardrails: landing-to-start rate, attempt completion rate, p75 completion time, and error rate. Agree tolerances from the measured baseline before testing; more repeat clicks alone is not success if fewer people finish.

Three-card readings should carry `reading_type=three_card` and preserve completion as the whole interpretation being available. Additional predefined questions receive stable IDs; custom questions carry `question_id=custom`, never their text. Reading-history and live-AI releases need their own exposure/use/success/error events and comparison cohorts. Never send custom prompts, interpretation text, email, or saved reading content to analytics. Existing provider consent/disable behavior remains authoritative; the helper only uses gtag and does not add another transport or bypass a blocked provider.

## Verification

From the workspace root:

```sh
node --test github-deploy/tests/analytics.test.cjs
python3 -m http.server 8080 --bind 127.0.0.1 --directory github-deploy
# In another terminal (requires the root Puppeteer dependency):
node github-deploy/tests/analytics-browser.cjs
```

The browser test uses a mobile viewport, an actual shuffled reading, and local data; blocks external requests; checks completion deduplication, repeat intent/start, and all content pages. Unit tests cover hidden results, missing interpretations, blocked providers, exit semantics, and safe navigation parameters. Neither sends test events to GA4.
