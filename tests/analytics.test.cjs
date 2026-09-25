const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../assets/js/analytics.js'), 'utf8');
function setup({ provider = true, observer = true } = {}) {
    const events = [], listeners = {};
    let intersect;
    const document = { hidden: false, addEventListener: (name, fn) => { listeners[name] = fn; } };
    const window = { addEventListener: document.addEventListener,
        ...(provider ? { gtag: (...args) => events.push(args) } : {}),
        ...(observer ? { IntersectionObserver: class {
            constructor(fn) { intersect = fn; } observe() {} disconnect() {}
        } } : {}) };
    vm.runInNewContext(source, { window, document, location: { pathname: '/', origin: 'https://example.com', href: 'https://example.com/' },
        performance: { now: () => 100 }, Date, Math, URL, currentLanguage: 'en',
        IntersectionObserver: window.IntersectionObserver });
    return { api: window.TarotAnalytics, window, document, listeners, events,
        visible: () => intersect([{ isIntersecting: true, intersectionRatio: 0.5 }]),
        names: () => events.map(e => e[1]), params: name => events.filter(e => e[1] === name).map(e => e[2]) };
}
test('default question, ordered funnel, and exactly one completion/view per attempt', () => {
    const s = setup(); s.listeners.DOMContentLoaded(); s.api.start('rider');
    s.api.step('cards_ready'); s.api.step('cards_ready'); s.api.step('card_selected');
    s.api.complete({}, true, false); s.visible(); s.api.complete({}, true, false);
    assert.deepEqual(s.names(), ['experience_viewed', 'reading_flow_viewed', 'reading_started', 'cards_ready', 'card_selected', 'reading_completed', 'reading_viewed']);
    assert.equal(s.params('reading_started')[0].question_selection, 'default');
    assert.equal(s.params('reading_completed')[0].deck_id, 'rider-waite');
    assert.equal(s.params('reading_completed')[0].question_id, 'daily_intention');
    assert.equal(s.params('reading_started')[0].reading_id, s.params('reading_completed')[0].reading_id);
});
test('changed question, reset intent and actual repeat start are separate', () => {
    const s = setup(); s.api.question(1, 'next'); s.api.start('miro');
    s.api.question(2, 'next'); s.api.complete({}, true, true); s.api.reset('draw_another'); s.api.start('artistic');
    assert.equal(s.params('reading_completed')[0].question_id, 'right_track');
    assert.equal(s.params('reading_completed')[0].orientation, 'reversed');
    assert.equal(s.params('reading_reset')[0].after_completion, 'yes');
    const starts = s.params('reading_started');
    assert.equal(starts[1].is_repeat, 'yes'); assert.notEqual(starts[0].reading_id, starts[1].reading_id);
    assert.equal(starts[1].question_selection, 'explicit');
});
test('hidden tab and offscreen results do not count as viewed', () => {
    const s = setup(); s.api.start('rider'); s.api.complete({}, true, false);
    assert.equal(s.params('reading_viewed').length, 0);
    s.document.hidden = true; s.visible(); assert.equal(s.params('reading_viewed').length, 0);
    s.document.hidden = false; s.listeners.visibilitychange();
    assert.equal(s.params('reading_viewed').length, 1);
});
test('missing reading is an error, not completion', () => {
    const s = setup(); s.api.start('rider'); s.api.complete({}, false, false);
    assert.equal(s.params('reading_completed').length, 0);
    assert.equal(s.params('reading_error')[0].error_code, 'reading_missing');
});
test('provider blocked/throwing and IntersectionObserver unavailable never break flow', () => {
    const s = setup({ provider: false, observer: false });
    assert.doesNotThrow(() => { s.listeners.DOMContentLoaded(); s.api.start('rider'); s.api.complete({}, true, false); });
    s.window.gtag = () => { throw Error('blocked'); };
    assert.doesNotThrow(() => { s.api.reset('draw_another'); s.api.start('miro'); s.api.error('readings_load_failed'); });
});
test('exit records last reached stage, without declaring abandonment on tab hide', () => {
    const s = setup(); s.api.start('rider'); s.api.step('cards_ready');
    s.document.hidden = true; s.listeners.visibilitychange();
    assert.equal(s.params('reading_page_exit').length, 0);
    s.listeners.pagehide({ persisted: true });
    assert.equal(s.params('reading_page_exit')[0].flow_step, 'cards_ready');
    assert.equal(s.params('reading_page_exit')[0].completed, 'no');
    assert.equal(s.params('reading_page_exit')[0].bfcache, 'yes');
});
test('post-reading navigation uses allowlisted destinations and excludes URL queries', () => {
    const s = setup(); s.api.start('rider'); s.api.complete({}, true, false); s.api.reset('draw_another');
    s.listeners.click({ target: { closest: () => ({ href: 'https://example.com/pages/gallery.html?private=text' }) } });
    assert.equal(s.params('content_navigation')[0].destination, 'gallery');
    assert.equal(s.params('content_navigation')[0].after_completion, 'yes');
    assert.ok(!JSON.stringify(s.events).includes('private'));
});
