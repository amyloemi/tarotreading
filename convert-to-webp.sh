#!/bin/bash

# WebP Conversion Script for My Tarot Today
# Converts all full-size deck images to WebP format
# Quality: 85 (good balance between quality and file size)

echo "Starting WebP conversion for full-size images..."
echo "This will create .webp versions alongside existing PNG/JPG files"
echo ""

# Counter
total=0
converted=0
skipped=0
failed=0

# Find all PNG and JPG files, excluding thumbnails
find ./decks -type f \( -name "*.png" -o -name "*.jpg" \) ! -path "*thumbnails*" | while read file; do
    total=$((total + 1))

    # Generate WebP filename
    webp_file="${file%.*}.webp"

    # Skip if WebP already exists
    if [ -f "$webp_file" ]; then
        echo "⏭️  Skipping (already exists): $webp_file"
        skipped=$((skipped + 1))
        continue
    fi

    # Convert to WebP
    echo "🔄 Converting: $file"
    if cwebp -q 85 "$file" -o "$webp_file" 2>/dev/null; then
        # Get file sizes
        original_size=$(du -h "$file" | cut -f1)
        webp_size=$(du -h "$webp_file" | cut -f1)
        echo "✅ Created: $webp_file (Original: $original_size → WebP: $webp_size)"
        converted=$((converted + 1))
    else
        echo "❌ Failed: $file"
        failed=$((failed + 1))
    fi
    echo ""
done

echo "=========================================="
echo "WebP Conversion Complete!"
echo "=========================================="
echo "Total files processed: $total"
echo "Successfully converted: $converted"
echo "Skipped (already exist): $skipped"
echo "Failed: $failed"
echo ""
echo "Note: Original PNG/JPG files are kept as fallbacks for older browsers."
