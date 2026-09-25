// Product measurement only: never send question text, reading text, or card names.
(() => {
    'use strict';
    const VERSION = 'single_card_v1';
    const questions = ['daily_intention', 'relationship', 'right_track'];
    const pageNames = { '/': 'reading', '/index.html': 'reading',
        '/pages/gallery.html': 'gallery', '/pages/dictionary.html': 'dictionary',
        '/pages/journey.html': 'journey' };
    const page = pageNames[location.pathname] || 'other';
    let attempt = null;
    let sequence = 0;
    let completed = 0;
    let question = questions[0];
    let explicitQuestion = false;
    let observer;
    let visible = false;
    let viewed = false;

    function emit(name, params = {}) {
        // A blocked/throwing analytics provider must never interrupt the reading.
        try {
            if (typeof window.gtag !== 'function') return;
            window.gtag('event', name, {
                analytics_schema: '1', experience_version: VERSION,
                reading_type: 'single_card', page_type: page,
                ui_language: typeof currentLanguage === 'string' ? currentLanguage : 'unknown',
                ...(attempt ? { reading_id: attempt.id, reading_number: sequence,
                    deck_id: attempt.deck, question_id: attempt.question,
                    question_selection: attempt.explicit ? 'explicit' : 'default',
                    flow_step: attempt.step } : {}),
                ...params
            });
        } catch (_) { /* Measurement is best effort. */ }
    }

    function stopObserving() {
        if (observer) observer.disconnect();
        observer = null;
        visible = false;
    }

    function recordView() {
        if (attempt && attempt.complete && visible && !document.hidden && !viewed) {
            viewed = true;
            emit('reading_viewed');
        }
    }

    const api = {
        question(index, direction) {
            question = questions[index] || 'unknown';
            explicitQuestion = true;
            if (attempt && !attempt.complete) {
                attempt.question = question;
                attempt.explicit = true;
            }
            emit('question_selected', { question_id: question, question_selection: 'explicit', selection_direction: direction });
        },
        start(deck) {
            if (attempt && !attempt.complete) emit('reading_restarted');
            stopObserving();
            sequence += 1;
            viewed = false;
            attempt = { id: window.crypto?.randomUUID?.() || `${Date.now()}-${sequence}-${Math.random().toString(36).slice(2)}`,
                deck: deck === 'rider' ? 'rider-waite' : deck, question,
                explicit: explicitQuestion, step: 'deck_selected', started: performance.now(), complete: false };
            emit('reading_started', { is_repeat: completed > 0 ? 'yes' : 'no' });
        },
        step(step) {
            if (!attempt || attempt.complete || attempt.step === step) return;
            attempt.step = step;
            emit(step === 'cards_ready' ? 'cards_ready' : 'card_selected');
        },
        complete(element, hasReading, reversed) {
            if (!attempt) return;
            if (!hasReading) { api.error('reading_missing'); return; }
            if (!attempt.complete) {
                attempt.complete = true;
                attempt.step = 'completed';
                completed += 1;
                emit('reading_completed', { orientation: reversed ? 'reversed' : 'upright',
                    completion_ms: Math.round(performance.now() - attempt.started) });
            }
            // Re-rendering for a language change must not duplicate completion/view events.
            stopObserving();
            if (!viewed && element && window.IntersectionObserver) {
                observer = new IntersectionObserver(entries => {
                    visible = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.1);
                    recordView();
                }, { threshold: 0.1 });
                observer.observe(element);
            }
        },
        reset(action) {
            emit('reading_reset', { action, after_completion: attempt?.complete ? 'yes' : 'no' });
            stopObserving();
            attempt = null;
        },
        language() { emit('language_selected'); },
        error(code) { emit('reading_error', { error_code: code }); },
        source(source) { emit('interpretation_loaded', { interpretation_source: source }); }
    };
    // Guard the whole public boundary, including observer and browser API failures.
    window.TarotAnalytics = Object.fromEntries(Object.entries(api).map(([name, fn]) =>
        [name, (...args) => { try { return fn(...args); } catch (_) { /* no UI impact */ } }]));

    document.addEventListener('DOMContentLoaded', () => {
        emit('experience_viewed');
        if (page === 'reading') emit('reading_flow_viewed', { question_id: question });
    });
    document.addEventListener('visibilitychange', recordView);
    document.addEventListener('click', event => {
        const link = event.target.closest?.('a[href]');
        if (!link) return;
        try {
            const url = new URL(link.href, location.href);
            const destination = url.origin === location.origin ? pageNames[url.pathname] : null;
            if (destination && destination !== page) {
                emit('content_navigation', { destination, after_completion: completed > 0 ? 'yes' : 'no' });
            }
        } catch (_) { /* Ignore non-URL links. */ }
    });
    window.addEventListener('pagehide', event => {
        if (attempt) emit('reading_page_exit', { completed: attempt.complete ? 'yes' : 'no',
            elapsed_ms: Math.round(performance.now() - attempt.started),
            bfcache: event.persisted ? 'yes' : 'no' });
    });
})();
