#!/usr/bin/env python3
"""
WebP Conversion Script for My Tarot Today
Converts all full-size deck images to WebP format
"""

import os
import subprocess
import sys
from pathlib import Path

def convert_to_webp(image_path, quality=85):
    """Convert an image to WebP format"""
    webp_path = image_path.with_suffix('.webp')

    # Skip if WebP already exists
    if webp_path.exists():
        return 'skipped', 0, 0

    try:
        # Run cwebp conversion
        result = subprocess.run(
            ['cwebp', '-q', str(quality), str(image_path), '-o', str(webp_path)],
            capture_output=True,
            text=True,
            timeout=30
        )

        if result.returncode == 0:
            original_size = image_path.stat().st_size
            webp_size = webp_path.stat().st_size
            return 'converted', original_size, webp_size
        else:
            return 'failed', 0, 0
    except Exception as e:
        print(f"Error converting {image_path}: {e}")
        return 'failed', 0, 0

def main():
    # Find all PNG and JPG files, excluding thumbnails
    decks_dir = Path('./decks')
    image_extensions = ['.png', '.jpg', '.jpeg']

    images_to_convert = []
    for ext in image_extensions:
        for img in decks_dir.rglob(f'*{ext}'):
            if 'thumbnails' not in str(img):
                images_to_convert.append(img)

    total = len(images_to_convert)
    converted = 0
    skipped = 0
    failed = 0
    total_original_size = 0
    total_webp_size = 0

    print(f"Found {total} images to process")
    print("=" * 60)

    for i, img_path in enumerate(images_to_convert, 1):
        status, orig_size, webp_size = convert_to_webp(img_path)

        if status == 'converted':
            converted += 1
            total_original_size += orig_size
            total_webp_size += webp_size
            reduction = ((orig_size - webp_size) / orig_size) * 100
            print(f"[{i}/{total}] ✅ {img_path.name}")
            print(f"        {orig_size//1024}KB → {webp_size//1024}KB ({reduction:.1f}% smaller)")
        elif status == 'skipped':
            skipped += 1
            print(f"[{i}/{total}] ⏭️  {img_path.name} (already exists)")
        else:
            failed += 1
            print(f"[{i}/{total}] ❌ {img_path.name} (failed)")

    print("\n" + "=" * 60)
    print("WebP Conversion Summary")
    print("=" * 60)
    print(f"Total files processed:    {total}")
    print(f"Successfully converted:   {converted}")
    print(f"Skipped (already exist):  {skipped}")
    print(f"Failed:                   {failed}")

    if converted > 0:
        print(f"\nTotal original size:      {total_original_size / (1024*1024):.1f} MB")
        print(f"Total WebP size:          {total_webp_size / (1024*1024):.1f} MB")
        print(f"Total space saved:        {(total_original_size - total_webp_size) / (1024*1024):.1f} MB")
        print(f"Average reduction:        {((total_original_size - total_webp_size) / total_original_size) * 100:.1f}%")

if __name__ == '__main__':
    main()
