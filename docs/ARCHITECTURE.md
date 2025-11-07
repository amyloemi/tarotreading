# 🏗️ Architecture Documentation

**Version:** 2.0 (Post-Refactoring)
**Last Updated:** November 7, 2025
**Status:** Production Ready

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Core Components](#core-components)
3. [Data Architecture](#data-architecture)
4. [Image Loading System](#image-loading-system)
5. [How to Add a New Deck](#how-to-add-a-new-deck)
6. [File Structure](#file-structure)
7. [Performance Optimizations](#performance-optimizations)
8. [API Reference](#api-reference)

---

## 🎯 System Overview

The Tarot Reading application uses a **unified deck system** that manages all tarot decks (Rider-Waite, Artistic, Miró, Picasso) through a centralized architecture. This eliminates code duplication and provides consistent image loading, path resolution, and error handling across all pages.

### Key Principles

1. **Single Source of Truth** - All deck metadata in `DeckRegistry.js`
2. **Location-Aware Paths** - Automatic path resolution for root vs. `/pages/` subfolder
3. **Progressive Enhancement** - WebP with JPEG fallback, lazy loading
4. **Graceful Degradation** - Error handling with placeholder images
5. **Performance First** - Thumbnails (3-46KB) vs full-size images (170-700KB)

---

## 🧩 Core Components

### 1. DeckRegistry.js

**Location:** `decks/shared/DeckRegistry.js`
**Size:** 170 lines
**Purpose:** Single source of truth for all deck configurations and card catalog

**Features:**
- Metadata for all 4 decks (name, folder, formats, structure)
- Complete catalog of all 78 tarot cards (22 Major + 56 Minor Arcana)
- Deck-specific configuration (folder structure, suit order, numbering offsets)
- Thumbnail folder mappings

**Structure:**
```javascript
const DECK_REGISTRY = {
    decks: {
        'rider-waite': {
            name: 'Rider-Waite',
            folder: 'images',
            thumbnailFolder: 'images-thumbnails',
            formats: ['png', 'webp', 'jpg'],
            structure: {
                hasMajorArcanaFolder: true,    // Uses major_arcana/ subfolder
                hasMinorArcanaFolder: true,     // Uses minor_arcana/ subfolder
                suitOrder: ['cups', 'pentacles', 'swords', 'wands']
            }
        },
        'artistic': { /* ... */ },
        'miro': { /* ... */ },
        'picasso': { /* ... */ }
    },
    cards: {
        major: [ /* 22 cards */ ],
        minor: {
            cups: [ /* 14 cards */ ],
            pentacles: [ /* 14 cards */ ],
            swords: [ /* 14 cards */ ],
            wands: [ /* 14 cards */ ]
        }
    }
};
```

**Adding Deck-Specific Quirks:**
- **Rider-Waite:** Uses `major_arcana/` and `minor_arcana/` subfolders
- **Artistic:** Non-standard suit order (wands first)
- **Miró:** Standard suit order (cups first)
- **Picasso:** Flat structure with `numberingOffset: 1` (files numbered 1-78 instead of 0-77)

---

### 2. PathResolver.js

**Location:** `decks/shared/PathResolver.js`
**Size:** 72 lines
**Purpose:** Location-aware path resolution for root and subfolder pages

**Key Methods:**
```javascript
// Detect if in /pages/ subfolder or root
PathResolver.getBasePath()       // Returns '' or '../'

// Build paths from components
PathResolver.resolve('decks', 'images', 'foo.png')
// → Root: 'decks/images/foo.png'
// → Pages: '../decks/images/foo.png'

// Check current location
PathResolver.isInSubfolder()     // Returns boolean
PathResolver.getCurrentPage()     // Returns page name
```

**How It Works:**
1. Detects `file://` vs `http(s)://` protocol
2. Checks if current path includes `/pages/`
3. Returns appropriate base path for resolution
4. Eliminates hardcoded paths across the codebase

---

### 3. DeckLoader.js

**Location:** `decks/shared/DeckLoader.js`
**Size:** 335 lines
**Purpose:** Universal image loading for all decks with thumbnails and fallbacks

**Key Methods:**
```javascript
// Get image path for a card
DeckLoader.getImagePath(deckId, card, options)
// Returns: 'decks/images/major_arcana/00-the-fool.png'

// Get optimized thumbnail path
DeckLoader.getThumbnailPath(deckId, card, format)
// Returns: 'decks/images-thumbnails/major_arcana/00-the-fool.webp'

// Create responsive <picture> element
DeckLoader.createResponsiveImage(deckId, card, {
    thumbnail: true,
    loading: 'lazy',
    className: 'card-image'
});
// Returns: <picture> with WebP + JPEG fallback

// Get all 78 cards
DeckLoader.getAllCards()

// Lookup cards
DeckLoader.getCardByName('The Fool')
DeckLoader.getCardById(0)

// Error handling
DeckLoader.addErrorHandler(imgElement, 'images/card-back.svg')

// Performance
DeckLoader.preloadImage(deckId, card)
```

**Special Features:**

1. **Rider-Waite Filename Transformation**
   ```javascript
   // Handles word-form to numeric conversion
   'two-of-cups' → '2-of-cups'
   'page-of-wands' → '11-of-wands'
   'knight-of-swords' → '12-of-swords'
   ```

2. **Responsive Image Generation**
   ```html
   <picture>
       <source srcset="path/card.webp" type="image/webp">
       <img src="path/card.jpg" loading="lazy" alt="The Fool">
   </picture>
   ```

3. **Debug Mode**
   ```javascript
   window.DEBUG_DECK_LOADER = true;
   // Logs all path resolutions and transformations
   ```

---

## 📊 Data Architecture

### Card Meanings System

**Location:** `decks/data/card-meanings.json`
**Size:** 11KB
**Format:** JSON

**Structure:**
```json
{
    "major_arcana": [
        {
            "number": 0,
            "name": "The Fool",
            "upright": "innocence, new beginnings, free spirit",
            "reversed": "recklessness, taken advantage of, inconsideration"
        }
    ],
    "minor_arcana": {
        "cups": [ /* ... */ ],
        "pentacles": [ /* ... */ ],
        "swords": [ /* ... */ ],
        "wands": [ /* ... */ ]
    }
}
```

**Loader:** `decks/data/card-meanings-loader.js`
- Async `fetch()` of JSON data
- Populates `window.cardMeanings`
- Backward compatibility: Also sets `riderWaiteData.meanings`

**Usage:**
```javascript
// Access meanings
const fool = cardMeanings.major_arcana[0];
console.log(fool.upright); // "innocence, new beginnings, free spirit"

// Backward compatible
const meaning = riderWaiteData.meanings.major_arcana.find(c => c.name === 'The Fool');
```

---

## 🖼️ Image Loading System

### Thumbnail Strategy

**File Sizes:**
- **Rider-Waite:** 40-46 KB (WebP/JPG)
- **Artistic:** 6-8 KB (WebP/JPG)
- **Miró:** 4-8 KB (WebP/JPG)
- **Picasso:** 3-8 KB (WebP/JPG)

**Total Reduction:** 98 MB → 13.5 MB (86% reduction)

### Loading Strategy

```javascript
// 1. Determine if thumbnail or full-size
const useThumbnail = true;

// 2. Create responsive image with fallback
const picture = DeckLoader.createResponsiveImage(deckId, card, {
    thumbnail: useThumbnail,
    loading: 'lazy'  // Lazy load off-screen images
});

// 3. Add error handler
DeckLoader.addErrorHandler(picture.querySelector('img'));

// 4. Append to DOM
container.appendChild(picture);
```

### Error Handling

**Placeholder Images:**
- `images/card-back.svg` - Generic tarot card back (1.2KB)
- `images/loading-spinner.svg` - Loading animation (479B)

**Implementation:**
```javascript
// Automatic fallback on error
DeckLoader.addErrorHandler(imgElement, 'images/card-back.svg');

// Custom placeholder
DeckLoader.addErrorHandler(imgElement, 'path/to/custom-placeholder.png');
```

---

## 🔧 How to Add a New Deck

### Step 1: Prepare Images

**Required Structure:**
```
decks/
└── {deck-name}/
    ├── images/
    │   ├── 00-the-fool.png
    │   ├── 01-the-magician.png
    │   └── ... (78 total)
    └── thumbnails/
        ├── 00-the-fool.webp
        ├── 00-the-fool.jpg
        └── ... (156 total)
```

**Image Requirements:**
- **Full-size:** PNG format, any resolution
- **Thumbnails:** WebP + JPEG, 300-400px width, 30-50KB target

### Step 2: Update DeckRegistry

**File:** `decks/shared/DeckRegistry.js`

Add new deck configuration:
```javascript
const DECK_REGISTRY = {
    decks: {
        // Existing decks...

        'your-deck-name': {
            name: 'Your Deck Display Name',
            folder: 'your-deck-images',
            thumbnailFolder: 'your-deck-thumbnails',
            formats: ['png', 'webp', 'jpg'],
            numberingOffset: 0,  // Or 1 if files numbered 1-78
            structure: {
                hasMajorArcanaFolder: false,  // true if using subfolders
                hasMinorArcanaFolder: false,
                suitOrder: ['cups', 'pentacles', 'swords', 'wands']
            }
        }
    },
    // cards catalog remains the same
};
```

### Step 3: Generate Thumbnails

```bash
# Run optimization script
node scripts/optimize-all-decks.js

# Or manually optimize specific deck
node scripts/optimize-deck.js your-deck-name
```

### Step 4: Add to UI

**Main Reading Page (index.html):**
```javascript
// Add deck selection card
<div class="deck-card" data-deck="your-deck-name">
    <img src="decks/your-deck-images/00-the-fool.png" alt="Your Deck">
    <h3>Your Deck Name</h3>
</div>
```

**Gallery Page (pages/gallery.html):**
```javascript
// Add to deck filter
<button data-deck="your-deck-name">Your Deck</button>
```

### Step 5: Test

1. Load main reading page - verify deck appears
2. Generate reading - verify cards display correctly
3. Load gallery - verify all 78 cards render
4. Test on mobile - verify thumbnails load quickly
5. Test error handling - rename an image file, verify placeholder shows

**Estimated Time:** 30 minutes (vs. 4 hours before refactoring)

---

## 📁 File Structure

```
project-root/
├── index.html                       # Main reading page
├── pages/
│   ├── dictionary.html             # Card meanings reference
│   ├── gallery.html                # Browse all cards
│   └── journey.html                # Fool's journey
│
├── decks/
│   ├── shared/                     # Unified system (NEW)
│   │   ├── DeckRegistry.js         # Single source of truth
│   │   ├── PathResolver.js         # Location-aware paths
│   │   ├── DeckLoader.js           # Universal image loader
│   │   └── PerformanceMonitor.js   # Performance tracking
│   │
│   ├── data/                       # Centralized data (NEW)
│   │   ├── card-meanings.json      # All card meanings
│   │   ├── card-meanings-loader.js # Async JSON loader
│   │   ├── card-descriptions.js    # Story descriptions
│   │   └── card-keyword-translations.json
│   │
│   ├── images/                     # Rider-Waite full-size
│   │   ├── major_arcana/
│   │   └── minor_arcana/
│   ├── images-thumbnails/          # Rider-Waite thumbnails
│   │   ├── major_arcana/
│   │   └── minor_arcana/
│   │
│   ├── artistic-tarot-cards/       # Artistic full-size
│   ├── artistic-tarot-cards-thumbnails/
│   ├── miro-tarot-cards/
│   ├── miro-tarot-cards-thumbnails/
│   ├── picasso-tarot-cards/
│   └── picasso-tarot-cards-thumbnails/
│
├── images/
│   ├── card-back.svg               # Error placeholder
│   ├── loading-spinner.svg         # Loading animation
│   └── backgrounds/
│
├── scripts/
│   ├── optimize-all-decks.js       # Batch thumbnail generation
│   └── optimize-deck.js            # Single deck optimization
│
└── docs/
    ├── ARCHITECTURE.md             # This file
    ├── REFACTORING_PLAN.md         # Original plan
    ├── REFACTORING_STATUS_REPORT.md
    └── IMPLEMENTATION_PLAN.md
```

---

## ⚡ Performance Optimizations

### 1. Thumbnail System

**Before:**
- Gallery loaded 78 full-size images (27-56 MB per deck)
- 30-45 seconds on 4G connection
- 312 images × 350-700 KB = 98 MB total

**After:**
- Gallery uses optimized thumbnails (2-7 MB per deck)
- 3-5 seconds on 4G connection
- 312 images × 3-46 KB = 13.5 MB total
- **86% reduction in image data**

### 2. Progressive Loading

**Gallery Implementation:**
```javascript
// 1. Calculate viewport size
const viewportHeight = window.innerHeight;
const cardsPerRow = 4;
const initialBatch = Math.ceil(viewportHeight / cardHeight) * cardsPerRow + 4;

// 2. Load initial batch (visible cards only)
renderCards(cards.slice(0, initialBatch));

// 3. Load remaining cards on scroll
window.addEventListener('scroll', () => {
    if (nearBottom) {
        renderCards(cards.slice(currentIndex, currentIndex + 30));
    }
});
```

**Results:**
- Initial load: 12 cards instead of 78 (6.5x faster)
- Smooth infinite scroll
- Reduced initial page weight

### 3. Batch DOM Operations

**Before (Slow):**
```javascript
cards.forEach(card => {
    container.appendChild(createCardElement(card));  // 78 reflows!
});
```

**After (Fast):**
```javascript
const fragment = document.createDocumentFragment();
cards.forEach(card => {
    fragment.appendChild(createCardElement(card));
});
container.appendChild(fragment);  // Single reflow
```

### 4. Lazy Loading

All images use `loading="lazy"` attribute:
```html
<img src="..." loading="lazy" alt="...">
```

**Benefits:**
- Off-screen images don't load until scrolled into view
- Reduces initial bandwidth usage
- Faster perceived page load

### 5. WebP with Fallback

```html
<picture>
    <source srcset="card.webp" type="image/webp">
    <img src="card.jpg" alt="...">
</picture>
```

**Results:**
- Modern browsers: WebP (smaller file size, better compression)
- Older browsers: JPEG (universal compatibility)
- Automatic format selection

---

## 📚 API Reference

### DeckRegistry

```javascript
// Access deck configuration
const deck = DECK_REGISTRY.decks['rider-waite'];
console.log(deck.name);  // "Rider-Waite Tarot"

// Get all cards
const allCards = DECK_REGISTRY.cards;

// Get specific suit
const cups = DECK_REGISTRY.cards.minor.cups;
```

### PathResolver

```javascript
// Get base path
PathResolver.getBasePath();  // '' or '../'

// Resolve path components
PathResolver.resolve('decks', 'images', 'card.png');

// Check location
PathResolver.isInSubfolder();  // true/false
PathResolver.getCurrentPage();  // 'gallery.html'
```

### DeckLoader

```javascript
// Get image path
const path = DeckLoader.getImagePath('rider-waite', {
    id: 0,
    name: 'The Fool',
    type: 'major'
});

// Get thumbnail
const thumbnail = DeckLoader.getThumbnailPath('rider-waite', card, 'webp');

// Create responsive image
const picture = DeckLoader.createResponsiveImage('rider-waite', card, {
    thumbnail: true,
    loading: 'lazy',
    className: 'card-image'
});

// Get all cards
const cards = DeckLoader.getAllCards();  // Array of 78 cards

// Lookup card
const fool = DeckLoader.getCardByName('The Fool');
const magician = DeckLoader.getCardById(1);

// Error handling
DeckLoader.addErrorHandler(imgElement);

// Preload
await DeckLoader.preloadImage('rider-waite', card);
```

### Card Meanings

```javascript
// Access meanings data (after card-meanings-loader.js loads)
const meanings = window.cardMeanings;

// Major Arcana
const fool = meanings.major_arcana[0];
console.log(fool.upright);   // "innocence, new beginnings, free spirit"
console.log(fool.reversed);  // "recklessness, taken advantage of, inconsideration"

// Minor Arcana
const aceOfCups = meanings.minor_arcana.cups[0];
```

---

## 🐛 Debugging

### Enable Debug Mode

```javascript
// In browser console or at top of script
window.DEBUG_DECK_LOADER = true;

// Shows detailed logging:
// - Path resolutions
// - Filename transformations
// - Image load attempts
// - Error messages
```

### Common Issues

**Issue:** Images not loading
- Check: Is page served from web server (not `file://`)?
- Check: Are image paths correct in browser Network tab?
- Check: Did thumbnails generate successfully?

**Issue:** Card meanings not showing
- Check: Is `card-meanings-loader.js` loaded?
- Check: Browser console for `fetch()` errors
- Check: Is page served from web server (async `fetch()` requires http)?

**Issue:** Wrong paths in subfolders
- Check: `PathResolver.getBasePath()` returns correct value
- Check: Current page location detection in PathResolver

---

## 🚀 Future Enhancements

### Planned Features

1. **Service Worker** - Offline support, cache thumbnails
2. **Progressive Web App** - Install as mobile app
3. **Image Preloading** - Predictive loading based on user behavior
4. **CDN Integration** - Serve images from CDN
5. **Automated Testing** - Unit tests for DeckLoader, PathResolver
6. **Performance Monitoring** - Track load times, errors in production

### Contributing

When adding features:
1. Update this documentation
2. Add tests if applicable
3. Follow existing patterns (DRY, single responsibility)
4. Test on multiple devices and browsers
5. Update README.md

---

## 📞 Support

**Questions about this architecture?**
- Review: `docs/REFACTORING_PLAN.md` - Original design decisions
- Review: `docs/REFACTORING_STATUS_REPORT.md` - Implementation details
- Review: `docs/IMPLEMENTATION_PLAN.md` - Step-by-step implementation

**Performance Issues?**
- Run Lighthouse audit
- Check browser Network tab for large files
- Verify thumbnails are being used (not full-size images)
- Enable `DEBUG_DECK_LOADER` for detailed logging

---

**Document Version:** 2.0
**Last Updated:** November 7, 2025
**Maintainer:** Development Team
**Status:** ✅ Production Ready
