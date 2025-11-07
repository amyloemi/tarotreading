#!/bin/bash

#######################################################################
# Thumbnail Generation Script for Tarot Card Images (macOS/sips)
# Generates optimized thumbnails at 300x520px
# Reduces image size by ~90% for faster mobile gallery loading
#######################################################################

SOURCE_DIR="./decks/images"
THUMBNAIL_DIR="./decks/images-thumbnails"
THUMBNAIL_WIDTH=300
THUMBNAIL_HEIGHT=520
JPEG_QUALITY=80

echo "🎴 Tarot Card Thumbnail Generator"
echo ""
echo "Configuration:"
echo "  Source: $SOURCE_DIR"
echo "  Output: $THUMBNAIL_DIR"
echo "  Size: ${THUMBNAIL_WIDTH}×${THUMBNAIL_HEIGHT}px"
echo "  Quality: ${JPEG_QUALITY}%"
echo ""

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Source directory not found: $SOURCE_DIR"
    exit 1
fi

# Create thumbnail directory
mkdir -p "$THUMBNAIL_DIR"

# Count total images
total_images=$(find "$SOURCE_DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) | wc -l | tr -d ' ')
echo "📁 Found $total_images images"
echo ""

if [ "$total_images" -eq 0 ]; then
    echo "❌ No images found in $SOURCE_DIR"
    exit 1
fi

echo "🔄 Generating thumbnails..."
echo ""

# Initialize counters
count=0
successful=0
failed=0
total_original_size=0
total_thumb_size=0

# Process each image
find "$SOURCE_DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) | while read -r source_file; do
    count=$((count + 1))

    # Get relative path
    rel_path="${source_file#$SOURCE_DIR/}"
    rel_dir=$(dirname "$rel_path")
    filename=$(basename "$source_file")
    base_name="${filename%.*}"

    # Create target directory
    target_dir="$THUMBNAIL_DIR/$rel_dir"
    mkdir -p "$target_dir"

    # Output paths
    thumb_jpg="$target_dir/${base_name}.jpg"
    thumb_webp="$target_dir/${base_name}.webp"

    echo "[$count/$total_images] Processing: $rel_path"

    # Get original file size
    original_size=$(stat -f%z "$source_file" 2>/dev/null || echo 0)

    # Generate JPEG thumbnail using sips
    if sips -s format jpeg \
            -s formatOptions "$JPEG_QUALITY" \
            -Z "$THUMBNAIL_HEIGHT" \
            "$source_file" \
            --out "$thumb_jpg" >/dev/null 2>&1; then

        # Get thumbnail size
        thumb_size=$(stat -f%z "$thumb_jpg" 2>/dev/null || echo 0)

        # Generate WebP if cwebp is available
        if command -v cwebp &> /dev/null; then
            if cwebp -q "$JPEG_QUALITY" "$thumb_jpg" -o "$thumb_webp" >/dev/null 2>&1; then
                webp_size=$(stat -f%z "$thumb_webp" 2>/dev/null || echo 0)
                echo "  ✓ JPEG: $(echo "scale=1; $thumb_size/1024" | bc)KB | WebP: $(echo "scale=1; $webp_size/1024" | bc)KB | Reduction: $(echo "scale=1; ($original_size-$thumb_size)*100/$original_size" | bc)%"
            else
                echo "  ✓ JPEG: $(echo "scale=1; $thumb_size/1024" | bc)KB | Reduction: $(echo "scale=1; ($original_size-$thumb_size)*100/$original_size" | bc)%"
            fi
        else
            echo "  ✓ JPEG: $(echo "scale=1; $thumb_size/1024" | bc)KB | Reduction: $(echo "scale=1; ($original_size-$thumb_size)*100/$original_size" | bc)%"
        fi

        successful=$((successful + 1))
        total_original_size=$((total_original_size + original_size))
        total_thumb_size=$((total_thumb_size + thumb_size))
    else
        echo "  ✗ Error generating thumbnail"
        failed=$((failed + 1))
    fi
done

echo ""
echo "============================================================"
echo "📊 Summary"
echo "============================================================"
echo "✓ Successful: $successful"
echo "✗ Failed: $failed"

if [ $total_original_size -gt 0 ]; then
    orig_mb=$(echo "scale=1; $total_original_size/1024/1024" | bc)
    thumb_mb=$(echo "scale=1; $total_thumb_size/1024/1024" | bc)
    reduction=$(echo "scale=1; ($total_original_size-$total_thumb_size)*100/$total_original_size" | bc)

    echo "💾 Original size: ${orig_mb}MB"
    echo "💾 Thumbnail size: ${thumb_mb}MB"
    echo "📉 Average reduction: ${reduction}%"
fi

echo "============================================================"
echo ""
echo "✨ Thumbnail generation complete!"
echo ""
echo "Note: WebP images were not generated (cwebp not installed)."
echo "      To generate WebP images, install: brew install webp"
echo "      Then run this script again."
