-- BigQuery Standard SQL. Replace YOUR_PROJECT.analytics_PROPERTY_ID.
-- Output one row per started attempt. Use a mature window and include an extra
-- day of events for attempts crossing midnight; end_date is inclusive.
DECLARE start_date DATE DEFAULT DATE '2026-10-01'; -- replace with deployment window
DECLARE end_date DATE DEFAULT DATE '2026-10-14';
WITH event_rows AS (
  SELECT event_name, event_timestamp, event_date, user_pseudo_id,
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS session_id,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'reading_id') AS reading_id,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'experience_version') AS version,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'question_id') AS question_id,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'deck_id') AS deck_id,
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'completion_ms') AS completion_ms
  FROM `YOUR_PROJECT.analytics_PROPERTY_ID.events_*`
  WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', start_date)
    AND FORMAT_DATE('%Y%m%d', DATE_ADD(end_date, INTERVAL 1 DAY))
), attempts AS (
  SELECT reading_id,
    ARRAY_AGG(IF(event_name = 'reading_started', STRUCT(
      user_pseudo_id, session_id, version, question_id, deck_id, event_date
    ), NULL) IGNORE NULLS ORDER BY event_timestamp LIMIT 1)[SAFE_OFFSET(0)] AS started,
    COUNTIF(event_name = 'cards_ready') > 0 AS cards_ready,
    COUNTIF(event_name = 'card_selected') > 0 AS card_selected,
    COUNTIF(event_name = 'reading_completed') > 0 AS completed,
    COUNTIF(event_name = 'reading_viewed') > 0 AS viewed,
    COUNTIF(event_name = 'reading_error') > 0 AS has_error,
    MAX(IF(event_name = 'reading_completed', completion_ms, NULL)) AS completion_ms,
    ARRAY_AGG(IF(event_name = 'reading_completed', question_id, NULL)
      IGNORE NULLS ORDER BY event_timestamp LIMIT 1)[SAFE_OFFSET(0)] AS completed_question
  FROM event_rows WHERE reading_id IS NOT NULL GROUP BY reading_id
)
SELECT * FROM attempts
WHERE started.event_date BETWEEN FORMAT_DATE('%Y%m%d', start_date) AND FORMAT_DATE('%Y%m%d', end_date)
  AND started.version = 'single_card_v1';
-- Save this result as a baseline_attempts table for a fixed snapshot.
-- Completion rate = COUNTIF(completed) / COUNT(*).
-- Stage loss = COUNTIF(cards_ready AND NOT card_selected) / COUNTIF(cards_ready), etc.
-- Median/p75 latency: APPROX_QUANTILES(completion_ms, 100)[OFFSET(50/75)]
-- (run each percentile separately, include completed attempts only).
-- Repeat-session rate: group by started.user_pseudo_id + started.session_id,
-- excluding null identities; sessions with COUNTIF(completed)>=2 divided by
-- sessions with COUNTIF(completed)>=1. Attribute to session at attempt start.
-- For preferences, compare started.question_id versus completed_question.
-- Site entry/cohort/traffic reports require native GA events beyond this table.
