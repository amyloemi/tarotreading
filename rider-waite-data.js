// Rider-Waite Tarot Deck - All 78 Cards
// Classic tarot imagery with traditional meanings

const riderWaiteData = {
    // Embedded tarot meanings data
    meanings: {
        "major_arcana": [
            {"number":0,"name":"The Fool","upright":"innocence, new beginnings, free spirit","reversed":"recklessness, taken advantage of, inconsideration"},
            {"number":1,"name":"The Magician","upright":"willpower, desire, creation, manifestation","reversed":"trickery, illusions, out of touch"},
            {"number":2,"name":"The High Priestess","upright":"intuitive, unconscious, inner voice","reversed":"lack of center, lost inner voice, repressed feelings"},
            {"number":3,"name":"The Empress","upright":"motherhood, fertility, nature","reversed":"dependence, smothering, emptiness, nosiness"},
            {"number":4,"name":"The Emperor","upright":"authority, structure, control, fatherhood","reversed":"tyranny, rigidity, coldness"},
            {"number":5,"name":"The Hierophant","upright":"tradition, conformity, morality, ethics","reversed":"rebellion, subversiveness, new approaches"},
            {"number":6,"name":"The Lovers","upright":"partnerships, duality, union","reversed":"loss of balance, one-sidedness, disharmony"},
            {"number":7,"name":"The Chariot","upright":"direction, control, willpower","reversed":"lack of control, lack of direction, aggression"},
            {"number":8,"name":"Strength","upright":"inner strength, bravery, compassion, focus","reversed":"self doubt, weakness, insecurity"},
            {"number":9,"name":"The Hermit","upright":"contemplation, search for truth, inner guidance","reversed":"loneliness, isolation, lost your way"},
            {"number":10,"name":"Wheel of Fortune","upright":"change, cycles, inevitable fate","reversed":"no control, clinging to control, bad luck"},
            {"number":11,"name":"Justice","upright":"cause and effect, clarity, truth","reversed":"dishonesty, unaccountability, unfairness"},
            {"number":12,"name":"The Hanged Man","upright":"sacrifice, release, martyrdom","reversed":"stalling, needless sacrifice, fear of sacrifice"},
            {"number":13,"name":"Death","upright":"end of cycle, beginnings, change, metamorphosis","reversed":"fear of change, holding on, stagnation, decay"},
            {"number":14,"name":"Temperance","upright":"middle path, patience, finding meaning","reversed":"extremes, excess, lack of balance"},
            {"number":15,"name":"The Devil","upright":"addiction, materialism, playfulness","reversed":"freedom, release, restoring control"},
            {"number":16,"name":"The Tower","upright":"sudden upheaval, broken pride, disaster","reversed":"disaster avoided, delayed disaster, fear of suffering"},
            {"number":17,"name":"The Star","upright":"hope, faith, rejuvenation","reversed":"faithlessness, discouragement, insecurity"},
            {"number":18,"name":"The Moon","upright":"unconscious, illusions, intuition","reversed":"confusion, fear, misinterpretation"},
            {"number":19,"name":"The Sun","upright":"joy, success, celebration, positivity","reversed":"negativity, depression, sadness"},
            {"number":20,"name":"Judgement","upright":"reflection, reckoning, awakening","reversed":"lack of self awareness, doubt, self loathing"},
            {"number":21,"name":"The World","upright":"fulfillment, harmony, completion","reversed":"incompletion, no closure"}
        ],
        "minor_arcana": {
            "wands": [
                {"name":"Ace of Wands","upright":"creation, willpower, inspiration, desire","reversed":"lack of energy, lack of passion, boredom"},
                {"name":"Two of Wands","upright":"planning, making decisions, leaving home","reversed":"fear of change, playing safe, bad planning"},
                {"name":"Three of Wands","upright":"looking ahead, expansion, rapid growth","reversed":"obstacles, delays, frustration"},
                {"name":"Four of Wands","upright":"community, home, celebration","reversed":"lack of support, transience, home conflicts"},
                {"name":"Five of Wands","upright":"competition, rivalry, conflict","reversed":"avoiding conflict, respecting differences"},
                {"name":"Six of Wands","upright":"victory, success, public reward","reversed":"excess pride, lack of recognition, punishment"},
                {"name":"Seven of Wands","upright":"perseverance, defensive, maintaining control","reversed":"give up, destroyed confidence, overwhelmed"},
                {"name":"Eight of Wands","upright":"rapid action, movement, quick decisions","reversed":"panic, waiting, slowdown"},
                {"name":"Nine of Wands","upright":"resilience, grit, last stand","reversed":"exhaustion, fatigue, questioning motivations"},
                {"name":"Ten of Wands","upright":"accomplishment, responsibility, burden","reversed":"inability to delegate, overstressed, burnt out"},
                {"name":"Page of Wands","upright":"exploration, excitement, freedom","reversed":"lack of direction, procrastination, creating conflict"},
                {"name":"Knight of Wands","upright":"action, adventure, fearlessness","reversed":"anger, impulsiveness, recklessness"},
                {"name":"Queen of Wands","upright":"courage, determination, joy","reversed":"selfishness, jealousy, insecurities"},
                {"name":"King of Wands","upright":"big picture, leader, overcoming challenges","reversed":"impulsive, overbearing, unachievable expectations"}
            ],
            "cups": [
                {"name":"Ace of Cups","upright":"new feelings, spirituality, intuition","reversed":"emotional loss, blocked creativity, emptiness"},
                {"name":"Two of Cups","upright":"unity, partnership, connection","reversed":"imbalance, broken communication, tension"},
                {"name":"Three of Cups","upright":"friendship, community, happiness","reversed":"overindulgence, gossip, isolation"},
                {"name":"Four of Cups","upright":"apathy, contemplation, disconnectedness","reversed":"sudden awareness, choosing happiness, acceptance"},
                {"name":"Five of Cups","upright":"loss, grief, self-pity","reversed":"acceptance, moving on, finding peace"},
                {"name":"Six of Cups","upright":"familiarity, happy memories, healing","reversed":"moving forward, leaving home, independence"},
                {"name":"Seven of Cups","upright":"searching for purpose, choices, daydreaming","reversed":"lack of purpose, diversion, confusion"},
                {"name":"Eight of Cups","upright":"walking away, disillusionment, leaving behind","reversed":"avoidance, fear of change, fear of loss"},
                {"name":"Nine of Cups","upright":"satisfaction, emotional stability, luxury","reversed":"lack of inner joy, smugness, dissatisfaction"},
                {"name":"Ten of Cups","upright":"inner happiness, fulfillment, dreams coming true","reversed":"shattered dreams, broken family, domestic disharmony"},
                {"name":"Page of Cups","upright":"happy surprise, dreamer, sensitivity","reversed":"emotional immaturity, insecurity, disappointment"},
                {"name":"Knight of Cups","upright":"following the heart, idealist, romantic","reversed":"moodiness, disappointment"},
                {"name":"Queen of Cups","upright":"compassion, calm, comfort","reversed":"martyrdom, insecurity, dependence"},
                {"name":"King of Cups","upright":"compassion, control, balance","reversed":"coldness, moodiness, bad advice"}
            ],
            "swords": [
                {"name":"Ace of Swords","upright":"breakthrough, clarity, sharp mind","reversed":"confusion, brutality, chaos"},
                {"name":"Two of Swords","upright":"difficult choices, indecision, stalemate","reversed":"lesser of two evils, no right choice, confusion"},
                {"name":"Three of Swords","upright":"heartbreak, suffering, grief","reversed":"recovery, forgiveness, moving on"},
                {"name":"Four of Swords","upright":"rest, restoration, contemplation","reversed":"restlessness, burnout, stress"},
                {"name":"Five of Swords","upright":"unbridled ambition, win at all costs, sneakiness","reversed":"lingering resentment, desire to reconcile, forgiveness"},
                {"name":"Six of Swords","upright":"transition, leaving behind, moving on","reversed":"emotional baggage, unresolved issues, resisting transition"},
                {"name":"Seven of Swords","upright":"deception, trickery, tactics and strategy","reversed":"coming clean, rethinking approach, deception"},
                {"name":"Eight of Swords","upright":"imprisonment, entrapment, self-victimization","reversed":"self acceptance, new perspective, freedom"},
                {"name":"Nine of Swords","upright":"anxiety, hopelessness, trauma","reversed":"hope, reaching out, despair"},
                {"name":"Ten of Swords","upright":"failure, collapse, defeat","reversed":"can't get worse, only upwards, inevitable end"},
                {"name":"Page of Swords","upright":"curiosity, restlessness, mental energy","reversed":"deception, manipulation, all talk"},
                {"name":"Knight of Swords","upright":"action, impulsiveness, defending beliefs","reversed":"no direction, disregard for consequences, unpredictability"},
                {"name":"Queen of Swords","upright":"complexity, perceptiveness, clear mindedness","reversed":"cold hearted, cruel, bitterness"},
                {"name":"King of Swords","upright":"head over heart, discipline, truth","reversed":"manipulative, cruel, weakness"}
            ],
            "pentacles": [
                {"name":"Ace of Pentacles","upright":"opportunity, prosperity, new venture","reversed":"lost opportunity, missed chance, bad investment"},
                {"name":"Two of Pentacles","upright":"balancing decisions, priorities, adapting to change","reversed":"loss of balance, disorganized, overwhelmed"},
                {"name":"Three of Pentacles","upright":"teamwork, collaboration, building","reversed":"lack of teamwork, disorganized, group conflict"},
                {"name":"Four of Pentacles","upright":"conservation, frugality, security","reversed":"greediness, stinginess, possessiveness"},
                {"name":"Five of Pentacles","upright":"need, poverty, insecurity","reversed":"recovery, charity, improvement"},
                {"name":"Six of Pentacles","upright":"charity, generosity, sharing","reversed":"strings attached, stinginess, power and domination"},
                {"name":"Seven of Pentacles","upright":"hard work, perseverance, diligence","reversed":"work without results, distractions, lack of rewards"},
                {"name":"Eight of Pentacles","upright":"apprenticeship, passion, high standards","reversed":"lack of passion, uninspired, no motivation"},
                {"name":"Nine of Pentacles","upright":"fruits of labor, rewards, luxury","reversed":"reckless spending, living beyond means, false success"},
                {"name":"Ten of Pentacles","upright":"legacy, culmination, inheritance","reversed":"fleeting success, lack of stability, lack of resources"},
                {"name":"Page of Pentacles","upright":"ambition, desire, diligence","reversed":"lack of commitment, greediness, laziness"},
                {"name":"Knight of Pentacles","upright":"efficiency, hard work, responsibility","reversed":"laziness, obsessiveness, work without reward"},
                {"name":"Queen of Pentacles","upright":"practicality, creature comforts, financial security","reversed":"self-centeredness, jealousy, smothering"},
                {"name":"King of Pentacles","upright":"abundance, prosperity, security","reversed":"greed, indulgence, sensuality"}
            ]
        }
    },

    // All 78 cards with image paths
    cards: {
        major: [
            { name: "The Fool", file: "00-the-fool.png", number: 0 },
            { name: "The Magician", file: "01-the-magician.png", number: 1 },
            { name: "The High Priestess", file: "02-the-high-priestess.png", number: 2 },
            { name: "The Empress", file: "03-the-empress.png", number: 3 },
            { name: "The Emperor", file: "04-the-emperor.png", number: 4 },
            { name: "The Hierophant", file: "05-the-hierophant.png", number: 5 },
            { name: "The Lovers", file: "06-the-lovers.png", number: 6 },
            { name: "The Chariot", file: "07-the-chariot.png", number: 7 },
            { name: "Strength", file: "08-strength.png", number: 8 },
            { name: "The Hermit", file: "09-the-hermit.png", number: 9 },
            { name: "Wheel of Fortune", file: "10-wheel-of-fortune.png", number: 10 },
            { name: "Justice", file: "11-justice.png", number: 11 },
            { name: "The Hanged Man", file: "12-the-hanged-man.png", number: 12 },
            { name: "Death", file: "13-death.png", number: 13 },
            { name: "Temperance", file: "14-temperance.png", number: 14 },
            { name: "The Devil", file: "15-the-devil.png", number: 15 },
            { name: "The Tower", file: "16-the-tower.png", number: 16 },
            { name: "The Star", file: "17-the-star.png", number: 17 },
            { name: "The Moon", file: "18-the-moon.png", number: 18 },
            { name: "The Sun", file: "19-the-sun.png", number: 19 },
            { name: "Judgement", file: "20-judgement.png", number: 20 },
            { name: "The World", file: "21-the-world.png", number: 21 }
        ],
        minor: []
    },

    // Generate all 56 minor arcana cards with image paths
    generateMinorCards: function() {
        const suits = ['cups', 'pentacles', 'swords', 'wands'];
        const ranks = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'page', 'knight', 'queen', 'king'];
        const numberNames = {
            '2': 'Two', '3': 'Three', '4': 'Four', '5': 'Five',
            '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine', '10': 'Ten'
        };

        suits.forEach(suit => {
            ranks.forEach(rank => {
                const suitCapitalized = suit.charAt(0).toUpperCase() + suit.slice(1);
                let name;

                if (rank === 'ace') {
                    name = `Ace of ${suitCapitalized}`;
                } else if (['page', 'knight', 'queen', 'king'].includes(rank)) {
                    name = `${rank.charAt(0).toUpperCase() + rank.slice(1)} of ${suitCapitalized}`;
                } else {
                    name = `${numberNames[rank]} of ${suitCapitalized}`;
                }

                this.cards.minor.push({
                    name: name,
                    file: `${rank}-of-${suit}.png`,
                    suit: suit
                });
            });
        });
    },

    // Get card meaning by name
    getCardMeaning: function(cardName) {
        // Check major arcana
        const majorCard = this.meanings.major_arcana.find(c => c.name === cardName);
        if (majorCard) {
            return {
                upright: majorCard.upright,
                reversed: majorCard.reversed,
                type: 'major'
            };
        }

        // Check minor arcana
        for (const suit in this.meanings.minor_arcana) {
            const minorCard = this.meanings.minor_arcana[suit].find(c => c.name === cardName);
            if (minorCard) {
                return {
                    upright: minorCard.upright,
                    reversed: minorCard.reversed,
                    type: 'minor',
                    suit: suit
                };
            }
        }

        return null;
    },

    // Get image path for a card
    getImagePath: function(card) {
        const isMajor = this.cards.major.find(c => c.name === card.name);
        return isMajor ?
            `images/major_arcana/${card.file}` :
            `images/minor_arcana/${card.suit}/${card.file}`;
    }
};

// Generate minor cards on initialization
riderWaiteData.generateMinorCards();
