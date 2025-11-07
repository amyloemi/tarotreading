/**
 * DeckRegistry.js
 * Single source of truth for all tarot decks and cards
 * Version: 1.0
 */

const DECK_REGISTRY = {
    // ===== DECK METADATA =====
    decks: {
        'rider-waite': {
            id: 'rider-waite',
            name: 'Rider-Waite Classic',
            folder: 'images',
            imageFormat: 'png',
            hasThumbnails: true,
            thumbnailFolder: 'images-thumbnails',
            structure: {
                major: 'major_arcana',
                minor: 'minor_arcana/{suit}'
            },
            thumbnailFormats: ['webp', 'jpg']
        },
        'artistic': {
            id: 'artistic',
            name: 'Artistic Tarot',
            folder: 'artistic-tarot-cards',
            imageFormat: 'png',
            hasThumbnails: true,
            thumbnailFolder: 'artistic-tarot-cards-thumbnails',
            structure: {
                major: '',  // Flat structure
                minor: ''   // Flat structure
            },
            thumbnailFormats: ['webp', 'jpg'],
            // NOTE: Artistic deck numbering starts at 01 (not 00)
            numberingOffset: 1,
            // Artistic deck has different suit order: wands, cups, swords, pentacles
            suitOrder: ['wands', 'cups', 'swords', 'pentacles']
        },
        'miro': {
            id: 'miro',
            name: 'Miró Surrealism',
            folder: 'miro-tarot-cards',
            imageFormat: 'png',
            hasThumbnails: true,
            thumbnailFolder: 'miro-tarot-cards-thumbnails',
            structure: {
                major: '',  // Flat structure
                minor: ''   // Flat structure
            },
            thumbnailFormats: ['webp', 'jpg'],
            // Miro deck numbering starts at 01 (not 00)
            numberingOffset: 1,
            // Miro deck has different suit order: cups, wands, swords, pentacles
            suitOrder: ['cups', 'wands', 'swords', 'pentacles']
        },
        'picasso': {
            id: 'picasso',
            name: 'Picasso Cubism',
            folder: 'picasso-tarot-cards',
            imageFormat: 'png',
            hasThumbnails: true,
            thumbnailFolder: 'picasso-tarot-cards-thumbnails',
            structure: {
                major: '',  // Flat structure
                minor: ''   // Flat structure
            },
            thumbnailFormats: ['webp', 'jpg'],
            // Picasso deck numbering starts at 01 (not 00)
            numberingOffset: 1,
            // Picasso deck has different suit order: wands, cups, swords, pentacles
            suitOrder: ['wands', 'cups', 'swords', 'pentacles']
        }
    },

    // ===== CARD CATALOG =====
    // All 78 cards with standardized IDs
    cards: {
        major: [
            { id: 0, name: 'The Fool', filename: 'the-fool' },
            { id: 1, name: 'The Magician', filename: 'the-magician' },
            { id: 2, name: 'The High Priestess', filename: 'the-high-priestess' },
            { id: 3, name: 'The Empress', filename: 'the-empress' },
            { id: 4, name: 'The Emperor', filename: 'the-emperor' },
            { id: 5, name: 'The Hierophant', filename: 'the-hierophant' },
            { id: 6, name: 'The Lovers', filename: 'the-lovers' },
            { id: 7, name: 'The Chariot', filename: 'the-chariot' },
            { id: 8, name: 'Strength', filename: 'strength' },
            { id: 9, name: 'The Hermit', filename: 'the-hermit' },
            { id: 10, name: 'Wheel of Fortune', filename: 'wheel-of-fortune' },
            { id: 11, name: 'Justice', filename: 'justice' },
            { id: 12, name: 'The Hanged Man', filename: 'the-hanged-man' },
            { id: 13, name: 'Death', filename: 'death' },
            { id: 14, name: 'Temperance', filename: 'temperance' },
            { id: 15, name: 'The Devil', filename: 'the-devil' },
            { id: 16, name: 'The Tower', filename: 'the-tower' },
            { id: 17, name: 'The Star', filename: 'the-star' },
            { id: 18, name: 'The Moon', filename: 'the-moon' },
            { id: 19, name: 'The Sun', filename: 'the-sun' },
            { id: 20, name: 'Judgement', filename: 'judgement' },
            { id: 21, name: 'The World', filename: 'the-world' }
        ],
        minor: {
            cups: [
                { id: 22, name: 'Ace of Cups', filename: 'ace-of-cups', rank: 'ace' },
                { id: 23, name: 'Two of Cups', filename: 'two-of-cups', rank: '2' },
                { id: 24, name: 'Three of Cups', filename: 'three-of-cups', rank: '3' },
                { id: 25, name: 'Four of Cups', filename: 'four-of-cups', rank: '4' },
                { id: 26, name: 'Five of Cups', filename: 'five-of-cups', rank: '5' },
                { id: 27, name: 'Six of Cups', filename: 'six-of-cups', rank: '6' },
                { id: 28, name: 'Seven of Cups', filename: 'seven-of-cups', rank: '7' },
                { id: 29, name: 'Eight of Cups', filename: 'eight-of-cups', rank: '8' },
                { id: 30, name: 'Nine of Cups', filename: 'nine-of-cups', rank: '9' },
                { id: 31, name: 'Ten of Cups', filename: 'ten-of-cups', rank: '10' },
                { id: 32, name: 'Page of Cups', filename: 'page-of-cups', rank: 'page' },
                { id: 33, name: 'Knight of Cups', filename: 'knight-of-cups', rank: 'knight' },
                { id: 34, name: 'Queen of Cups', filename: 'queen-of-cups', rank: 'queen' },
                { id: 35, name: 'King of Cups', filename: 'king-of-cups', rank: 'king' }
            ],
            pentacles: [
                { id: 36, name: 'Ace of Pentacles', filename: 'ace-of-pentacles', rank: 'ace' },
                { id: 37, name: 'Two of Pentacles', filename: 'two-of-pentacles', rank: '2' },
                { id: 38, name: 'Three of Pentacles', filename: 'three-of-pentacles', rank: '3' },
                { id: 39, name: 'Four of Pentacles', filename: 'four-of-pentacles', rank: '4' },
                { id: 40, name: 'Five of Pentacles', filename: 'five-of-pentacles', rank: '5' },
                { id: 41, name: 'Six of Pentacles', filename: 'six-of-pentacles', rank: '6' },
                { id: 42, name: 'Seven of Pentacles', filename: 'seven-of-pentacles', rank: '7' },
                { id: 43, name: 'Eight of Pentacles', filename: 'eight-of-pentacles', rank: '8' },
                { id: 44, name: 'Nine of Pentacles', filename: 'nine-of-pentacles', rank: '9' },
                { id: 45, name: 'Ten of Pentacles', filename: 'ten-of-pentacles', rank: '10' },
                { id: 46, name: 'Page of Pentacles', filename: 'page-of-pentacles', rank: 'page' },
                { id: 47, name: 'Knight of Pentacles', filename: 'knight-of-pentacles', rank: 'knight' },
                { id: 48, name: 'Queen of Pentacles', filename: 'queen-of-pentacles', rank: 'queen' },
                { id: 49, name: 'King of Pentacles', filename: 'king-of-pentacles', rank: 'king' }
            ],
            swords: [
                { id: 50, name: 'Ace of Swords', filename: 'ace-of-swords', rank: 'ace' },
                { id: 51, name: 'Two of Swords', filename: 'two-of-swords', rank: '2' },
                { id: 52, name: 'Three of Swords', filename: 'three-of-swords', rank: '3' },
                { id: 53, name: 'Four of Swords', filename: 'four-of-swords', rank: '4' },
                { id: 54, name: 'Five of Swords', filename: 'five-of-swords', rank: '5' },
                { id: 55, name: 'Six of Swords', filename: 'six-of-swords', rank: '6' },
                { id: 56, name: 'Seven of Swords', filename: 'seven-of-swords', rank: '7' },
                { id: 57, name: 'Eight of Swords', filename: 'eight-of-swords', rank: '8' },
                { id: 58, name: 'Nine of Swords', filename: 'nine-of-swords', rank: '9' },
                { id: 59, name: 'Ten of Swords', filename: 'ten-of-swords', rank: '10' },
                { id: 60, name: 'Page of Swords', filename: 'page-of-swords', rank: 'page' },
                { id: 61, name: 'Knight of Swords', filename: 'knight-of-swords', rank: 'knight' },
                { id: 62, name: 'Queen of Swords', filename: 'queen-of-swords', rank: 'queen' },
                { id: 63, name: 'King of Swords', filename: 'king-of-swords', rank: 'king' }
            ],
            wands: [
                { id: 64, name: 'Ace of Wands', filename: 'ace-of-wands', rank: 'ace' },
                { id: 65, name: 'Two of Wands', filename: 'two-of-wands', rank: '2' },
                { id: 66, name: 'Three of Wands', filename: 'three-of-wands', rank: '3' },
                { id: 67, name: 'Four of Wands', filename: 'four-of-wands', rank: '4' },
                { id: 68, name: 'Five of Wands', filename: 'five-of-wands', rank: '5' },
                { id: 69, name: 'Six of Wands', filename: 'six-of-wands', rank: '6' },
                { id: 70, name: 'Seven of Wands', filename: 'seven-of-wands', rank: '7' },
                { id: 71, name: 'Eight of Wands', filename: 'eight-of-wands', rank: '8' },
                { id: 72, name: 'Nine of Wands', filename: 'nine-of-wands', rank: '9' },
                { id: 73, name: 'Ten of Wands', filename: 'ten-of-wands', rank: '10' },
                { id: 74, name: 'Page of Wands', filename: 'page-of-wands', rank: 'page' },
                { id: 75, name: 'Knight of Wands', filename: 'knight-of-wands', rank: 'knight' },
                { id: 76, name: 'Queen of Wands', filename: 'queen-of-wands', rank: 'queen' },
                { id: 77, name: 'King of Wands', filename: 'king-of-wands', rank: 'king' }
            ]
        }
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DECK_REGISTRY;
}
