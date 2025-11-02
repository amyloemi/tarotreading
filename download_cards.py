#!/usr/bin/env python3
"""
Download Rider-Waite tarot card images from Internet Archive
"""

import urllib.request
import os
import time

# Base URL for Internet Archive Rider-Waite deck
BASE_URL = "https://archive.org/download/rider-waite-tarot"

# Major Arcana cards with their archive filenames and output names
MAJOR_ARCANA = [
    ("major_arcana_fool.png", "00-the-fool.png"),
    ("major_arcana_magician.png", "01-the-magician.png"),
    ("major_arcana_priestess.png", "02-the-high-priestess.png"),
    ("major_arcana_empress.png", "03-the-empress.png"),
    ("major_arcana_emperor.png", "04-the-emperor.png"),
    ("major_arcana_hierophant.png", "05-the-hierophant.png"),
    ("major_arcana_lovers.png", "06-the-lovers.png"),
    ("major_arcana_chariot.png", "07-the-chariot.png"),
    ("major_arcana_strength.png", "08-strength.png"),
    ("major_arcana_hermit.png", "09-the-hermit.png"),
    ("major_arcana_fortune.png", "10-wheel-of-fortune.png"),
    ("major_arcana_justice.png", "11-justice.png"),
    ("major_arcana_hanged.png", "12-the-hanged-man.png"),
    ("major_arcana_death.png", "13-death.png"),
    ("major_arcana_temperance.png", "14-temperance.png"),
    ("major_arcana_devil.png", "15-the-devil.png"),
    ("major_arcana_tower.png", "16-the-tower.png"),
    ("major_arcana_star.png", "17-the-star.png"),
    ("major_arcana_moon.png", "18-the-moon.png"),
    ("major_arcana_sun.png", "19-the-sun.png"),
    ("major_arcana_judgement.png", "20-judgement.png"),
    ("major_arcana_world.png", "21-the-world.png")
]

# Minor Arcana suits
SUITS = ["cups", "pentacles", "swords", "wands"]

# Minor Arcana ranks
RANKS = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "page", "knight", "queen", "king"]

def download_image(url, filepath):
    """Download an image from URL to filepath"""
    try:
        print(f"Downloading: {os.path.basename(filepath)}")
        urllib.request.urlretrieve(url, filepath)
        time.sleep(0.5)  # Be nice to the server
        return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False

def main():
    base_dir = "/Users/amy/TarotReading/images"

    # Download Major Arcana
    print("\n=== Downloading Major Arcana (22 cards) ===")
    for archive_name, output_name in MAJOR_ARCANA:
        url = f"{BASE_URL}/{archive_name}"
        filepath = os.path.join(base_dir, "major_arcana", output_name)
        download_image(url, filepath)

    # Download Minor Arcana
    print("\n=== Downloading Minor Arcana (56 cards) ===")
    for suit in SUITS:
        print(f"\n--- {suit.capitalize()} ---")
        for rank in RANKS:
            archive_name = f"minor_arcana_{suit}_{rank}.png"
            output_name = f"{rank}-of-{suit}.png"
            url = f"{BASE_URL}/{archive_name}"
            filepath = os.path.join(base_dir, "minor_arcana", suit, output_name)
            download_image(url, filepath)

    print("\n=== Download Complete! ===")
    print(f"All 78 cards downloaded to: {base_dir}")

if __name__ == "__main__":
    main()
