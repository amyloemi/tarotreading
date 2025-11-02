# Tarot Reading Bot

A comprehensive tarot reading system with card meanings, interpretation methodology, and the complete Rider-Waite tarot deck images.

## Project Structure

```
TarotReading/
├── README.md                      # This file
├── tarot_card_meanings.json       # Complete database of all 78 cards with meanings
├── reading_methodology.md         # Interpretation techniques and principles
├── reading_examples.md            # Detailed examples of readings
├── download_cards_fast.sh         # Script to download card images
├── download_cards.py             # Python download script (backup)
└── images/                        # Rider-Waite tarot deck images (400+ dpi)
    ├── major_arcana/              # 22 Major Arcana cards (86MB)
    │   ├── 00-the-fool.png
    │   ├── 01-the-magician.png
    │   └── ... (20 more)
    └── minor_arcana/              # 56 Minor Arcana cards (220MB)
        ├── cups/                  # 14 cards (Ace - King)
        ├── pentacles/             # 14 cards (Ace - King)
        ├── swords/                # 14 cards (Ace - King)
        └── wands/                 # 14 cards (Ace - King)
```

## Documentation Files

### 1. tarot_card_meanings.json
Complete JSON database containing:
- **22 Major Arcana cards**: Life's big lessons and spiritual themes
- **56 Minor Arcana cards**: Daily experiences organized by suit
  - Cups (Water): Emotions, relationships, intuition
  - Pentacles (Earth): Material world, finances, career
  - Swords (Air): Thoughts, intellect, communication
  - Wands (Fire): Action, passion, creativity

Each card includes:
- Card name
- Upright meaning
- Reversed meaning
- Suit information (for Minor Arcana)

### 2. reading_methodology.md
Comprehensive guide covering:
- **Single Card Reading**: Process and interpretation techniques
- **Three-Card Timeline Spread**: Past-Present-Future reading method
- **Interpretation Principles**: Major vs Minor Arcana, suit significance, reversals
- **Core Techniques**: Trust impressions, pattern recognition, storytelling
- **Reading Ethics**: Empowering approach, neutrality, context awareness

### 3. reading_examples.md
Practical examples including:
- **4 Single Card Readings**: Daily guidance, problem investigation, decisions, relationships
- **5 Three-Card Readings**: Romance, career transition, spiritual growth, finances, challenges
- Pattern recognition insights and key takeaways

## Card Images

All 78 Rider-Waite tarot card images are included:
- **Format**: PNG
- **Resolution**: 400+ dpi (high quality)
- **Source**: Internet Archive (Public Domain)
- **Total Size**: ~306MB
- **License**: Public Domain Mark 1.0

### Image Naming Convention

**Major Arcana**: `NN-card-name.png`
- Example: `00-the-fool.png`, `13-death.png`

**Minor Arcana**: `rank-of-suit.png`
- Example: `ace-of-cups.png`, `knight-of-swords.png`

## Usage

### Reading Tarot Cards

**Single Card Reading Format**:
```
Card: [Name] ([Upright/Reversed])
Core Meaning: [Brief definition]
Interpretation: [Application to context]
Guidance: [Actionable insight]
```

**Three-Card Reading Format**:
```
Past: [Card interpretation showing influences]
Present: [Card interpretation showing current energy]
Future: [Card interpretation showing trajectory]
Overall Message: [Synthesis of the narrative]
```

### Downloading Images

If you need to re-download the images:

```bash
cd /Users/amy/TarotReading
chmod +x download_cards_fast.sh
./download_cards_fast.sh
```

## Card Statistics

- **Total Cards**: 78
- **Major Arcana**: 22 cards (28%)
- **Minor Arcana**: 56 cards (72%)
  - Cups: 14 cards
  - Pentacles: 14 cards
  - Swords: 14 cards
  - Wands: 14 cards

## Interpretation Philosophy

The bot uses a balanced approach:
- **Traditional Meanings**: Based on Rider-Waite symbolism
- **Intuitive Guidance**: Contextual application
- **Empowering Framework**: Focus on growth and insight
- **Neutral Stance**: Non-judgmental, balanced perspective

## Resources

- **Card Meanings Source**: Labyrinthos (https://labyrinthos.co)
- **Image Source**: Internet Archive Rider-Waite Tarot Deck
- **Research**: Multiple tarot reading guides and methodologies

## Next Steps

To build the Tarot Reading Bot:
1. Load card meanings from `tarot_card_meanings.json`
2. Implement card drawing logic (random selection)
3. Apply reading methodology from documentation
4. Display card images from the `images/` directory
5. Format interpretations using the examples as templates

## License

- **Card Images**: Public Domain (Rider-Waite Tarot)
- **Card Meanings**: Compiled from public tarot resources
- **Documentation**: Created for educational purposes
