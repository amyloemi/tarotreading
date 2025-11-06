// Picasso Tarot Deck - All 78 Cards
// Using pre-rendered PNG images from picasso-tarot-cards folder

const picassoData = {
    // All 78 cards with image paths
    cards: {
        major: [
            { name: "The Fool", meaning: "Beginnings, innocence, spontaneity, free spirit", image: "decks/picasso-tarot-cards/01-the-fool.png" },
            { name: "The Magician", meaning: "Manifestation, resourcefulness, power, inspired action", image: "decks/picasso-tarot-cards/02-the-magician.png" },
            { name: "The High Priestess", meaning: "Intuition, sacred knowledge, divine feminine, subconscious", image: "decks/picasso-tarot-cards/03-the-high-priestess.png" },
            { name: "The Empress", meaning: "Femininity, beauty, nature, nurturing, abundance", image: "decks/picasso-tarot-cards/04-the-empress.png" },
            { name: "The Emperor", meaning: "Authority, structure, control, fatherhood", image: "decks/picasso-tarot-cards/05-the-emperor.png" },
            { name: "The Hierophant", meaning: "Spiritual wisdom, religious beliefs, conformity, tradition", image: "decks/picasso-tarot-cards/06-the-hierophant.png" },
            { name: "The Lovers", meaning: "Love, harmony, relationships, values alignment", image: "decks/picasso-tarot-cards/07-the-lovers.png" },
            { name: "The Chariot", meaning: "Control, willpower, success, action, determination", image: "decks/picasso-tarot-cards/08-the-chariot.png" },
            { name: "Strength", meaning: "Strength, courage, persuasion, influence, compassion", image: "decks/picasso-tarot-cards/09-strength.png" },
            { name: "The Hermit", meaning: "Soul searching, introspection, being alone, inner guidance", image: "decks/picasso-tarot-cards/10-the-hermit.png" },
            { name: "Wheel of Fortune", meaning: "Good luck, karma, life cycles, destiny, turning point", image: "decks/picasso-tarot-cards/11-wheel-of-fortune.png" },
            { name: "Justice", meaning: "Justice, fairness, truth, cause and effect, law", image: "decks/picasso-tarot-cards/12-justice.png" },
            { name: "The Hanged Man", meaning: "Pause, surrender, letting go, new perspectives", image: "decks/picasso-tarot-cards/13-the-hanged-man.png" },
            { name: "Death", meaning: "Endings, change, transformation, transition", image: "decks/picasso-tarot-cards/14-death.png" },
            { name: "Temperance", meaning: "Balance, moderation, patience, purpose", image: "decks/picasso-tarot-cards/15-temperance.png" },
            { name: "The Devil", meaning: "Shadow self, attachment, addiction, restriction, sexuality", image: "decks/picasso-tarot-cards/16-the-devil.png" },
            { name: "The Tower", meaning: "Sudden change, upheaval, chaos, revelation, awakening", image: "decks/picasso-tarot-cards/17-the-tower.png" },
            { name: "The Star", meaning: "Hope, faith, purpose, renewal, spirituality", image: "decks/picasso-tarot-cards/18-the-star.png" },
            { name: "The Moon", meaning: "Illusion, fear, anxiety, subconscious, intuition", image: "decks/picasso-tarot-cards/19-the-moon.png" },
            { name: "The Sun", meaning: "Positivity, fun, warmth, success, vitality", image: "decks/picasso-tarot-cards/20-the-sun.png" },
            { name: "Judgement", meaning: "Judgement, rebirth, inner calling, absolution", image: "decks/picasso-tarot-cards/21-judgement.png" },
            { name: "The World", meaning: "Completion, integration, accomplishment, travel", image: "decks/picasso-tarot-cards/22-the-world.png" }
        ],
        wands: [
            { name: "Ace of Wands", meaning: "Inspiration, new opportunities, growth, potential", image: "decks/picasso-tarot-cards/23-ace-of-wands.png" },
            { name: "Two of Wands", meaning: "Future planning, progress, decisions, discovery", image: "decks/picasso-tarot-cards/24-two-of-wands.png" },
            { name: "Three of Wands", meaning: "Progress, expansion, foresight, overseas opportunities", image: "decks/picasso-tarot-cards/25-three-of-wands.png" },
            { name: "Four of Wands", meaning: "Celebration, joy, harmony, relaxation, homecoming", image: "decks/picasso-tarot-cards/26-four-of-wands.png" },
            { name: "Five of Wands", meaning: "Conflict, disagreements, competition, tension, diversity", image: "decks/picasso-tarot-cards/27-five-of-wands.png" },
            { name: "Six of Wands", meaning: "Success, public recognition, progress, self-confidence", image: "decks/picasso-tarot-cards/28-six-of-wands.png" },
            { name: "Seven of Wands", meaning: "Challenge, competition, protection, perseverance", image: "decks/picasso-tarot-cards/29-seven-of-wands.png" },
            { name: "Eight of Wands", meaning: "Movement, fast paced change, action, alignment", image: "decks/picasso-tarot-cards/30-eight-of-wands.png" },
            { name: "Nine of Wands", meaning: "Resilience, courage, persistence, test of faith", image: "decks/picasso-tarot-cards/31-nine-of-wands.png" },
            { name: "Ten of Wands", meaning: "Burden, extra responsibility, hard work, completion", image: "decks/picasso-tarot-cards/32-ten-of-wands.png" },
            { name: "Page of Wands", meaning: "Inspiration, ideas, discovery, limitless potential", image: "decks/picasso-tarot-cards/33-page-of-wands.png" },
            { name: "Knight of Wands", meaning: "Energy, passion, inspired action, adventure", image: "decks/picasso-tarot-cards/34-knight-of-wands.png" },
            { name: "Queen of Wands", meaning: "Courage, confidence, independence, determination", image: "decks/picasso-tarot-cards/35-queen-of-wands.png" },
            { name: "King of Wands", meaning: "Natural-born leader, vision, entrepreneur, honour", image: "decks/picasso-tarot-cards/36-king-of-wands.png" }
        ],
        cups: [
            { name: "Ace of Cups", meaning: "Love, new relationships, compassion, creativity", image: "decks/picasso-tarot-cards/37-ace-of-cups.png" },
            { name: "Two of Cups", meaning: "Unified love, partnership, mutual attraction", image: "decks/picasso-tarot-cards/38-two-of-cups.png" },
            { name: "Three of Cups", meaning: "Celebration, friendship, creativity, collaborations", image: "decks/picasso-tarot-cards/39-three-of-cups.png" },
            { name: "Four of Cups", meaning: "Meditation, contemplation, apathy, reevaluation", image: "decks/picasso-tarot-cards/40-four-of-cups.png" },
            { name: "Five of Cups", meaning: "Regret, failure, disappointment, pessimism", image: "decks/picasso-tarot-cards/41-five-of-cups.png" },
            { name: "Six of Cups", meaning: "Revisiting the past, childhood memories, innocence", image: "decks/picasso-tarot-cards/42-six-of-cups.png" },
            { name: "Seven of Cups", meaning: "Opportunities, choices, wishful thinking, illusion", image: "decks/picasso-tarot-cards/43-seven-of-cups.png" },
            { name: "Eight of Cups", meaning: "Disappointment, abandonment, withdrawal, escapism", image: "decks/picasso-tarot-cards/44-eight-of-cups.png" },
            { name: "Nine of Cups", meaning: "Contentment, satisfaction, gratitude, wish come true", image: "decks/picasso-tarot-cards/45-nine-of-cups.png" },
            { name: "Ten of Cups", meaning: "Divine love, blissful relationships, harmony, alignment", image: "decks/picasso-tarot-cards/46-ten-of-cups.png" },
            { name: "Page of Cups", meaning: "Creative opportunities, intuitive messages, curiosity", image: "decks/picasso-tarot-cards/47-page-of-cups.png" },
            { name: "Knight of Cups", meaning: "Creativity, romance, charm, imagination, beauty", image: "decks/picasso-tarot-cards/48-knight-of-cups.png" },
            { name: "Queen of Cups", meaning: "Compassion, caring, emotional stability, intuition", image: "decks/picasso-tarot-cards/49-queen-of-cups.png" },
            { name: "King of Cups", meaning: "Emotional balance, control, generosity, diplomacy", image: "decks/picasso-tarot-cards/50-king-of-cups.png" }
        ],
        swords: [
            { name: "Ace of Swords", meaning: "Breakthroughs, new ideas, mental clarity, success", image: "decks/picasso-tarot-cards/51-ace-of-swords.png" },
            { name: "Two of Swords", meaning: "Difficult decisions, weighing options, stalemate", image: "decks/picasso-tarot-cards/52-two-of-swords.png" },
            { name: "Three of Swords", meaning: "Heartbreak, emotional pain, sorrow, grief, hurt", image: "decks/picasso-tarot-cards/53-three-of-swords.png" },
            { name: "Four of Swords", meaning: "Rest, restoration, contemplation, recuperation", image: "decks/picasso-tarot-cards/54-four-of-swords.png" },
            { name: "Five of Swords", meaning: "Conflict, disagreements, competition, defeat", image: "decks/picasso-tarot-cards/55-five-of-swords.png" },
            { name: "Six of Swords", meaning: "Transition, change, rite of passage, moving on", image: "decks/picasso-tarot-cards/56-six-of-swords.png" },
            { name: "Seven of Swords", meaning: "Betrayal, deception, getting away with something", image: "decks/picasso-tarot-cards/57-seven-of-swords.png" },
            { name: "Eight of Swords", meaning: "Negative thoughts, self-imposed restriction, imprisonment", image: "decks/picasso-tarot-cards/58-eight-of-swords.png" },
            { name: "Nine of Swords", meaning: "Anxiety, worry, fear, depression, nightmares", image: "decks/picasso-tarot-cards/59-nine-of-swords.png" },
            { name: "Ten of Swords", meaning: "Painful endings, deep wounds, betrayal, loss, crisis", image: "decks/picasso-tarot-cards/60-ten-of-swords.png" },
            { name: "Page of Swords", meaning: "New ideas, curiosity, thirst for knowledge, vigilance", image: "decks/picasso-tarot-cards/61-page-of-swords.png" },
            { name: "Knight of Swords", meaning: "Ambitious, action-oriented, driven, fast thinking", image: "decks/picasso-tarot-cards/62-knight-of-swords.png" },
            { name: "Queen of Swords", meaning: "Independent, unbiased judgement, clear thinking", image: "decks/picasso-tarot-cards/63-queen-of-swords.png" },
            { name: "King of Swords", meaning: "Mental clarity, intellectual power, authority, truth", image: "decks/picasso-tarot-cards/64-king-of-swords.png" }
        ],
        pentacles: [
            { name: "Ace of Pentacles", meaning: "Opportunity, prosperity, new venture, manifestation", image: "decks/picasso-tarot-cards/65-ace-of-pentacles.png" },
            { name: "Two of Pentacles", meaning: "Multiple priorities, time management, balance", image: "decks/picasso-tarot-cards/66-two-of-pentacles.png" },
            { name: "Three of Pentacles", meaning: "Teamwork, collaboration, learning, implementation", image: "decks/picasso-tarot-cards/67-three-of-pentacles.png" },
            { name: "Four of Pentacles", meaning: "Saving money, security, conservatism, scarcity", image: "decks/picasso-tarot-cards/68-four-of-pentacles.png" },
            { name: "Five of Pentacles", meaning: "Financial loss, poverty, lack mindset, isolation", image: "decks/picasso-tarot-cards/69-five-of-pentacles.png" },
            { name: "Six of Pentacles", meaning: "Giving, receiving, sharing wealth, generosity", image: "decks/picasso-tarot-cards/70-six-of-pentacles.png" },
            { name: "Seven of Pentacles", meaning: "Long-term view, sustainable results, perseverance", image: "decks/picasso-tarot-cards/71-seven-of-pentacles.png" },
            { name: "Eight of Pentacles", meaning: "Apprenticeship, skill development, quality, dedication", image: "decks/picasso-tarot-cards/72-eight-of-pentacles.png" },
            { name: "Nine of Pentacles", meaning: "Abundance, luxury, self-sufficiency, financial independence", image: "decks/picasso-tarot-cards/73-nine-of-pentacles.png" },
            { name: "Ten of Pentacles", meaning: "Wealth, financial security, family, long-term success", image: "decks/picasso-tarot-cards/74-ten-of-pentacles.png" },
            { name: "Page of Pentacles", meaning: "Manifestation, financial opportunity, skill development", image: "decks/picasso-tarot-cards/75-page-of-pentacles.png" },
            { name: "Knight of Pentacles", meaning: "Hard work, productivity, routine, conservatism", image: "decks/picasso-tarot-cards/76-knight-of-pentacles.png" },
            { name: "Queen of Pentacles", meaning: "Nurturing, practical, providing, down-to-earth", image: "decks/picasso-tarot-cards/77-queen-of-pentacles.png" },
            { name: "King of Pentacles", meaning: "Wealth, business, leadership, security, abundance", image: "decks/picasso-tarot-cards/78-king-of-pentacles.png" }
        ]
    },

    // Get all cards as a flat array
    getAllCards: function() {
        // Add type/suit properties to cards for filtering
        const major = this.cards.major.map(card => ({ ...card, type: 'major' }));
        const wands = this.cards.wands.map(card => ({ ...card, suit: 'wands' }));
        const cups = this.cards.cups.map(card => ({ ...card, suit: 'cups' }));
        const swords = this.cards.swords.map(card => ({ ...card, suit: 'swords' }));
        const pentacles = this.cards.pentacles.map(card => ({ ...card, suit: 'pentacles' }));

        return [
            ...major,
            ...wands,
            ...cups,
            ...swords,
            ...pentacles
        ];
    },

    // Render card - simply returns the image path
    renderCard: function(card) {
        return card.image;
    }
};
