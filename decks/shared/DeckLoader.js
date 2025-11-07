/**
 * DeckLoader.js
 * Unified image loading system for all tarot decks
 * Version: 1.0
 */

class DeckLoader {
    /**
     * Calculate the file number for a card based on deck's suit order
     * @param {object} deck - Deck configuration
     * @param {object} card - Card object
     * @returns {number} File number for the card
     */
    static getCardFileNumber(deck, card) {
        let cardNumber = card.id;

        // For minor arcana with custom suit order, recalculate based on suit position
        if (card.type === 'minor' && deck.suitOrder && card.suit) {
            // Standard registry order: cups, pentacles, swords, wands
            const standardOrder = ['cups', 'pentacles', 'swords', 'wands'];
            const customOrder = deck.suitOrder;

            // Find positions
            const standardSuitIndex = standardOrder.indexOf(card.suit);
            const customSuitIndex = customOrder.indexOf(card.suit);

            if (standardSuitIndex !== -1 && customSuitIndex !== -1) {
                // Calculate card's rank within suit (0-13)
                const cardRankInSuit = card.id - 22 - (standardSuitIndex * 14);

                // Recalculate card number based on custom suit position
                cardNumber = 22 + (customSuitIndex * 14) + cardRankInSuit;
            }
        }

        // Apply numbering offset if specified
        if (deck.numberingOffset) {
            cardNumber += deck.numberingOffset;
        }

        return cardNumber;
    }

    /**
     * Transform word-form filenames to numeric form for Rider-Waite minor arcana
     * @param {string} filename - Filename to transform
     * @returns {string} Transformed filename
     */
    static transformRiderWaiteFilename(filename) {
        const wordToNumber = {
            'two': '2',
            'three': '3',
            'four': '4',
            'five': '5',
            'six': '6',
            'seven': '7',
            'eight': '8',
            'nine': '9',
            'ten': '10'
        };

        // Check if filename starts with a word number
        for (const [word, number] of Object.entries(wordToNumber)) {
            if (filename.startsWith(word + '-')) {
                return filename.replace(word + '-', number + '-');
            }
        }

        return filename;
    }

    /**
     * Get image path for any card from any deck
     * @param {string} deckId - Deck identifier (e.g., 'rider-waite')
     * @param {object} card - Card object from registry (must have type and suit properties)
     * @param {object} options - Optional settings
     * @returns {string} Full path to image
     */
    static getImagePath(deckId, card, options = {}) {
        const deck = DECK_REGISTRY.decks[deckId];
        if (!deck) {
            console.error(`Unknown deck: ${deckId}`);
            return '';
        }

        const basePath = PathResolver.resolve('decks', deck.folder);

        // Build card number (handle deck-specific numbering and suit order)
        const cardNumber = this.getCardFileNumber(deck, card);
        const paddedNumber = String(cardNumber).padStart(2, '0');

        // Determine folder path
        let folder = '';
        if (card.type === 'major') {
            folder = deck.structure.major;
        } else if (card.type === 'minor' && card.suit) {
            folder = deck.structure.minor.replace('{suit}', card.suit);
        }

        // Build filename
        let filename;
        if (deckId === 'rider-waite') {
            // Rider-Waite: Complex naming
            if (card.type === 'minor') {
                // Minor: Transform word form to numeric (two-of-cups → 2-of-cups)
                const transformedFilename = this.transformRiderWaiteFilename(card.filename);
                filename = `${transformedFilename}.${deck.imageFormat}`;
            } else {
                // Major: prepend number (e.g., "00-the-fool.png")
                filename = `${paddedNumber}-${card.filename}.${deck.imageFormat}`;
            }
        } else {
            // Artistic/Miro/Picasso: prepend number with offset (e.g., "01-the-fool.png")
            filename = `${paddedNumber}-${card.filename}.${deck.imageFormat}`;
        }

        // Combine parts
        const parts = [basePath];
        if (folder) parts.push(folder);
        parts.push(filename);

        const finalPath = parts.join('/');

        // Debug logging (can be removed in production)
        if (window.DEBUG_DECK_LOADER) {
            console.log(`[DeckLoader] getImagePath(${deckId}, ${card.name}): ${finalPath}`);
        }

        return finalPath;
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
        if (!deck || !deck.hasThumbnails) {
            // Fallback to full size if no thumbnails
            return this.getImagePath(deckId, card);
        }

        const basePath = PathResolver.resolve('decks', deck.thumbnailFolder || 'thumbnails');

        // Build card number (handle deck-specific numbering and suit order)
        const cardNumber = this.getCardFileNumber(deck, card);
        const paddedNumber = String(cardNumber).padStart(2, '0');

        // Determine folder path (same structure as images)
        let folder = '';
        if (card.type === 'major') {
            folder = deck.structure.major;
        } else if (card.type === 'minor' && card.suit) {
            folder = deck.structure.minor.replace('{suit}', card.suit);
        }

        // Build filename
        let filename;
        if (deckId === 'rider-waite') {
            // Rider-Waite: Complex naming
            if (card.type === 'minor') {
                // Minor: Transform word form to numeric (two-of-cups → 2-of-cups)
                const transformedFilename = this.transformRiderWaiteFilename(card.filename);
                filename = `${transformedFilename}.${format}`;
            } else {
                // Major: prepend number (e.g., "00-the-fool.webp")
                filename = `${paddedNumber}-${card.filename}.${format}`;
            }
        } else {
            // Artistic/Miro/Picasso: prepend number with offset (e.g., "01-the-fool.webp")
            filename = `${paddedNumber}-${card.filename}.${format}`;
        }

        // Combine parts
        const parts = [basePath];
        if (folder) parts.push(folder);
        parts.push(filename);

        const finalPath = parts.join('/');

        // Debug logging (can be removed in production)
        if (window.DEBUG_DECK_LOADER) {
            console.log(`[DeckLoader] getThumbnailPath(${deckId}, ${card.name}, ${format}): ${finalPath}`);
        }

        return finalPath;
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
     * Get card by ID
     * @param {number} cardId - Card ID (0-77)
     * @returns {object|null} Card object or null
     */
    static getCardById(cardId) {
        const allCards = this.getAllCards();
        return allCards.find(c => c.id === cardId) || null;
    }

    /**
     * Create responsive <picture> element with WebP + fallback
     * @param {string} deckId - Deck identifier
     * @param {object} card - Card object
     * @param {object} options - Options: { thumbnail: true/false, loading: 'lazy'/'eager', className: '' }
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
            if (options.className) img.className = options.className;
            picture.appendChild(img);
        } else {
            // No thumbnails - use full size
            const img = document.createElement('img');
            img.src = this.getImagePath(deckId, card);
            img.alt = card.name;
            img.loading = options.loading || 'lazy';
            img.decoding = 'async';
            if (options.className) img.className = options.className;
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
    static addErrorHandler(imgElement, placeholderPath = 'images/card-back.svg') {
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
