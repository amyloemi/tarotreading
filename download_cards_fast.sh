#!/bin/bash

# Base URL
BASE_URL="https://archive.org/download/rider-waite-tarot"

# Create directories
mkdir -p images/major_arcana
mkdir -p images/minor_arcana/{cups,pentacles,swords,wands}

cd /Users/amy/TarotReading

echo "=== Downloading Major Arcana ==="

# Major Arcana
curl -s -L -o "images/major_arcana/00-the-fool.png" "$BASE_URL/major_arcana_fool.png"
curl -s -L -o "images/major_arcana/01-the-magician.png" "$BASE_URL/major_arcana_magician.png"
curl -s -L -o "images/major_arcana/02-the-high-priestess.png" "$BASE_URL/major_arcana_priestess.png"
curl -s -L -o "images/major_arcana/03-the-empress.png" "$BASE_URL/major_arcana_empress.png"
curl -s -L -o "images/major_arcana/04-the-emperor.png" "$BASE_URL/major_arcana_emperor.png"
curl -s -L -o "images/major_arcana/05-the-hierophant.png" "$BASE_URL/major_arcana_hierophant.png"
curl -s -L -o "images/major_arcana/06-the-lovers.png" "$BASE_URL/major_arcana_lovers.png"
curl -s -L -o "images/major_arcana/07-the-chariot.png" "$BASE_URL/major_arcana_chariot.png"
curl -s -L -o "images/major_arcana/08-strength.png" "$BASE_URL/major_arcana_strength.png"
curl -s -L -o "images/major_arcana/09-the-hermit.png" "$BASE_URL/major_arcana_hermit.png"
curl -s -L -o "images/major_arcana/10-wheel-of-fortune.png" "$BASE_URL/major_arcana_fortune.png"
curl -s -L -o "images/major_arcana/11-justice.png" "$BASE_URL/major_arcana_justice.png"
curl -s -L -o "images/major_arcana/12-the-hanged-man.png" "$BASE_URL/major_arcana_hanged.png"
curl -s -L -o "images/major_arcana/13-death.png" "$BASE_URL/major_arcana_death.png"
curl -s -L -o "images/major_arcana/14-temperance.png" "$BASE_URL/major_arcana_temperance.png"
curl -s -L -o "images/major_arcana/15-the-devil.png" "$BASE_URL/major_arcana_devil.png"
curl -s -L -o "images/major_arcana/16-the-tower.png" "$BASE_URL/major_arcana_tower.png"
curl -s -L -o "images/major_arcana/17-the-star.png" "$BASE_URL/major_arcana_star.png"
curl -s -L -o "images/major_arcana/18-the-moon.png" "$BASE_URL/major_arcana_moon.png"
curl -s -L -o "images/major_arcana/19-the-sun.png" "$BASE_URL/major_arcana_sun.png"
curl -s -L -o "images/major_arcana/20-judgement.png" "$BASE_URL/major_arcana_judgement.png"
curl -s -L -o "images/major_arcana/21-the-world.png" "$BASE_URL/major_arcana_world.png"

echo "Major Arcana complete (22 cards)"

echo "=== Downloading Minor Arcana - Cups ==="
for rank in ace 2 3 4 5 6 7 8 9 10 page knight queen king; do
  curl -s -L -o "images/minor_arcana/cups/${rank}-of-cups.png" "$BASE_URL/minor_arcana_cups_${rank}.png"
done

echo "=== Downloading Minor Arcana - Pentacles ==="
for rank in ace 2 3 4 5 6 7 8 9 10 page knight queen king; do
  curl -s -L -o "images/minor_arcana/pentacles/${rank}-of-pentacles.png" "$BASE_URL/minor_arcana_pentacles_${rank}.png"
done

echo "=== Downloading Minor Arcana - Swords ==="
for rank in ace 2 3 4 5 6 7 8 9 10 page knight queen king; do
  curl -s -L -o "images/minor_arcana/swords/${rank}-of-swords.png" "$BASE_URL/minor_arcana_swords_${rank}.png"
done

echo "=== Downloading Minor Arcana - Wands ==="
for rank in ace 2 3 4 5 6 7 8 9 10 page knight queen king; do
  curl -s -L -o "images/minor_arcana/wands/${rank}-of-wands.png" "$BASE_URL/minor_arcana_wands_${rank}.png"
done

echo ""
echo "=== Download Complete! ==="
echo "Total files: $(find images -name '*.png' | wc -l | tr -d ' ')/78"
