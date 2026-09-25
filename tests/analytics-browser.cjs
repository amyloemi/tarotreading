// Run against a local server: node tests/analytics-browser.cjs http://127.0.0.1:8080
const puppeteer = require('puppeteer');
const assert = require('node:assert/strict');
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 390, height: 844 });
        const errors = [];
        page.on('pageerror', error => { errors.push(error.message); console.error('Page error:', error.message); });
        // Do not send synthetic QA traffic to production GA or translation services.
        await page.setRequestInterception(true);
        page.on('request', request => {
            if (new URL(request.url()).hostname !== '127.0.0.1') request.abort();
            else request.continue();
        });
        const base = process.argv[2] || 'http://127.0.0.1:8080';
        await page.goto(base, { waitUntil: 'networkidle0' });
        await page.waitForFunction(() => typeof TarotAnalytics !== 'undefined' && readingsData.rider);
        await page.click('#question-dots');
        await page.waitForFunction(() => currentQuestionIndex === 1);
        await page.click('[onclick="selectDeck(\'rider\')"]');
        await page.evaluate(() => selectDeck('rider'));
        await page.waitForFunction(() => canPickCard, { timeout: 30000 });
        // Cards overlap in the mobile fan; activate the real click listener directly.
        await page.$eval('.anim-card', card => card.click());
        await page.waitForSelector('#reading-box.show', { timeout: 30000 });
        await page.$eval('.reading-text', element => element.scrollIntoView());
        await page.waitForFunction(() => dataLayer.some(e => e[1] === 'reading_viewed'));
        let events = await page.evaluate(() => dataLayer.filter(e => e[0] === 'event').map(e => [e[1], e[2]]));
        for (const event of ['reading_flow_viewed', 'question_selected', 'reading_started', 'cards_ready', 'card_selected', 'reading_completed', 'reading_viewed']) {
            assert.equal(events.filter(e => e[0] === event).length, 1, event);
        }
        const finish = events.find(e => e[0] === 'reading_completed')[1];
        assert.equal(finish.question_id, 'relationship');
        assert.equal(finish.deck_id, 'rider-waite');
        assert.ok(finish.completion_ms > 0);
        // A translation-driven re-render must not create a second completion.
        await page.evaluate(() => updateUILanguage());
        await page.waitForSelector('#reading-box.show');
        await page.click('#reading-box button');
        await page.click('[onclick="selectDeck(\'miro\')"]');
        events = await page.evaluate(() => dataLayer.filter(e => e[0] === 'event').map(e => [e[1], e[2]]));
        assert.equal(events.filter(e => e[0] === 'reading_completed').length, 1);
        assert.equal(events.filter(e => e[0] === 'reading_started')[1][1].is_repeat, 'yes');
        assert.equal(events.find(e => e[0] === 'reading_reset')[1].action, 'draw_another');
        assert.deepEqual(errors, []);
        for (const name of ['gallery', 'dictionary', 'journey']) {
            await page.goto(`${base}/pages/${name}.html`, { waitUntil: 'domcontentloaded' });
            await page.waitForFunction(() => dataLayer.some(e => e[1] === 'experience_viewed'));
            assert.equal(await page.evaluate(() => dataLayer.find(e => e[1] === 'experience_viewed')[2].page_type), name);
        }
        console.log('PASS: mobile real reading flow, question, completion/view deduplication, repeat, and all content pages.');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
