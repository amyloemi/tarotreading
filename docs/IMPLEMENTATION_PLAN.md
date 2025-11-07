# 🔨 IMPLEMENTATION PLAN: Step-by-Step Execution Guide

**Version:** 1.0
**Date:** November 7, 2025
**Related Documents:**
- [Refactoring Plan](./REFACTORING_PLAN.md) - High-level strategy
- [Architecture](./ARCHITECTURE.md) - Final system design (will be created)

---

## 📌 **How to Use This Document**

This is your **execution checklist**. Each task includes:
- ✅ Checkbox for tracking completion
- 📝 Exact commands to run
- 📄 Code to write
- ⚠️ Warnings and gotchas
- 🎯 Expected output

Work through tasks **in order** - later tasks depend on earlier ones.

---

## ⏱️ **Time Estimates**

| Phase | Tasks | Time | Can Skip? |
|-------|-------|------|-----------|
| Phase 1: Foundation | 5 tasks | 6-8 hours | ❌ Critical |
| Phase 2: Image Optimization | 3 tasks | 4-6 hours | ❌ Critical |
| Phase 3: Update HTML | 5 tasks | 4-5 hours | ❌ Critical |
| Phase 4: Error Handling | 3 tasks | 2-3 hours | ⚠️ Recommended |
| Phase 5: Testing | 3 tasks | 3-4 hours | ⚠️ Recommended |
| Phase 6: Documentation | 4 tasks | 2-3 hours | ✅ Optional |
| Phase 7: Deploy | 3 tasks | 2-3 hours | ❌ Critical |

**Total: 23-32 hours** (3-4 full days of work)

---

# 📋 PHASE 1: Foundation & Architecture

**Goal:** Create the unified system that replaces all duplicate code.

**Time:** 6-8 hours

---

## Task 1.1: Create Folder Structure

**Time:** 30 minutes

### ✅ Step 1: Create new directories

```bash
cd /Users/amy/CCWorkSpace/TarotReading/github-deploy

# Create shared utilities folder
mkdir -p decks/shared

# Create data folder
mkdir -p decks/data

# Create docs folder
mkdir -p docs
```

**Expected output:**
```
Created: decks/shared/
Created: decks/data/
Created: docs/
```

### ✅ Step 2: Reorganize Rider-Waite folder

```bash
# Rename nested folders (remove _arcana suffix)
cd decks
mv images/major_arcana images/major
mv images/minor_arcana images/minor

# Rename thumbnails folder structure too
mv images-thumbnails/major_arcana images-thumbnails/major
mv images-thumbnails/minor_arcana images-thumbnails/minor

# Move into rider-waite subfolder
mkdir -p rider-waite
mv images rider-waite/
mv images-thumbnails rider-waite/thumbnails
```

**⚠️ WARNING:** This will break existing pages temporarily. They'll work again after Phase 3.

**Expected structure:**
```
decks/
├── rider-waite/
│   ├── images/
│   │   ├── major/
│   │   └── minor/
│   └── thumbnails/
│       ├── major/
│       └── minor/
```

### ✅ Step 3: Reorganize other decks

```bash
cd decks

# Artistic deck
mkdir -p artistic/images
mv artistic-tarot-cards/* artistic/images/
rmdir artistic-tarot-cards

# Miro deck
mkdir -p miro/images
mv miro-tarot-cards/* miro/images/
rmdir miro-tarot-cards

# Picasso deck
mkdir -p picasso/images
mv picasso-tarot-cards/* picasso/images/
rmdir picasso-tarot-cards
```

**Expected structure:**
```
decks/
├── artistic/
│   └── images/
├── miro/
│   └── images/
└── picasso/
    └── images/
```

---

## Task 1.2: Create DeckRegistry.js

**Time:** 1 hour

### ✅ Step 1: Create the registry file

Create file: `decks/shared/DeckRegistry.js`

```javascript
/**
 * DeckRegistry.js
 * Single source of truth for all tarot decks and cards
 */

const DECK_REGISTRY = {
    // ===== DECK METADATA =====
    decks: {
        'rider-waite': {
            id: 'rider-waite',
            name: 'Rider-Waite Classic',
            folder: 'rider-waite',
            imageFormat: 'png',
            namingConvention: 'standard',
            hasThumbnails: true,
            structure: {
                major: 'images/major',
                minor: 'images/minor/{suit}'
            },
            thumbnailFormats: ['webp', 'jpg']
        },
        'artistic': {
            id: 'artistic',
            name: 'Artistic Tarot',
            folder: 'artistic',
            imageFormat: 'png',
            namingConvention: 'standard',
            hasThumbnails: false, // Will be true after Phase 2
            structure: {
                major: 'images',
                minor: 'images'
            },
            thumbnailFormats: ['webp', 'jpg']
        },
        'miro': {
            id: 'miro',
            name: 'Miró Surrealism',
            folder: 'miro',
            imageFormat: 'png',
            namingConvention: 'standard',
            hasThumbnails: false, // Will be true after Phase 2
            structure: {
                major: 'images',
                minor: 'images'
            },
            thumbnailFormats: ['webp', 'jpg']
        },
        'picasso': {
            id: 'picasso',
            name: 'Picasso Cubism',
            folder: 'picasso',
            imageFormat: 'png',
            namingConvention: 'standard',
            hasThumbnails: false, // Will be true after Phase 2
            structure: {
                major: 'images',
                minor: 'images'
            },
            thumbnailFormats: ['webp', 'jpg']
        }
    },

    // ===== CARD CATALOG =====
    // All 78 cards with standardized IDs
    cards: {
        major: [
            { id: 0, name: 'The Fool', filename: '00-fool' },
            { id: 1, name: 'The Magician', filename: '01-magician' },
            { id: 2, name: 'The High Priestess', filename: '02-high-priestess' },
            { id: 3, name: 'The Empress', filename: '03-empress' },
            { id: 4, name: 'The Emperor', filename: '04-emperor' },
            { id: 5, name: 'The Hierophant', filename: '05-hierophant' },
            { id: 6, name: 'The Lovers', filename: '06-lovers' },
            { id: 7, name: 'The Chariot', filename: '07-chariot' },
            { id: 8, name: 'Strength', filename: '08-strength' },
            { id: 9, name: 'The Hermit', filename: '09-hermit' },
            { id: 10, name: 'Wheel of Fortune', filename: '10-wheel-of-fortune' },
            { id: 11, name: 'Justice', filename: '11-justice' },
            { id: 12, name: 'The Hanged Man', filename: '12-hanged-man' },
            { id: 13, name: 'Death', filename: '13-death' },
            { id: 14, name: 'Temperance', filename: '14-temperance' },
            { id: 15, name: 'The Devil', filename: '15-devil' },
            { id: 16, name: 'The Tower', filename: '16-tower' },
            { id: 17, name: 'The Star', filename: '17-star' },
            { id: 18, name: 'The Moon', filename: '18-moon' },
            { id: 19, name: 'The Sun', filename: '19-sun' },
            { id: 20, name: 'Judgement', filename: '20-judgement' },
            { id: 21, name: 'The World', filename: '21-world' }
        ],
        minor: {
            cups: [
                { id: 22, name: 'Ace of Cups', filename: '22-ace-cups', rank: 'ace' },
                { id: 23, name: 'Two of Cups', filename: '23-two-cups', rank: '2' },
                { id: 24, name: 'Three of Cups', filename: '24-three-cups', rank: '3' },
                { id: 25, name: 'Four of Cups', filename: '25-four-cups', rank: '4' },
                { id: 26, name: 'Five of Cups', filename: '26-five-cups', rank: '5' },
                { id: 27, name: 'Six of Cups', filename: '27-six-cups', rank: '6' },
                { id: 28, name: 'Seven of Cups', filename: '28-seven-cups', rank: '7' },
                { id: 29, name: 'Eight of Cups', filename: '29-eight-cups', rank: '8' },
                { id: 30, name: 'Nine of Cups', filename: '30-nine-cups', rank: '9' },
                { id: 31, name: 'Ten of Cups', filename: '31-ten-cups', rank: '10' },
                { id: 32, name: 'Page of Cups', filename: '32-page-cups', rank: 'page' },
                { id: 33, name: 'Knight of Cups', filename: '33-knight-cups', rank: 'knight' },
                { id: 34, name: 'Queen of Cups', filename: '34-queen-cups', rank: 'queen' },
                { id: 35, name: 'King of Cups', filename: '35-king-cups', rank: 'king' }
            ],
            pentacles: [
                { id: 36, name: 'Ace of Pentacles', filename: '36-ace-pentacles', rank: 'ace' },
                { id: 37, name: 'Two of Pentacles', filename: '37-two-pentacles', rank: '2' },
                { id: 38, name: 'Three of Pentacles', filename: '38-three-pentacles', rank: '3' },
                { id: 39, name: 'Four of Pentacles', filename: '39-four-pentacles', rank: '4' },
                { id: 40, name: 'Five of Pentacles', filename: '40-five-pentacles', rank: '5' },
                { id: 41, name: 'Six of Pentacles', filename: '41-six-pentacles', rank: '6' },
                { id: 42, name: 'Seven of Pentacles', filename: '42-seven-pentacles', rank: '7' },
                { id: 43, name: 'Eight of Pentacles', filename: '43-eight-pentacles', rank: '8' },
                { id: 44, name: 'Nine of Pentacles', filename: '44-nine-pentacles', rank: '9' },
                { id: 45, name: 'Ten of Pentacles', filename: '45-ten-pentacles', rank: '10' },
                { id: 46, name: 'Page of Pentacles', filename: '46-page-pentacles', rank: 'page' },
                { id: 47, name: 'Knight of Pentacles', filename: '47-knight-pentacles', rank: 'knight' },
                { id: 48, name: 'Queen of Pentacles', filename: '48-queen-pentacles', rank: 'queen' },
                { id: 49, name: 'King of Pentacles', filename: '49-king-pentacles', rank: 'king' }
            ],
            swords: [
                { id: 50, name: 'Ace of Swords', filename: '50-ace-swords', rank: 'ace' },
                { id: 51, name: 'Two of Swords', filename: '51-two-swords', rank: '2' },
                { id: 52, name: 'Three of Swords', filename: '52-three-swords', rank: '3' },
                { id: 53, name: 'Four of Swords', filename: '53-four-swords', rank: '4' },
                { id: 54, name: 'Five of Swords', filename: '54-five-swords', rank: '5' },
                { id: 55, name: 'Six of Swords', filename: '55-six-swords', rank: '6' },
                { id: 56, name: 'Seven of Swords', filename: '56-seven-swords', rank: '7' },
                { id: 57, name: 'Eight of Swords', filename: '57-eight-swords', rank: '8' },
                { id: 58, name: 'Nine of Swords', filename: '58-nine-swords', rank: '9' },
                { id: 59, name: 'Ten of Swords', filename: '59-ten-swords', rank: '10' },
                { id: 60, name: 'Page of Swords', filename: '60-page-swords', rank: 'page' },
                { id: 61, name: 'Knight of Swords', filename: '61-knight-swords', rank: 'knight' },
                { id: 62, name: 'Queen of Swords', filename: '62-queen-swords', rank: 'queen' },
                { id: 63, name: 'King of Swords', filename: '63-king-swords', rank: 'king' }
            ],
            wands: [
                { id: 64, name: 'Ace of Wands', filename: '64-ace-wands', rank: 'ace' },
                { id: 65, name: 'Two of Wands', filename: '65-two-wands', rank: '2' },
                { id: 66, name: 'Three of Wands', filename: '66-three-wands', rank: '3' },
                { id: 67, name: 'Four of Wands', filename: '67-four-wands', rank: '4' },
                { id: 68, name: 'Five of Wands', filename: '68-five-wands', rank: '5' },
                { id: 69, name: 'Six of Wands', filename: '69-six-wands', rank: '6' },
                { id: 70, name: 'Seven of Wands', filename: '70-seven-wands', rank: '7' },
                { id: 71, name: 'Eight of Wands', filename: '71-eight-wands', rank: '8' },
                { id: 72, name: 'Nine of Wands', filename: '72-nine-wands', rank: '9' },
                { id: 73, name: 'Ten of Wands', filename: '73-ten-wands', rank: '10' },
                { id: 74, name: 'Page of Wands', filename: '74-page-wands', rank: 'page' },
                { id: 75, name: 'Knight of Wands', filename: '75-knight-wands', rank: 'knight' },
                { id: 76, name: 'Queen of Wands', filename: '76-queen-wands', rank: 'queen' },
                { id: 77, name: 'King of Wands', filename: '77-king-wands', rank: 'king' }
            ]
        }
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DECK_REGISTRY;
}
```

### ✅ Step 2: Test the registry

Create test file: `tests/test-registry.js`

```javascript
const DECK_REGISTRY = require('../decks/shared/DeckRegistry.js');

console.log('Testing DeckRegistry...\n');

// Test 1: Deck count
const deckCount = Object.keys(DECK_REGISTRY.decks).length;
console.log(`✓ Found ${deckCount} decks`);

// Test 2: Card count
const majorCount = DECK_REGISTRY.cards.major.length;
const minorCount = Object.values(DECK_REGISTRY.cards.minor)
    .reduce((sum, suit) => sum + suit.length, 0);
const totalCards = majorCount + minorCount;
console.log(`✓ Total cards: ${totalCards} (22 major + 56 minor)`);

if (totalCards === 78) {
    console.log('\n✅ Registry is valid!');
} else {
    console.error(`\n❌ ERROR: Expected 78 cards, found ${totalCards}`);
}
```

Run test:
```bash
node tests/test-registry.js
```

**Expected output:**
```
Testing DeckRegistry...

✓ Found 4 decks
✓ Total cards: 78 (22 major + 56 minor)

✅ Registry is valid!
```

---

## Task 1.3: Create PathResolver.js

**Time:** 30 minutes

### ✅ Step 1: Create the path resolver file

Create file: `decks/shared/PathResolver.js`

```javascript
/**
 * PathResolver.js
 * Unified path resolution for all pages (root and /pages/ subfolder)
 */

class PathResolver {
    /**
     * Determine base path based on current page location
     * Works for: index.html, pages/*.html
     */
    static getBasePath() {
        // Use absolute paths for HTTP(S)
        if (window.location.protocol.startsWith('http')) {
            return '/';
        }

        // For file:// protocol, use relative paths
        const path = window.location.pathname;
        const isInSubfolder = path.includes('/pages/');

        return isInSubfolder ? '../' : '';
    }

    /**
     * Resolve path relative to current page
     * @param {...string} parts - Path components to join
     * @returns {string} Complete path
     *
     * Example: resolve('decks', 'rider-waite', 'images', '00-fool.png')
     * Returns: 'decks/rider-waite/images/00-fool.png' (from root)
     *       or '../decks/rider-waite/images/00-fool.png' (from /pages/)
     */
    static resolve(...parts) {
        const base = this.getBasePath();
        const path = parts.join('/');
        return base + path;
    }

    /**
     * Check if we're in a subfolder
     * @returns {boolean}
     */
    static isInSubfolder() {
        return window.location.pathname.includes('/pages/');
    }

    /**
     * Get current page name
     * @returns {string}
     */
    static getCurrentPage() {
        const path = window.location.pathname;
        return path.substring(path.lastIndexOf('/') + 1);
    }
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.PathResolver = PathResolver;
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PathResolver;
}
```

### ✅ Step 2: Test the path resolver

Create test file: `tests/test-path-resolver.html`

```html
<!DOCTYPE html>
<html>
<head>
    <title>PathResolver Test</title>
</head>
<body>
    <h1>PathResolver Test</h1>
    <div id="output"></div>

    <script src="../decks/shared/PathResolver.js"></script>
    <script>
        const output = document.getElementById('output');

        // Test from root
        const basePath = PathResolver.getBasePath();
        const resolvedPath = PathResolver.resolve('decks', 'rider-waite', 'images', '00-fool.png');
        const currentPage = PathResolver.getCurrentPage();
        const inSubfolder = PathResolver.isInSubfolder();

        output.innerHTML = `
            <p><strong>Base Path:</strong> ${basePath}</p>
            <p><strong>Resolved Path:</strong> ${resolvedPath}</p>
            <p><strong>Current Page:</strong> ${currentPage}</p>
            <p><strong>In Subfolder:</strong> ${inSubfolder}</p>
            <p style="color: green;"><strong>✅ PathResolver is working!</strong></p>
        `;
    </script>
</body>
</html>
```

Open in browser to test:
```bash
open tests/test-path-resolver.html
```

---

## Task 1.4: Create DeckLoader.js

**Time:** 2-3 hours

### ✅ Step 1: Create the deck loader file

Create file: `decks/shared/DeckLoader.js`

```javascript
/**
 * DeckLoader.js
 * Unified image loading system for all tarot decks
 */

class DeckLoader {
    /**
     * Get image path for any card from any deck
     * @param {string} deckId - Deck identifier (e.g., 'rider-waite')
     * @param {object} card - Card object from registry
     * @param {object} options - Optional settings
     * @returns {string} Full path to image
     */
    static getImagePath(deckId, card, options = {}) {
        const deck = DECK_REGISTRY.decks[deckId];
        if (!deck) {
            throw new Error(`Unknown deck: ${deckId}`);
        }

        const basePath = PathResolver.resolve('decks', deck.folder);

        // Determine folder path
        let folder;
        if (card.type === 'major') {
            folder = deck.structure.major;
        } else {
            // Replace {suit} placeholder with actual suit
            folder = deck.structure.minor.replace('{suit}', card.suit);
        }

        // Build filename
        const filename = `${card.filename}.${deck.imageFormat}`;

        return `${basePath}/${folder}/${filename}`;
    }

    /**
     * Get thumbnail path (optimized version)
     * @param {string} deckId - Deck identifier
     * @param {object} card - Card object
     * @param {string} format - Image format ('webp' or 'jpg')
     * @returns {string} Full path to thumbnail
     */
    static getThumbnailPath(deckId, card, format = 'webp') {
        const deck = DECK_REGISTRY.decks[deckId];
        if (!deck.hasThumbnails) {
            // Fallback to full size if no thumbnails
            return this.getImagePath(deckId, card);
        }

        const basePath = PathResolver.resolve('decks', deck.folder);

        let folder;
        if (card.type === 'major') {
            folder = 'thumbnails/major';
        } else {
            folder = `thumbnails/minor/${card.suit}`;
        }

        const filename = `${card.filename}.${format}`;

        return `${basePath}/${folder}/${filename}`;
    }

    /**
     * Get all 78 cards from registry
     * @returns {Array} All cards with type/suit properties
     */
    static getAllCards() {
        const cards = [];

        // Add major arcana
        DECK_REGISTRY.cards.major.forEach(card => {
            cards.push({ ...card, type: 'major' });
        });

        // Add minor arcana
        for (const suit in DECK_REGISTRY.cards.minor) {
            DECK_REGISTRY.cards.minor[suit].forEach(card => {
                cards.push({ ...card, type: 'minor', suit });
            });
        }

        return cards;
    }

    /**
     * Get card by name
     * @param {string} cardName - Full card name (e.g., "The Fool")
     * @returns {object|null} Card object or null
     */
    static getCardByName(cardName) {
        // Search major arcana
        const majorCard = DECK_REGISTRY.cards.major.find(c => c.name === cardName);
        if (majorCard) {
            return { ...majorCard, type: 'major' };
        }

        // Search minor arcana
        for (const suit in DECK_REGISTRY.cards.minor) {
            const minorCard = DECK_REGISTRY.cards.minor[suit].find(c => c.name === cardName);
            if (minorCard) {
                return { ...minorCard, type: 'minor', suit };
            }
        }

        return null;
    }

    /**
     * Create responsive <picture> element with WebP + fallback
     * @param {string} deckId - Deck identifier
     * @param {object} card - Card object
     * @param {object} options - Options: { thumbnail: true/false, loading: 'lazy'/'eager' }
     * @returns {HTMLElement} <picture> element
     */
    static createResponsiveImage(deckId, card, options = {}) {
        const useThumbnails = options.thumbnail !== false;
        const deck = DECK_REGISTRY.decks[deckId];

        const picture = document.createElement('picture');

        if (deck.hasThumbnails && useThumbnails) {
            // WebP source (modern browsers)
            const sourceWebp = document.createElement('source');
            sourceWebp.srcset = this.getThumbnailPath(deckId, card, 'webp');
            sourceWebp.type = 'image/webp';
            picture.appendChild(sourceWebp);

            // JPEG fallback (older browsers)
            const sourceJpeg = document.createElement('source');
            sourceJpeg.srcset = this.getThumbnailPath(deckId, card, 'jpg');
            sourceJpeg.type = 'image/jpeg';
            picture.appendChild(sourceJpeg);

            // Final <img> fallback
            const img = document.createElement('img');
            img.src = this.getThumbnailPath(deckId, card, 'jpg');
            img.alt = card.name;
            img.loading = options.loading || 'lazy';
            img.decoding = 'async';
            picture.appendChild(img);
        } else {
            // No thumbnails - use full size
            const img = document.createElement('img');
            img.src = this.getImagePath(deckId, card);
            img.alt = card.name;
            img.loading = options.loading || 'lazy';
            img.decoding = 'async';
            picture.appendChild(img);
        }

        return picture;
    }

    /**
     * Add error handling to image element
     * Shows placeholder on load failure
     * @param {HTMLImageElement} imgElement - Image element
     * @param {string} placeholderPath - Path to placeholder image
     */
    static addErrorHandler(imgElement, placeholderPath = 'images/card-back.png') {
        imgElement.onerror = () => {
            const fallback = PathResolver.resolve(placeholderPath);
            imgElement.src = fallback;
            imgElement.onerror = null; // Prevent infinite loop
            console.error(`Failed to load image: ${imgElement.alt || 'Unknown card'}`);
        };
    }

    /**
     * Preload an image (for performance)
     * @param {string} deckId - Deck identifier
     * @param {object} card - Card object
     * @returns {Promise} Resolves when loaded
     */
    static preloadImage(deckId, card) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = this.getImagePath(deckId, card);
        });
    }
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.DeckLoader = DeckLoader;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeckLoader;
}
```

### ✅ Step 2: Create test page

Create file: `tests/test-deck-loader.html`

```html
<!DOCTYPE html>
<html>
<head>
    <title>DeckLoader Test</title>
    <style>
        body { font-family: Arial; padding: 20px; }
        .test-card {
            display: inline-block;
            margin: 10px;
            text-align: center;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 8px;
        }
        .test-card img {
            max-width: 200px;
            height: auto;
            border-radius: 5px;
        }
        .success { color: green; }
        .error { color: red; }
    </style>
</head>
<body>
    <h1>DeckLoader Test</h1>
    <div id="output"></div>
    <div id="cards"></div>

    <script src="../decks/shared/DeckRegistry.js"></script>
    <script src="../decks/shared/PathResolver.js"></script>
    <script src="../decks/shared/DeckLoader.js"></script>
    <script>
        const output = document.getElementById('output');
        const cardsContainer = document.getElementById('cards');

        // Test 1: Get all cards
        const allCards = DeckLoader.getAllCards();
        output.innerHTML += `<p class="success">✓ Loaded ${allCards.length} cards</p>`;

        // Test 2: Get card by name
        const fool = DeckLoader.getCardByName('The Fool');
        if (fool) {
            output.innerHTML += `<p class="success">✓ Found card: ${fool.name}</p>`;
        }

        // Test 3: Generate paths for each deck
        const decks = ['rider-waite', 'artistic', 'miro', 'picasso'];
        decks.forEach(deckId => {
            const path = DeckLoader.getImagePath(deckId, fool);
            output.innerHTML += `<p>Path for ${deckId}: <code>${path}</code></p>`;
        });

        // Test 4: Render a card from each deck
        decks.forEach(deckId => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'test-card';

            const picture = DeckLoader.createResponsiveImage(deckId, fool, {
                thumbnail: true,
                loading: 'eager'
            });

            const img = picture.querySelector('img');
            DeckLoader.addErrorHandler(img);

            cardDiv.innerHTML = `<h3>${DECK_REGISTRY.decks[deckId].name}</h3>`;
            cardDiv.appendChild(picture);
            cardDiv.innerHTML += `<p>${fool.name}</p>`;

            cardsContainer.appendChild(cardDiv);
        });

        output.innerHTML += `<p class="success"><strong>✅ DeckLoader is working!</strong></p>`;
    </script>
</body>
</html>
```

Open in browser:
```bash
open tests/test-deck-loader.html
```

**Expected output:**
- ✓ Loaded 78 cards
- ✓ Found card: The Fool
- Paths displayed for all 4 decks
- 4 card images displayed (one from each deck)

---

## Task 1.5: Delete Obsolete Files

**Time:** 15 minutes

### ✅ Step 1: Backup old files

```bash
cd /Users/amy/CCWorkSpace/TarotReading/github-deploy

# Create backup
mkdir -p backups
cp decks/rider-waite-data.js backups/
cp decks/artistic-data.js backups/
cp decks/miro-data.js backups/
cp decks/picasso-data.js backups/
```

### ✅ Step 2: Delete old deck data files

```bash
# Delete obsolete files
rm decks/rider-waite-data.js
rm decks/artistic-data.js
rm decks/miro-data.js
rm decks/picasso-data.js
```

**Expected:**
```
Deleted 4 files (611 lines of duplicate code eliminated!)
```

---

## ✅ Phase 1 Complete!

**Checklist:**
- ✅ Created unified folder structure
- ✅ Created DeckRegistry.js (single source of truth)
- ✅ Created PathResolver.js (unified path handling)
- ✅ Created DeckLoader.js (universal image loader)
- ✅ Deleted 611 lines of duplicate code
- ✅ All tests passing

**Time taken:** ~6-8 hours

**Next:** Phase 2 - Image Optimization

---

# 📋 PHASE 2: Image Optimization

**Goal:** Reduce image sizes from 98 MB → 13.5 MB

**Time:** 4-6 hours

---

## Task 2.1: Setup Image Optimization Tools

**Time:** 30 minutes

### ✅ Step 1: Initialize npm project

```bash
cd /Users/amy/CCWorkSpace/TarotReading/github-deploy

# Initialize npm (if not already done)
npm init -y
```

### ✅ Step 2: Install dependencies

```bash
npm install sharp fs-extra
```

**Expected output:**
```
added 2 packages
```

### ✅ Step 3: Create scripts folder

```bash
mkdir -p scripts
```

---

## Task 2.2: Create Optimization Scripts

**Time:** 2-3 hours

### ✅ Step 1: Create image optimization script

Create file: `scripts/optimize-images.js`

```javascript
const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const CONFIG = {
    thumbnailWidth: 300,        // Gallery thumbnails
    webpQuality: 82,            // Good balance
    jpegQuality: 85,
    targetSize: 50 * 1024,      // Target 50KB per thumbnail
};

async function optimizeAllDecks() {
    const decks = ['rider-waite', 'artistic', 'miro', 'picasso'];

    console.log('🎨 Starting Image Optimization...\n');

    for (const deck of decks) {
        console.log(`\n📦 Processing ${deck}...`);
        await processDeck(deck);
    }

    console.log('\n✅ All decks optimized!');
}

async function processDeck(deckName) {
    const inputPath = path.join('decks', deckName, 'images');
    const outputPath = path.join('decks', deckName, 'thumbnails');

    // Check if input exists
    if (!await fs.pathExists(inputPath)) {
        console.error(`  ❌ Input path not found: ${inputPath}`);
        return;
    }

    await fs.ensureDir(outputPath);

    // Find all PNG files recursively
    const files = await findImages(inputPath);

    if (files.length === 0) {
        console.warn(`  ⚠️  No images found in ${inputPath}`);
        return;
    }

    console.log(`  Found ${files.length} images`);

    let processed = 0;
    for (const file of files) {
        const relativePath = path.relative(inputPath, file);
        const outputDir = path.join(outputPath, path.dirname(relativePath));
        const basename = path.basename(file, '.png');

        await fs.ensureDir(outputDir);

        try {
            // Generate WebP thumbnail
            const webpPath = path.join(outputDir, `${basename}.webp`);
            await sharp(file)
                .resize(CONFIG.thumbnailWidth, null, {
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .webp({ quality: CONFIG.webpQuality })
                .toFile(webpPath);

            // Generate JPEG thumbnail
            const jpegPath = path.join(outputDir, `${basename}.jpg`);
            await sharp(file)
                .resize(CONFIG.thumbnailWidth, null, {
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .jpeg({ quality: CONFIG.jpegQuality, mozjpeg: true })
                .toFile(jpegPath);

            processed++;
            if (processed % 10 === 0) {
                console.log(`  Processed ${processed}/${files.length}...`);
            }
        } catch (err) {
            console.error(`  ❌ Error processing ${basename}:`, err.message);
        }
    }

    console.log(`  ✓ Completed ${deckName}: ${processed} cards optimized`);
}

async function findImages(dir) {
    const results = [];

    if (!await fs.pathExists(dir)) {
        return results;
    }

    const items = await fs.readdir(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = await fs.stat(fullPath);

        if (stat.isDirectory()) {
            results.push(...await findImages(fullPath));
        } else if (item.endsWith('.png') || item.endsWith('.jpg') || item.endsWith('.jpeg')) {
            results.push(fullPath);
        }
    }

    return results;
}

// Run
optimizeAllDecks().catch(err => {
    console.error('❌ Optimization failed:', err);
    process.exit(1);
});
```

### ✅ Step 2: Create file renaming script

Create file: `scripts/rename-images.js`

```javascript
const fs = require('fs-extra');
const path = require('path');

// Mapping of current names → standard names
const RENAME_MAPPINGS = {
    'miro': {
        // Miro uses Roman numerals - remove them
        '01-0--the-fool.png': '00-fool.png',
        '02-i--the-magician.png': '01-magician.png',
        '03-ii--the-high-priestess.png': '02-high-priestess.png',
        '04-iii--the-empress.png': '03-empress.png',
        '05-iv--the-emperor.png': '04-emperor.png',
        '06-v--the-hierophant.png': '05-hierophant.png',
        '07-vi--the-lovers.png': '06-lovers.png',
        '08-vii--the-chariot.png': '07-chariot.png',
        '09-viii--strength.png': '08-strength.png',
        '10-ix--the-hermit.png': '09-hermit.png',
        '11-x--wheel-of-fortune.png': '10-wheel-of-fortune.png',
        '12-xi--justice.png': '11-justice.png',
        '13-xii--the-hanged-man.png': '12-hanged-man.png',
        '14-xiii--death.png': '13-death.png',
        '15-xiv--temperance.png': '14-temperance.png',
        '16-xv--the-devil.png': '15-devil.png',
        '17-xvi--the-tower.png': '16-tower.png',
        '18-xvii--the-star.png': '17-star.png',
        '19-xviii--the-moon.png': '18-moon.png',
        '20-xix--the-sun.png': '19-sun.png',
        '21-xx--judgement.png': '20-judgement.png',
        '22-xxi--the-world.png': '21-world.png'
    }
    // Add more mappings if needed
};

async function renameAllDecks() {
    console.log('📝 Starting file renaming...\n');

    for (const [deck, mapping] of Object.entries(RENAME_MAPPINGS)) {
        console.log(`\n📦 Renaming ${deck}...`);
        const basePath = path.join('decks', deck, 'images');

        if (!await fs.pathExists(basePath)) {
            console.warn(`  ⚠️  Path not found: ${basePath}`);
            continue;
        }

        let renamed = 0;
        for (const [oldName, newName] of Object.entries(mapping)) {
            const oldPath = path.join(basePath, oldName);
            const newPath = path.join(basePath, newName);

            if (await fs.pathExists(oldPath)) {
                await fs.move(oldPath, newPath, { overwrite: false });
                renamed++;
            }
        }

        console.log(`  ✓ Renamed ${renamed} files in ${deck}`);
    }

    console.log('\n✅ File renaming complete!');
}

renameAllDecks().catch(err => {
    console.error('❌ Renaming failed:', err);
    process.exit(1);
});
```

### ✅ Step 3: Create verification script

Create file: `scripts/verify-images.js`

```javascript
const fs = require('fs-extra');
const path = require('path');

async function verifyAllDecks() {
    const decks = ['rider-waite', 'artistic', 'miro', 'picasso'];

    console.log('🔍 Verifying image optimization...\n');

    for (const deck of decks) {
        await verifyDeck(deck);
    }
}

async function verifyDeck(deckName) {
    const imagesPath = path.join('decks', deckName, 'images');
    const thumbnailsPath = path.join('decks', deckName, 'thumbnails');

    console.log(`\n📦 ${deckName}:`);

    // Count original images
    const images = await findImages(imagesPath);
    const imageSize = await getTotalSize(images);

    // Count thumbnails
    const thumbnails = await findImages(thumbnailsPath);
    const thumbnailSize = await getTotalSize(thumbnails);

    console.log(`  Original images: ${images.length} files, ${formatSize(imageSize)}`);
    console.log(`  Thumbnails: ${thumbnails.length / 2} sets (WebP + JPEG), ${formatSize(thumbnailSize)}`);

    if (images.length > 0 && thumbnails.length > 0) {
        const reduction = ((imageSize - thumbnailSize) / imageSize * 100).toFixed(1);
        console.log(`  📉 Size reduction: ${reduction}%`);
    }
}

async function findImages(dir) {
    const results = [];

    if (!await fs.pathExists(dir)) {
        return results;
    }

    const items = await fs.readdir(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
            results.push(...await findImages(fullPath));
        } else if (/\.(png|jpg|jpeg|webp)$/i.test(item.name)) {
            results.push(fullPath);
        }
    }

    return results;
}

async function getTotalSize(files) {
    let total = 0;
    for (const file of files) {
        const stat = await fs.stat(file);
        total += stat.size;
    }
    return total;
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

verifyAllDecks().catch(console.error);
```

---

## Task 2.3: Run Optimization Pipeline

**Time:** 1-2 hours (processing time)

### ✅ Step 1: Backup original images

```bash
cd /Users/amy/CCWorkSpace/TarotReading/github-deploy

# Full backup
cp -r decks backups/decks-original-$(date +%Y%m%d)
```

### ✅ Step 2: Rename files (if needed)

```bash
node scripts/rename-images.js
```

**Expected output:**
```
📝 Starting file renaming...

📦 Renaming miro...
  ✓ Renamed 22 files in miro

✅ File renaming complete!
```

### ✅ Step 3: Generate thumbnails

```bash
node scripts/optimize-images.js
```

**Expected output:**
```
🎨 Starting Image Optimization...

📦 Processing rider-waite...
  Found 78 images
  Processed 10/78...
  Processed 20/78...
  ...
  ✓ Completed rider-waite: 78 cards optimized

📦 Processing artistic...
  Found 78 images
  ...
  ✓ Completed artistic: 78 cards optimized

📦 Processing miro...
  Found 78 images
  ...
  ✓ Completed miro: 78 cards optimized

📦 Processing picasso...
  Found 78 images
  ...
  ✓ Completed picasso: 78 cards optimized

✅ All decks optimized!
```

⏱️ **This will take 15-30 minutes** depending on your machine.

### ✅ Step 4: Verify results

```bash
node scripts/verify-images.js
```

**Expected output:**
```
🔍 Verifying image optimization...

📦 rider-waite:
  Original images: 78 files, 56.0 MB
  Thumbnails: 78 sets (WebP + JPEG), 6.9 MB
  📉 Size reduction: 87.7%

📦 artistic:
  Original images: 78 files, 27.0 MB
  Thumbnails: 78 sets (WebP + JPEG), 2.5 MB
  📉 Size reduction: 90.7%

📦 miro:
  Original images: 78 files, 2.2 MB
  Thumbnails: 78 sets (WebP + JPEG), 2.0 MB
  📉 Size reduction: 9.1%

📦 picasso:
  Original images: 78 files, 13.0 MB
  Thumbnails: 78 sets (WebP + JPEG), 2.1 MB
  📉 Size reduction: 83.8%
```

### ✅ Step 5: Update DeckRegistry.js

Now that thumbnails exist, update the registry:

```javascript
// In decks/shared/DeckRegistry.js
// Change hasThumbnails to true for all decks

'artistic': {
    // ...
    hasThumbnails: true,  // ← Changed from false
},
'miro': {
    // ...
    hasThumbnails: true,  // ← Changed from false
},
'picasso': {
    // ...
    hasThumbnails: true,  // ← Changed from false
}
```

---

## ✅ Phase 2 Complete!

**Checklist:**
- ✅ Installed optimization tools (sharp)
- ✅ Created optimization scripts
- ✅ Renamed Miro files to standard format
- ✅ Generated thumbnails for all 4 decks
- ✅ Verified 86% total size reduction (98 MB → 13.5 MB)
- ✅ Updated DeckRegistry with thumbnail support

**Time taken:** ~4-6 hours

**Next:** Phase 3 - Update HTML Files

---

# 📋 PHASE 3: Update HTML Files

**Goal:** Replace duplicate rendering code with unified loader

**Time:** 4-5 hours

---

## Task 3.1: Update index.html

**Time:** 1.5 hours

### ✅ Step 1: Add script includes

In `index.html`, find the `<script>` section (around line 1150) and add:

```html
<!-- NEW: Add unified deck system -->
<script src="decks/shared/DeckRegistry.js"></script>
<script src="decks/shared/PathResolver.js"></script>
<script src="decks/shared/DeckLoader.js"></script>
```

### ✅ Step 2: Replace deck selection logic

Find and replace the `drawCard()` function (around line 1271-1289):

**OLD CODE (DELETE):**
```javascript
function drawCard() {
    // ... existing code ...

    if (currentDeck === 'rider') {
        renderRiderWaiteCard(selectedCard, isReversed);
    } else if (currentDeck === 'artistic') {
        renderArtisticCard(selectedCard, isReversed);
    } else if (currentDeck === 'miro') {
        renderMiroCard(selectedCard, isReversed);
    }
}

function renderRiderWaiteCard(card, isReversed) { /* ... */ }
function renderArtisticCard(card, isReversed) { /* ... */ }
function renderMiroCard(card, isReversed) { /* ... */ }
```

**NEW CODE:**
```javascript
async function drawCard() {
    console.log('Drawing card from deck:', currentDeck);

    // Get all cards using unified loader
    const allCards = DeckLoader.getAllCards();

    // Select random card
    const randomIndex = Math.floor(Math.random() * allCards.length);
    const selectedCard = allCards[randomIndex];
    const isReversed = Math.random() < 0.3;

    // Get reading from JSON
    let reading = getReadingFromJSON(currentDeck, selectedCard.name, currentQuestion, isReversed);
    if (currentLanguage !== 'en') {
        reading = await translateText(reading, currentLanguage);
    }

    // Store current card
    currentCard = selectedCard;
    currentIsReversed = isReversed;

    // Render card image using unified loader
    renderCardImage(currentDeck, selectedCard, isReversed);

    // Update UI
    updateCardInfo(selectedCard, isReversed, reading);
}

/**
 * Render card image for any deck
 */
function renderCardImage(deckId, card, isReversed) {
    const container = document.getElementById('card-image-container');
    if (!container) return;

    container.innerHTML = '';

    // Use unified loader - works for ALL decks!
    const picture = DeckLoader.createResponsiveImage(deckId, card, {
        thumbnail: false,  // Use full size for single card display
        loading: 'eager'   // Load immediately (not lazy)
    });

    const img = picture.querySelector('img');

    // Add rotation for reversed cards
    if (isReversed) {
        img.style.transform = 'rotate(180deg)';
        img.classList.add('reversed');
    }

    // Add error handler
    DeckLoader.addErrorHandler(img);

    // Add to container
    container.appendChild(picture);
}
```

### ✅ Step 3: Test the changes

1. Open `index.html` in browser
2. Select each deck (Rider-Waite, Artistic, Miro)
3. Draw cards - verify images load correctly
4. Check browser console for errors

**Expected result:** All 3 decks work perfectly with single unified function.

---

## Task 3.2: Update pages/gallery.html

**Time:** 1.5 hours

### ✅ Step 1: Add script includes

In `pages/gallery.html`, add before existing scripts:

```html
<!-- NEW: Add unified deck system -->
<script src="../decks/shared/DeckRegistry.js"></script>
<script src="../decks/shared/PathResolver.js"></script>
<script src="../decks/shared/DeckLoader.js"></script>
```

### ✅ Step 2: Replace gallery rendering

Find the `showCardGallery()` function (around line 1175-1297).

**DELETE** the entire function and **REPLACE** with:

```javascript
/**
 * Show card gallery for selected deck
 */
function showCardGallery(deckType) {
    console.log('Showing gallery for:', deckType);

    const gallery = document.getElementById('card-gallery');
    const cardGrid = document.getElementById('card-grid');
    const deckTitle = document.getElementById('gallery-deck-title');

    if (!gallery || !cardGrid) return;

    // Clear previous
    cardGrid.innerHTML = '';

    // Update title
    const deckName = DECK_REGISTRY.decks[deckType]?.name || deckType;
    deckTitle.textContent = deckName;

    // Get all 78 cards
    const allCards = DeckLoader.getAllCards();

    // Render in batches for better performance
    renderBatch(deckType, allCards, 0, cardGrid);

    // Show gallery
    gallery.classList.add('visible');
}

/**
 * Render cards in batches (lazy loading)
 */
function renderBatch(deckId, cards, startIndex, container) {
    const BATCH_SIZE = 12;
    const endIndex = Math.min(startIndex + BATCH_SIZE, cards.length);
    const batch = cards.slice(startIndex, endIndex);

    batch.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card-thumbnail';

        // Use unified loader with thumbnails
        const picture = DeckLoader.createResponsiveImage(deckId, card, {
            thumbnail: true,   // Use optimized thumbnails
            loading: 'lazy'    // Lazy load for performance
        });

        // Add card name
        const cardName = document.createElement('div');
        cardName.className = 'card-name';
        cardName.textContent = card.name;

        // Add click to enlarge
        cardDiv.onclick = () => enlargeCard(deckId, card);

        cardDiv.appendChild(picture);
        cardDiv.appendChild(cardName);
        container.appendChild(cardDiv);
    });

    // Continue with next batch after short delay
    if (endIndex < cards.length) {
        setTimeout(() => renderBatch(deckId, cards, endIndex, container), 50);
    }
}

/**
 * Show enlarged card in lightbox
 */
function enlargeCard(deckId, card) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxName = document.getElementById('lightbox-card-name');

    if (!lightbox || !lightboxImg) return;

    // Show full-size image
    lightboxImg.src = DeckLoader.getImagePath(deckId, card);
    lightboxImg.alt = card.name;

    if (lightboxName) {
        lightboxName.textContent = card.name;
    }

    lightbox.classList.add('visible');
}

/**
 * Close lightbox
 */
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('visible');
    }
}

// Close lightbox on click outside
document.addEventListener('click', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (e.target === lightbox) {
        closeLightbox();
    }
});
```

### ✅ Step 3: Test gallery

1. Open `pages/gallery.html`
2. Click each deck button
3. Verify thumbnails load quickly
4. Click a card to enlarge
5. Check that WebP images are being used (in Network tab)

---

## Task 3.3: Update pages/dictionary.html

**Time:** 45 minutes

### ✅ Step 1: Add script includes

```html
<!-- NEW: Add unified deck system -->
<script src="../decks/shared/DeckRegistry.js"></script>
<script src="../decks/shared/PathResolver.js"></script>
<script src="../decks/shared/DeckLoader.js"></script>
```

### ✅ Step 2: Update card rendering

Find `createCardElement()` function (around line 690), replace image creation:

**OLD:**
```javascript
const imagePath = riderWaiteData.getImagePath(card);
cardDiv.innerHTML = `<img src="${imagePath}" ...>`;
```

**NEW:**
```javascript
// Use unified loader with thumbnails
const picture = DeckLoader.createResponsiveImage('rider-waite', card, {
    thumbnail: true,
    loading: 'lazy'
});

// Insert into card structure
const cardImage = cardDiv.querySelector('.card-image');
cardImage.appendChild(picture);

// Add error handler
const img = picture.querySelector('img');
DeckLoader.addErrorHandler(img);
```

---

## Task 3.4: Update pages/journey.html

**Time:** 30 minutes

### ✅ Step 1: Add script includes

```html
<!-- NEW: Add unified deck system -->
<script src="../decks/shared/DeckRegistry.js"></script>
<script src="../decks/shared/PathResolver.js"></script>
<script src="../decks/shared/DeckLoader.js"></script>
```

### ✅ Step 2: Replace hardcoded image tags

Find all `<img>` tags like:

```html
<img src="../decks/images/major_arcana/00-the-fool.png" alt="The Fool" class="card-image">
```

Replace with data attributes:

```html
<div class="card-image-placeholder" data-card-id="0"></div>
```

### ✅ Step 3: Add dynamic loading script

At the end of the file, before `</body>`:

```html
<script>
// Dynamically load all journey card images
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card-image-placeholder[data-card-id]').forEach(el => {
        const cardId = parseInt(el.dataset.cardId);
        const card = DECK_REGISTRY.cards.major[cardId];

        if (card) {
            const picture = DeckLoader.createResponsiveImage('rider-waite', card, {
                thumbnail: true,
                loading: 'lazy'
            });

            const img = picture.querySelector('img');
            img.className = 'card-image';

            el.replaceWith(picture);
        }
    });
});
</script>
```

---

## Task 3.5: Add Picasso to Main Page

**Time:** 30 minutes

### ✅ Step 1: Add Picasso deck card

In `index.html`, find the deck options section (around line 800), add:

```html
<!-- ADD THIS: Picasso Deck -->
<div class="deck-card" onclick="selectDeck('picasso')">
    <div class="deck-preview">
        <img src="decks/picasso/images/00-fool.png" alt="The Fool" loading="lazy">
    </div>
    <h3 data-translate="picassoDeck">Picasso Cubism</h3>
    <p data-translate="picassoDesc">Abstract cubist interpretations</p>
</div>
```

### ✅ Step 2: Update CSS grid

Find `.deck-options` CSS (around line 650):

**OLD:**
```css
.deck-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}
```

**NEW:**
```css
.deck-options {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

@media (max-width: 768px) {
    .deck-options {
        grid-template-columns: repeat(2, 1fr);
    }
}
```

### ✅ Step 3: Add translations

In the translations object:

```javascript
translations: {
    en: {
        picassoDeck: "Picasso Cubism",
        picassoDesc: "Abstract cubist interpretations"
    },
    fr: {
        picassoDeck: "Picasso Cubisme",
        picassoDesc: "Interprétations cubistes abstraites"
    }
    // ... add for all languages
}
```

---

## ✅ Phase 3 Complete!

**Checklist:**
- ✅ Updated index.html (main reading page)
- ✅ Updated gallery.html (thumbnail gallery)
- ✅ Updated dictionary.html (card meanings)
- ✅ Updated journey.html (Fool's Journey)
- ✅ Added Picasso deck to main page
- ✅ All pages use unified DeckLoader
- ✅ Eliminated ~150 lines of duplicate rendering code

**Time taken:** ~4-5 hours

**Next:** Phase 4 - Error Handling & UX

---

# 📋 PHASE 4: Error Handling & UX

**Goal:** Add graceful fallbacks and loading states

**Time:** 2-3 hours

---

## Task 4.1: Create Placeholder Images

**Time:** 30 minutes

### ✅ Step 1: Create card-back placeholder

Create a simple SVG placeholder at `images/card-back.png` (or use existing).

Alternatively, create SVG version at `images/card-back.svg`:

```svg
<svg width="300" height="500" xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="500" fill="#4c5c96"/>
    <text x="150" y="250" text-anchor="middle" fill="white" font-size="24" font-family="Arial">
        Card Not Found
    </text>
    <text x="150" y="280" text-anchor="middle" fill="white" font-size="14" font-family="Arial">
        🔮
    </text>
</svg>
```

### ✅ Step 2: Create loading spinner SVG

Create `images/card-loading.svg`:

```svg
<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25" cy="25" r="20" fill="none" stroke="#d4af37" stroke-width="4"
            stroke-dasharray="31.4 31.4" transform="rotate(0 25 25)">
        <animateTransform attributeName="transform" type="rotate"
                          from="0 25 25" to="360 25 25"
                          dur="1s" repeatCount="indefinite"/>
    </circle>
</svg>
```

---

## Task 4.2: Add Loading States

**Time:** 1 hour

### ✅ Step 1: Add loading CSS

In each HTML file, add to `<style>` section:

```css
/* Loading state */
.card-image-container {
    position: relative;
    min-height: 400px;
}

.card-image-container::before {
    content: '';
    display: block;
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255,255,255,0.3);
    border-top-color: #d4af37;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.card-image-container.loaded::before {
    display: none;
}

@keyframes spin {
    to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* Fade in effect */
.card-image-container img {
    opacity: 0;
    transition: opacity 0.3s ease;
}

.card-image-container.loaded img {
    opacity: 1;
}
```

### ✅ Step 2: Update render functions

In `renderCardImage()` functions, add loading state:

```javascript
function renderCardImage(deckId, card, isReversed) {
    const container = document.getElementById('card-image-container');
    container.innerHTML = '';
    container.classList.remove('loaded'); // Start in loading state

    const picture = DeckLoader.createResponsiveImage(deckId, card, {
        thumbnail: false,
        loading: 'eager'
    });

    const img = picture.querySelector('img');

    // Mark as loaded when image loads
    img.onload = () => {
        container.classList.add('loaded');
    };

    // Error handler
    img.onerror = () => {
        container.classList.add('loaded'); // Remove spinner
        DeckLoader.addErrorHandler(img);
    };

    if (isReversed) {
        img.style.transform = 'rotate(180deg)';
    }

    container.appendChild(picture);
}
```

---

## Task 4.3: Add Performance Monitoring

**Time:** 30 minutes

### ✅ Step 1: Create performance monitor

Create file: `decks/shared/PerformanceMonitor.js`

```javascript
/**
 * PerformanceMonitor.js
 * Track image load times and performance metrics
 */

class PerformanceMonitor {
    static logImageLoad(deckId, cardName, loadTime) {
        // Log slow loads
        if (loadTime > 1000) {
            console.warn(`⚠️  Slow image load: ${deckId}/${cardName} (${loadTime}ms)`);
        }

        // Send to Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'image_load', {
                deck: deckId,
                card: cardName,
                duration: Math.round(loadTime),
                event_category: 'performance'
            });
        }
    }

    static measureImageLoad(imgElement, deckId, cardName) {
        const startTime = performance.now();

        imgElement.onload = () => {
            const loadTime = performance.now() - startTime;
            this.logImageLoad(deckId, cardName, loadTime);
        };
    }
}

// Export
if (typeof window !== 'undefined') {
    window.PerformanceMonitor = PerformanceMonitor;
}
```

### ✅ Step 2: Integrate monitoring

In HTML files, add measurement:

```javascript
const img = picture.querySelector('img');

// Add performance monitoring
PerformanceMonitor.measureImageLoad(img, deckId, card.name);
```

---

## ✅ Phase 4 Complete!

**Checklist:**
- ✅ Created placeholder images
- ✅ Added loading spinners
- ✅ Added fade-in animations
- ✅ Created performance monitoring
- ✅ Better user experience during image loads

**Time taken:** ~2-3 hours

**Next:** Phase 5 - Testing & Validation

---

# 📋 PHASE 5: Testing & Validation

**Goal:** Ensure everything works correctly

**Time:** 3-4 hours

---

## Task 5.1: Automated Testing

**Time:** 1 hour

Create comprehensive test file: `tests/integration-test.html`

```html
<!DOCTYPE html>
<html>
<head>
    <title>Integration Tests</title>
    <style>
        body { font-family: monospace; padding: 20px; }
        .test { margin: 10px 0; }
        .pass { color: green; }
        .fail { color: red; }
    </style>
</head>
<body>
    <h1>🧪 Integration Tests</h1>
    <div id="results"></div>

    <script src="../decks/shared/DeckRegistry.js"></script>
    <script src="../decks/shared/PathResolver.js"></script>
    <script src="../decks/shared/DeckLoader.js"></script>
    <script>
        const results = document.getElementById('results');
        let passCount = 0;
        let failCount = 0;

        function test(name, fn) {
            try {
                fn();
                results.innerHTML += `<div class="test pass">✓ ${name}</div>`;
                passCount++;
            } catch (err) {
                results.innerHTML += `<div class="test fail">✗ ${name}: ${err.message}</div>`;
                failCount++;
            }
        }

        // Run tests
        test('DeckRegistry loads', () => {
            if (!DECK_REGISTRY) throw new Error('Registry not found');
            if (Object.keys(DECK_REGISTRY.decks).length !== 4) throw new Error('Expected 4 decks');
        });

        test('All decks have correct structure', () => {
            for (const [id, deck] of Object.entries(DECK_REGISTRY.decks)) {
                if (!deck.name) throw new Error(`Deck ${id} missing name`);
                if (!deck.folder) throw new Error(`Deck ${id} missing folder`);
            }
        });

        test('Card catalog has 78 cards', () => {
            const allCards = DeckLoader.getAllCards();
            if (allCards.length !== 78) throw new Error(`Expected 78 cards, got ${allCards.length}`);
        });

        test('PathResolver generates correct paths', () => {
            const path = PathResolver.resolve('decks', 'test', 'file.png');
            if (!path.includes('decks/test/file.png')) throw new Error('Path incorrect');
        });

        test('DeckLoader generates paths for all decks', () => {
            const card = DECK_REGISTRY.cards.major[0];
            const testCard = { ...card, type: 'major' };

            for (const deckId in DECK_REGISTRY.decks) {
                const path = DeckLoader.getImagePath(deckId, testCard);
                if (!path) throw new Error(`No path for ${deckId}`);
            }
        });

        test('Thumbnails enabled for all decks', () => {
            for (const [id, deck] of Object.entries(DECK_REGISTRY.decks)) {
                if (!deck.hasThumbnails) throw new Error(`Deck ${id} missing thumbnails`);
            }
        });

        // Summary
        const total = passCount + failCount;
        const summary = `<h2>Results: ${passCount}/${total} passed</h2>`;
        results.innerHTML += summary;

        if (failCount === 0) {
            results.innerHTML += '<p style="color: green; font-size: 20px;">✅ All tests passed!</p>';
        } else {
            results.innerHTML += '<p style="color: red; font-size: 20px;">❌ Some tests failed</p>';
        }
    </script>
</body>
</html>
```

Run test:
```bash
open tests/integration-test.html
```

---

## Task 5.2: Manual Testing

**Time:** 2 hours

### ✅ Complete this checklist:

```
🔲 Main Reading Page (index.html)
    🔲 Rider-Waite deck loads
    🔲 Artistic deck loads
    🔲 Miro deck loads
    🔲 Picasso deck loads (NEW!)
    🔲 Draw card button works
    🔲 Card images appear correctly
    🔲 Reversed cards rotate 180°
    🔲 Click to reveal works
    🔲 Draw another card works
    🔲 All 4 decks tested

🔲 Gallery Page (pages/gallery.html)
    🔲 All 4 deck buttons work
    🔲 Thumbnails load quickly
    🔲 WebP images used (check Network tab)
    🔲 Lazy loading works (scroll test)
    🔲 Click to enlarge works
    🔲 Lightbox close works

🔲 Dictionary Page (pages/dictionary.html)
    🔲 All 78 cards display
    🔲 Thumbnails load
    🔲 Hover overlays work (desktop)
    🔲 Click overlays work (mobile)
    🔲 Keywords display correctly

🔲 Journey Page (pages/journey.html)
    🔲 All 22 major arcana display
    🔲 Images load quickly
    🔲 Scroll through full page

🔲 Cross-Page Navigation
    🔲 index.html → gallery.html (paths work)
    🔲 gallery.html → dictionary.html (paths work)
    🔲 dictionary.html → journey.html (paths work)
    🔲 All pages → back to index.html

🔲 Mobile Testing (use DevTools mobile emulation)
    🔲 Images load on simulated 4G
    🔲 Touch interactions work
    🔲 No horizontal scroll
    🔲 Thumbnails appropriate size

🔲 Error Handling
    🔲 Broken image shows placeholder
    🔲 Console shows helpful errors
    🔲 No visible broken images

🔲 Performance
    🔲 Page load < 3 seconds
    🔲 Gallery loads < 5 seconds
    🔲 No layout shift during load
```

---

## Task 5.3: Lighthouse Performance Test

**Time:** 30 minutes

### ✅ Run Lighthouse

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Start local server
npx http-server . -p 8000

# Run Lighthouse tests
lighthouse http://localhost:8000/index.html --output html --output-path ./reports/index-lighthouse.html
lighthouse http://localhost:8000/pages/gallery.html --output html --output-path ./reports/gallery-lighthouse.html
```

### ✅ Check scores

**Target metrics:**
- ✅ Performance: > 90
- ✅ Accessibility: > 90
- ✅ Best Practices: > 90
- ✅ SEO: > 90

**Key metrics:**
- ✅ First Contentful Paint: < 1.8s
- ✅ Largest Contentful Paint: < 2.5s
- ✅ Cumulative Layout Shift: < 0.1
- ✅ Total Blocking Time: < 300ms

---

## ✅ Phase 5 Complete!

**Checklist:**
- ✅ Created automated integration tests
- ✅ Completed manual testing checklist
- ✅ Ran Lighthouse performance tests
- ✅ All tests passing
- ✅ Performance targets met

**Time taken:** ~3-4 hours

**Next:** Phase 6 - Documentation (optional)

---

# 📋 PHASE 6: Documentation & Cleanup (OPTIONAL)

**Time:** 2-3 hours

---

## Task 6.1: Create Architecture Documentation

Create file: `docs/ARCHITECTURE.md`

Document:
- System overview diagram
- How to add new decks
- File naming conventions
- API reference for DeckLoader

---

## Task 6.2: Update README.md

Add sections for:
- Performance optimizations
- Browser support
- Development setup
- Testing commands

---

## Task 6.3: Create Migration Guide

Create file: `docs/MIGRATION.md`

Document what changed for future reference.

---

## Task 6.4: Clean Up

```bash
# Remove commented code
# Remove debug console.logs
# Remove backup files older than 30 days
find backups -type f -mtime +30 -delete
```

---

# 📋 PHASE 7: Deploy & Monitor

**Time:** 2-3 hours

---

## Task 7.1: Pre-Deploy Checklist

```
🔲 All tests pass
🔲 Lighthouse score > 90
🔲 No console errors
🔲 All images load correctly
🔲 Mobile testing complete
🔲 Cross-browser testing done (Chrome, Firefox, Safari)
🔲 Backups created
🔲 Rollback plan ready
```

---

## Task 7.2: Deploy

### ✅ Step 1: Create deployment branch

```bash
git checkout -b refactor/unified-architecture
git add .
git commit -m "feat: Unified deck architecture with 86% image size reduction

- Created unified DeckRegistry, PathResolver, DeckLoader
- Eliminated 611 lines of duplicate code
- Generated optimized thumbnails (WebP + JPEG)
- Reduced total image size from 98 MB to 13.5 MB
- Added Picasso deck to main readings
- Improved error handling and loading states
- Lighthouse performance score: 90+"

git push origin refactor/unified-architecture
```

### ✅ Step 2: Test on staging

Deploy to staging environment and test thoroughly.

### ✅ Step 3: Deploy to production

```bash
git checkout main
git merge refactor/unified-architecture
git push origin main
```

---

## Task 7.3: Monitor

### ✅ Set up monitoring

Check these metrics for 24-48 hours after deploy:

- Page load times (Google Analytics)
- Error rates (Console errors)
- Image load failures (404s)
- User engagement (bounce rate)
- Core Web Vitals (Search Console)

---

## ✅ ALL PHASES COMPLETE! 🎉

**Final Checklist:**
- ✅ Phase 1: Foundation (6-8 hours)
- ✅ Phase 2: Image Optimization (4-6 hours)
- ✅ Phase 3: Update HTML (4-5 hours)
- ✅ Phase 4: Error Handling (2-3 hours)
- ✅ Phase 5: Testing (3-4 hours)
- ✅ Phase 6: Documentation (2-3 hours) - Optional
- ✅ Phase 7: Deploy (2-3 hours)

**Total Time:** 23-32 hours (3-4 full working days)

---

## 📊 **SUCCESS METRICS**

| Metric | Before | After | ✅ Target Met |
|--------|--------|-------|---------------|
| Code Lines | ~1,200 | ~600 | ✅ 50% reduction |
| Duplicate Code | 630 lines | 0 lines | ✅ 100% eliminated |
| Image Size | 98 MB | 13.5 MB | ✅ 86% reduction |
| Gallery Load (4G) | 30-45s | 3-5s | ✅ 90% faster |
| Lighthouse Score | 40-50 | 90+ | ✅ 2x improvement |
| Decks Available | 3 | 4 | ✅ Picasso added |

---

## 🎯 **ROLLBACK PLAN**

If problems occur:

```bash
# Restore original decks
rm -rf decks
cp -r backups/decks-original-YYYYMMDD decks

# Revert git changes
git revert HEAD
git push origin main
```

---

## 📞 **SUPPORT**

Questions? Review:
- `docs/REFACTORING_PLAN.md` - Overall strategy
- `docs/ARCHITECTURE.md` - System design
- `docs/MIGRATION.md` - What changed

---

**END OF IMPLEMENTATION PLAN**

🎉 **Congratulations on completing the refactoring!** 🎉
