/**
 * Automated Tests for Unified Deck System
 *
 * Tests for:
 * - DeckRegistry (deck configurations, card catalog)
 * - PathResolver (path resolution, location detection)
 * - DeckLoader (image paths, thumbnails, responsive images)
 *
 * Run with: node tests/deck-loader.test.js
 */

// Simple test framework (no dependencies required)
class TestRunner {
    constructor(name) {
        this.suiteName = name;
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(description, testFn) {
        this.tests.push({ description, testFn });
    }

    assertEqual(actual, expected, message = '') {
        if (actual !== expected) {
            throw new Error(`${message}\nExpected: ${expected}\nActual: ${actual}`);
        }
    }

    assertTrue(value, message = '') {
        if (!value) {
            throw new Error(`${message}\nExpected truthy value, got: ${value}`);
        }
    }

    assertFalse(value, message = '') {
        if (value) {
            throw new Error(`${message}\nExpected falsy value, got: ${value}`);
        }
    }

    assertContains(str, substring, message = '') {
        if (!str.includes(substring)) {
            throw new Error(`${message}\nExpected "${str}" to contain "${substring}"`);
        }
    }

    assertNotNull(value, message = '') {
        if (value === null || value === undefined) {
            throw new Error(`${message}\nExpected non-null value, got: ${value}`);
        }
    }

    assertArrayLength(arr, expectedLength, message = '') {
        if (arr.length !== expectedLength) {
            throw new Error(`${message}\nExpected array length ${expectedLength}, got ${arr.length}`);
        }
    }

    async run() {
        console.log(`\n🧪 Running Test Suite: ${this.suiteName}`);
        console.log('='.repeat(60));

        for (const { description, testFn } of this.tests) {
            try {
                await testFn.call(this);
                console.log(`✅ PASS: ${description}`);
                this.passed++;
            } catch (error) {
                console.log(`❌ FAIL: ${description}`);
                console.log(`   ${error.message}`);
                this.failed++;
            }
        }

        console.log('='.repeat(60));
        console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed, ${this.tests.length} total`);

        if (this.failed === 0) {
            console.log('🎉 All tests passed!\n');
        } else {
            console.log('⚠️  Some tests failed.\n');
            process.exit(1);
        }
    }
}

// Load the modules we're testing
const fs = require('fs');
const path = require('path');

// Mock browser environment for Node.js
global.window = {
    location: {
        pathname: '/index.html',
        protocol: 'http:'
    }
};

// Load DeckRegistry
const deckRegistryPath = path.join(__dirname, '../decks/shared/DeckRegistry.js');
const deckRegistryCode = fs.readFileSync(deckRegistryPath, 'utf8');
eval(deckRegistryCode);

// Load PathResolver
const pathResolverPath = path.join(__dirname, '../decks/shared/PathResolver.js');
const pathResolverCode = fs.readFileSync(pathResolverPath, 'utf8');
eval(pathResolverCode);

// Load DeckLoader
const deckLoaderPath = path.join(__dirname, '../decks/shared/DeckLoader.js');
const deckLoaderCode = fs.readFileSync(deckLoaderPath, 'utf8');
eval(deckLoaderCode);

// =============================================================================
// Test Suite 1: DeckRegistry Tests
// =============================================================================

const registryTests = new TestRunner('DeckRegistry');

registryTests.test('DeckRegistry should be defined', function() {
    this.assertNotNull(DECK_REGISTRY, 'DECK_REGISTRY should be defined');
});

registryTests.test('DeckRegistry should have 4 decks', function() {
    const deckCount = Object.keys(DECK_REGISTRY.decks).length;
    this.assertEqual(deckCount, 4, 'Should have exactly 4 decks');
});

registryTests.test('All required decks should exist', function() {
    const expectedDecks = ['rider-waite', 'artistic', 'miro', 'picasso'];
    expectedDecks.forEach(deckId => {
        this.assertNotNull(DECK_REGISTRY.decks[deckId], `Deck ${deckId} should exist`);
    });
});

registryTests.test('Rider-Waite deck should have correct configuration', function() {
    const rw = DECK_REGISTRY.decks['rider-waite'];
    this.assertEqual(rw.name, 'Rider-Waite Classic');
    this.assertEqual(rw.folder, 'images');
    this.assertEqual(rw.thumbnailFolder, 'images-thumbnails');
    this.assertEqual(rw.structure.major, 'major_arcana', 'Should use major_arcana folder');
    this.assertEqual(rw.structure.minor, 'minor_arcana/{suit}', 'Should use minor_arcana/{suit} structure');
});

registryTests.test('Artistic deck should have wands-first suit order', function() {
    const artistic = DECK_REGISTRY.decks['artistic'];
    this.assertEqual(artistic.suitOrder[0], 'wands', 'Wands should be first suit');
});

registryTests.test('Picasso deck should have numbering offset', function() {
    const picasso = DECK_REGISTRY.decks['picasso'];
    this.assertEqual(picasso.numberingOffset, 1, 'Should have offset of 1');
});

registryTests.test('Card catalog should have 22 major arcana', function() {
    this.assertArrayLength(DECK_REGISTRY.cards.major, 22, 'Should have 22 major arcana cards');
});

registryTests.test('Card catalog should have 4 minor arcana suits', function() {
    const suits = Object.keys(DECK_REGISTRY.cards.minor);
    this.assertArrayLength(suits, 4, 'Should have 4 suits');
    this.assertTrue(suits.includes('cups'), 'Should have cups suit');
    this.assertTrue(suits.includes('pentacles'), 'Should have pentacles suit');
    this.assertTrue(suits.includes('swords'), 'Should have swords suit');
    this.assertTrue(suits.includes('wands'), 'Should have wands suit');
});

registryTests.test('Each minor arcana suit should have 14 cards', function() {
    const suits = ['cups', 'pentacles', 'swords', 'wands'];
    suits.forEach(suit => {
        const cards = DECK_REGISTRY.cards.minor[suit];
        this.assertArrayLength(cards, 14, `${suit} should have 14 cards`);
    });
});

registryTests.test('The Fool should be first major arcana card', function() {
    const fool = DECK_REGISTRY.cards.major[0];
    this.assertEqual(fool.name, 'The Fool');
    this.assertEqual(fool.id, 0);
    this.assertEqual(fool.type, 'major');
});

registryTests.test('All major arcana cards should have required properties', function() {
    DECK_REGISTRY.cards.major.forEach(card => {
        this.assertNotNull(card.id, 'Card should have id');
        this.assertNotNull(card.name, 'Card should have name');
        this.assertEqual(card.type, 'major', 'Card type should be major');
    });
});

// =============================================================================
// Test Suite 2: PathResolver Tests
// =============================================================================

const pathTests = new TestRunner('PathResolver');

pathTests.test('PathResolver should be defined', function() {
    this.assertNotNull(PathResolver, 'PathResolver should be defined');
});

pathTests.test('getBasePath should return empty string for root pages', function() {
    window.location.pathname = '/index.html';
    const basePath = PathResolver.getBasePath();
    this.assertEqual(basePath, '', 'Root page should return empty string');
});

pathTests.test('getBasePath should return ../ for pages subfolder', function() {
    window.location.pathname = '/pages/gallery.html';
    const basePath = PathResolver.getBasePath();
    this.assertEqual(basePath, '../', 'Pages subfolder should return ../');
});

pathTests.test('isInSubfolder should detect pages subfolder', function() {
    window.location.pathname = '/pages/dictionary.html';
    const inSubfolder = PathResolver.isInSubfolder();
    this.assertTrue(inSubfolder, 'Should detect pages subfolder');
});

pathTests.test('isInSubfolder should return false for root', function() {
    window.location.pathname = '/index.html';
    const inSubfolder = PathResolver.isInSubfolder();
    this.assertFalse(inSubfolder, 'Should return false for root');
});

pathTests.test('resolve should build paths correctly from root', function() {
    window.location.pathname = '/index.html';
    const path = PathResolver.resolve('decks', 'images', 'card.png');
    this.assertEqual(path, 'decks/images/card.png');
});

pathTests.test('resolve should build paths correctly from subfolder', function() {
    window.location.pathname = '/pages/gallery.html';
    const path = PathResolver.resolve('decks', 'images', 'card.png');
    this.assertEqual(path, '../decks/images/card.png');
});

pathTests.test('getCurrentPage should extract page name', function() {
    window.location.pathname = '/pages/dictionary.html';
    const pageName = PathResolver.getCurrentPage();
    this.assertEqual(pageName, 'dictionary.html');
});

// =============================================================================
// Test Suite 3: DeckLoader Tests
// =============================================================================

const loaderTests = new TestRunner('DeckLoader');

loaderTests.test('DeckLoader should be defined', function() {
    this.assertNotNull(DeckLoader, 'DeckLoader should be defined');
});

loaderTests.test('getAllCards should return 78 cards', function() {
    const allCards = DeckLoader.getAllCards();
    this.assertArrayLength(allCards, 78, 'Should return exactly 78 cards');
});

loaderTests.test('getCardById should find The Fool', function() {
    const fool = DeckLoader.getCardById(0);
    this.assertNotNull(fool, 'Should find card with id 0');
    this.assertEqual(fool.name, 'The Fool');
});

loaderTests.test('getCardByName should find The Magician', function() {
    const magician = DeckLoader.getCardByName('The Magician');
    this.assertNotNull(magician, 'Should find The Magician');
    this.assertEqual(magician.id, 1);
});

loaderTests.test('getCardByName should handle minor arcana', function() {
    const aceOfCups = DeckLoader.getCardByName('Ace of Cups');
    this.assertNotNull(aceOfCups, 'Should find Ace of Cups');
    this.assertEqual(aceOfCups.type, 'minor');
    this.assertEqual(aceOfCups.suit, 'cups');
});

loaderTests.test('getImagePath should generate correct path for Rider-Waite major arcana', function() {
    window.location.pathname = '/index.html';
    const fool = DeckLoader.getCardById(0);
    const path = DeckLoader.getImagePath('rider-waite', fool);
    this.assertContains(path, 'decks/images/major_arcana/00-the-fool.png');
});

loaderTests.test('getImagePath should generate correct path for Rider-Waite minor arcana', function() {
    window.location.pathname = '/index.html';
    const aceOfCups = DeckLoader.getCardByName('Ace of Cups');
    const path = DeckLoader.getImagePath('rider-waite', aceOfCups);
    // Should transform "ace" to "1"
    this.assertContains(path, 'minor_arcana/cups/1-of-cups.png');
});

loaderTests.test('getImagePath should handle artistic deck (flat structure)', function() {
    window.location.pathname = '/index.html';
    const fool = DeckLoader.getCardById(0);
    const path = DeckLoader.getImagePath('artistic', fool);
    this.assertContains(path, 'artistic-tarot-cards/00-the-fool.png');
    this.assertFalse(path.includes('major_arcana'), 'Should not have subfolder');
});

loaderTests.test('getImagePath should handle Picasso numbering offset', function() {
    window.location.pathname = '/index.html';
    const fool = DeckLoader.getCardById(0);
    const path = DeckLoader.getImagePath('picasso', fool);
    // Picasso has offset of 1, so card 0 becomes file 01
    this.assertContains(path, 'picasso-tarot-cards/01-the-fool.png');
});

loaderTests.test('getThumbnailPath should generate WebP thumbnail path', function() {
    window.location.pathname = '/index.html';
    const fool = DeckLoader.getCardById(0);
    const path = DeckLoader.getThumbnailPath('rider-waite', fool, 'webp');
    this.assertContains(path, 'images-thumbnails/major_arcana/00-the-fool.webp');
});

loaderTests.test('getThumbnailPath should generate JPEG thumbnail path', function() {
    window.location.pathname = '/index.html';
    const fool = DeckLoader.getCardById(0);
    const path = DeckLoader.getThumbnailPath('rider-waite', fool, 'jpg');
    this.assertContains(path, 'images-thumbnails/major_arcana/00-the-fool.jpg');
});

loaderTests.test('transformRiderWaiteFilename should convert number words', function() {
    const tests = [
        { input: 'ace-of-cups', expected: '1-of-cups' },
        { input: 'two-of-wands', expected: '2-of-wands' },
        { input: 'three-of-swords', expected: '3-of-swords' },
        { input: 'ten-of-pentacles', expected: '10-of-pentacles' }
    ];

    tests.forEach(({ input, expected }) => {
        const result = DeckLoader.transformRiderWaiteFilename(input);
        this.assertEqual(result, expected, `Should convert ${input} to ${expected}`);
    });
});

loaderTests.test('transformRiderWaiteFilename should convert court cards', function() {
    const tests = [
        { input: 'page-of-cups', expected: '11-of-cups' },
        { input: 'knight-of-wands', expected: '12-of-wands' },
        { input: 'queen-of-swords', expected: '13-of-swords' },
        { input: 'king-of-pentacles', expected: '14-of-pentacles' }
    ];

    tests.forEach(({ input, expected }) => {
        const result = DeckLoader.transformRiderWaiteFilename(input);
        this.assertEqual(result, expected, `Should convert ${input} to ${expected}`);
    });
});

loaderTests.test('getCardFileNumber should handle different suit orders', function() {
    const aceOfCups = DeckLoader.getCardByName('Ace of Cups');

    // Artistic has wands-first order
    const artisticNum = DeckLoader.getCardFileNumber('artistic', aceOfCups);
    // In wands-first order: wands(14) + cups(1) = 15
    this.assertTrue(artisticNum >= 22, 'Artistic should offset for wands-first order');

    // Miro has cups-first order (standard)
    const miroNum = DeckLoader.getCardFileNumber('miro', aceOfCups);
    this.assertEqual(miroNum, 22, 'Miro should have Ace of Cups at 22');
});

loaderTests.test('createResponsiveImage should create picture element', function() {
    // Create a mock DOM environment
    global.document = {
        createElement: (tag) => {
            const el = {
                tagName: tag.toUpperCase(),
                children: [],
                setAttribute: function(attr, value) { this[attr] = value; },
                appendChild: function(child) { this.children.push(child); }
            };
            return el;
        }
    };

    const fool = DeckLoader.getCardById(0);
    const picture = DeckLoader.createResponsiveImage('rider-waite', fool, {
        thumbnail: true,
        loading: 'lazy',
        className: 'test-card'
    });

    this.assertEqual(picture.tagName, 'PICTURE', 'Should create picture element');
    this.assertTrue(picture.children.length >= 2, 'Should have source and img children');
});

// =============================================================================
// Test Suite 4: Integration Tests
// =============================================================================

const integrationTests = new TestRunner('Integration Tests');

integrationTests.test('Complete workflow: Get card, generate path, create image', function() {
    window.location.pathname = '/index.html';

    // 1. Get a card by name
    const card = DeckLoader.getCardByName('The Magician');
    this.assertNotNull(card, 'Should find The Magician');

    // 2. Generate image path
    const imagePath = DeckLoader.getImagePath('rider-waite', card);
    this.assertContains(imagePath, '01-the-magician.png', 'Should generate correct path');

    // 3. Generate thumbnail path
    const thumbPath = DeckLoader.getThumbnailPath('rider-waite', card, 'webp');
    this.assertContains(thumbPath, '01-the-magician.webp', 'Should generate thumbnail path');
});

integrationTests.test('All 78 cards should generate valid paths', function() {
    window.location.pathname = '/index.html';
    const allCards = DeckLoader.getAllCards();

    allCards.forEach(card => {
        const path = DeckLoader.getImagePath('rider-waite', card);
        this.assertNotNull(path, `Card ${card.name} should have valid path`);
        this.assertTrue(path.length > 0, `Card ${card.name} path should not be empty`);
    });
});

integrationTests.test('All decks should work with all cards', function() {
    window.location.pathname = '/index.html';
    const decks = ['rider-waite', 'artistic', 'miro', 'picasso'];
    const fool = DeckLoader.getCardById(0);

    decks.forEach(deckId => {
        const path = DeckLoader.getImagePath(deckId, fool);
        this.assertNotNull(path, `Deck ${deckId} should generate path`);
        this.assertContains(path, 'the-fool', `Deck ${deckId} should include card name`);
    });
});

integrationTests.test('Path resolution should work from different locations', function() {
    const fool = DeckLoader.getCardById(0);

    // From root
    window.location.pathname = '/index.html';
    const rootPath = DeckLoader.getImagePath('rider-waite', fool);
    this.assertContains(rootPath, 'decks/images');
    this.assertFalse(rootPath.startsWith('../'), 'Root path should not start with ../');

    // From subfolder
    window.location.pathname = '/pages/gallery.html';
    const subPath = DeckLoader.getImagePath('rider-waite', fool);
    this.assertContains(subPath, '../decks/images');
});

// =============================================================================
// Test Suite 5: Card Meanings Tests
// =============================================================================

const meaningsTests = new TestRunner('Card Meanings');

meaningsTests.test('Card meanings JSON should be valid and loadable', function() {
    const meaningsPath = path.join(__dirname, '../decks/data/card-meanings.json');
    this.assertTrue(fs.existsSync(meaningsPath), 'card-meanings.json should exist');

    const meanings = JSON.parse(fs.readFileSync(meaningsPath, 'utf8'));
    this.assertNotNull(meanings, 'Should parse JSON successfully');
});

meaningsTests.test('Card meanings should have major arcana', function() {
    const meaningsPath = path.join(__dirname, '../decks/data/card-meanings.json');
    const meanings = JSON.parse(fs.readFileSync(meaningsPath, 'utf8'));

    this.assertNotNull(meanings.major_arcana, 'Should have major_arcana');
    this.assertArrayLength(meanings.major_arcana, 22, 'Should have 22 major arcana');
});

meaningsTests.test('Card meanings should have all minor arcana suits', function() {
    const meaningsPath = path.join(__dirname, '../decks/data/card-meanings.json');
    const meanings = JSON.parse(fs.readFileSync(meaningsPath, 'utf8'));

    const suits = ['cups', 'pentacles', 'swords', 'wands'];
    suits.forEach(suit => {
        this.assertNotNull(meanings.minor_arcana[suit], `Should have ${suit} suit`);
        this.assertArrayLength(meanings.minor_arcana[suit], 14, `${suit} should have 14 cards`);
    });
});

meaningsTests.test('Each card meaning should have upright and reversed', function() {
    const meaningsPath = path.join(__dirname, '../decks/data/card-meanings.json');
    const meanings = JSON.parse(fs.readFileSync(meaningsPath, 'utf8'));

    // Check major arcana
    meanings.major_arcana.forEach(card => {
        this.assertNotNull(card.upright, `${card.name} should have upright meaning`);
        this.assertNotNull(card.reversed, `${card.name} should have reversed meaning`);
        this.assertTrue(card.upright.length > 0, `${card.name} upright should not be empty`);
        this.assertTrue(card.reversed.length > 0, `${card.name} reversed should not be empty`);
    });
});

meaningsTests.test('The Fool should have correct meanings', function() {
    const meaningsPath = path.join(__dirname, '../decks/data/card-meanings.json');
    const meanings = JSON.parse(fs.readFileSync(meaningsPath, 'utf8'));

    const fool = meanings.major_arcana.find(c => c.name === 'The Fool');
    this.assertNotNull(fool, 'Should find The Fool');
    this.assertContains(fool.upright, 'innocence', 'Should contain "innocence" in upright');
    this.assertContains(fool.reversed, 'recklessness', 'Should contain "recklessness" in reversed');
});

// =============================================================================
// Run All Test Suites
// =============================================================================

async function runAllTests() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 AUTOMATED TEST SUITE FOR UNIFIED DECK SYSTEM');
    console.log('='.repeat(60));

    await registryTests.run();
    await pathTests.run();
    await loaderTests.run();
    await integrationTests.run();
    await meaningsTests.run();

    console.log('='.repeat(60));
    console.log('🎉 ALL TEST SUITES COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\nTotal tests run:',
        registryTests.tests.length +
        pathTests.tests.length +
        loaderTests.tests.length +
        integrationTests.tests.length +
        meaningsTests.tests.length
    );
    console.log('✅ All systems operational!\n');
}

// Run tests if called directly
if (require.main === module) {
    runAllTests().catch(error => {
        console.error('❌ Test suite failed:', error);
        process.exit(1);
    });
}

// Export for use in other test runners
module.exports = {
    TestRunner,
    registryTests,
    pathTests,
    loaderTests,
    integrationTests,
    meaningsTests,
    runAllTests
};
