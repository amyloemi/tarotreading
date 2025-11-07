#!/usr/bin/env node
/**
 * Node.js test for DeckRegistry
 * Run with: node tests/test-registry.js
 */

const DECK_REGISTRY = require('../decks/shared/DeckRegistry.js');

console.log('🧪 Testing DeckRegistry...\n');

let passCount = 0;
let failCount = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✅ ${name}`);
        passCount++;
    } catch (err) {
        console.error(`❌ ${name}: ${err.message}`);
        failCount++;
    }
}

// Test 1: Deck count
test('Registry has 4 decks', () => {
    const deckCount = Object.keys(DECK_REGISTRY.decks).length;
    if (deckCount !== 4) throw new Error(`Expected 4 decks, got ${deckCount}`);
});

// Test 2: Card count
test('Registry has 78 cards total', () => {
    const majorCount = DECK_REGISTRY.cards.major.length;
    const minorCount = Object.values(DECK_REGISTRY.cards.minor)
        .reduce((sum, suit) => sum + suit.length, 0);
    const totalCards = majorCount + minorCount;

    if (totalCards !== 78) throw new Error(`Expected 78 cards, got ${totalCards}`);
});

// Test 3: Major Arcana
test('Major Arcana has 22 cards (0-21)', () => {
    const major = DECK_REGISTRY.cards.major;
    if (major.length !== 22) throw new Error(`Expected 22, got ${major.length}`);
    if (major[0].id !== 0) throw new Error('First card should be ID 0');
    if (major[21].id !== 21) throw new Error('Last card should be ID 21');
});

// Test 4: Minor Arcana
test('Minor Arcana has 4 suits × 14 cards', () => {
    const suits = Object.keys(DECK_REGISTRY.cards.minor);
    if (suits.length !== 4) throw new Error(`Expected 4 suits, got ${suits.length}`);

    for (const suit of suits) {
        const cards = DECK_REGISTRY.cards.minor[suit];
        if (cards.length !== 14) throw new Error(`${suit} should have 14 cards, got ${cards.length}`);
    }
});

// Test 5: Card IDs are sequential
test('Card IDs are sequential (0-77)', () => {
    const allCardIds = [];

    // Collect major arcana IDs
    DECK_REGISTRY.cards.major.forEach(card => allCardIds.push(card.id));

    // Collect minor arcana IDs
    for (const suit in DECK_REGISTRY.cards.minor) {
        DECK_REGISTRY.cards.minor[suit].forEach(card => allCardIds.push(card.id));
    }

    // Sort and check
    allCardIds.sort((a, b) => a - b);
    for (let i = 0; i < 78; i++) {
        if (allCardIds[i] !== i) {
            throw new Error(`Missing or duplicate ID at position ${i}`);
        }
    }
});

// Test 6: All cards have required properties
test('All cards have id, name, and filename', () => {
    const allCards = [
        ...DECK_REGISTRY.cards.major,
        ...Object.values(DECK_REGISTRY.cards.minor).flat()
    ];

    allCards.forEach(card => {
        if (typeof card.id !== 'number') throw new Error(`Card ${card.name} missing id`);
        if (!card.name) throw new Error(`Card ${card.id} missing name`);
        if (!card.filename) throw new Error(`Card ${card.name} missing filename`);
    });
});

// Test 7: Deck properties
test('All decks have required properties', () => {
    for (const [id, deck] of Object.entries(DECK_REGISTRY.decks)) {
        if (!deck.id) throw new Error(`Deck ${id} missing id`);
        if (!deck.name) throw new Error(`Deck ${id} missing name`);
        if (!deck.folder) throw new Error(`Deck ${id} missing folder`);
        if (deck.hasThumbnails === undefined) throw new Error(`Deck ${id} missing hasThumbnails`);
    }
});

// Summary
console.log(`\n${'='.repeat(50)}`);
console.log(`Total: ${passCount + failCount} | Passed: ${passCount} | Failed: ${failCount}`);
console.log('='.repeat(50));

if (failCount === 0) {
    console.log('\n✅ All tests passed! DeckRegistry is valid.\n');
    process.exit(0);
} else {
    console.log(`\n❌ ${failCount} test(s) failed.\n`);
    process.exit(1);
}
