---
name: convert-to-webp
description: Converts PNG/JPG images to WebP format for faster page loads. Automatically finds images in decks folder, converts them with optimal quality settings, and provides detailed statistics. Use when adding new images or optimizing existing ones.
allowed-tools: Read, Glob, Bash, Grep
---

# WebP Image Conversion Skill

## Purpose
This skill converts PNG and JPG images to WebP format, reducing file sizes by 70-90% while maintaining visual quality. The WebP format provides faster page loads and better user experience, especially on mobile devices.

## When to Use
Trigger this skill when:
- Adding new tarot card images to the decks folder
- Optimizing existing images for better performance
- Preparing images for production deployment
- User requests image optimization or WebP conversion

## How It Works

### Prerequisites
Check if `cwebp` is installed:
```bash
which cwebp
```

If not installed:
```bash
# macOS
brew install webp

# Ubuntu/Debian
sudo apt-get install webp

# Windows
# Download from: https://developers.google.com/speed/webp/download
```

### Conversion Process

#### Step 1: Find Images to Convert
```bash
# Find all PNG and JPG files in decks folder, excluding thumbnails
find ./decks -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) ! -path "*thumbnails*" | head -10

# Count total images
find ./decks -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) ! -path "*thumbnails*" | wc -l
```

#### Step 2: Check for Existing WebP Files
```bash
# Check if WebP versions already exist
find ./decks -type f -name "*.webp" ! -path "*thumbnails*" | wc -l
```

#### Step 3: Convert Images to WebP
Use this command for batch conversion:

```bash
#!/bin/bash
# Convert images to WebP with quality 85

QUALITY=85
CONVERTED=0
SKIPPED=0
FAILED=0
TOTAL_ORIGINAL_SIZE=0
TOTAL_WEBP_SIZE=0

echo "Starting WebP conversion..."
echo "Quality setting: $QUALITY"
echo "======================================"

find ./decks -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) ! -path "*thumbnails*" | while read file; do
    # Generate WebP filename
    webp_file="${file%.*}.webp"

    # Skip if WebP already exists
    if [ -f "$webp_file" ]; then
        echo "⏭️  Skipped: $(basename "$file") (already exists)"
        SKIPPED=$((SKIPPED + 1))
        continue
    fi

    # Get original size
    original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)

    # Convert to WebP
    echo "🔄 Converting: $(basename "$file")"
    if cwebp -q $QUALITY "$file" -o "$webp_file" 2>/dev/null; then
        # Get WebP size
        webp_size=$(stat -f%z "$webp_file" 2>/dev/null || stat -c%s "$webp_file" 2>/dev/null)

        # Calculate reduction
        reduction=$(( (original_size - webp_size) * 100 / original_size ))

        echo "   ✅ Success: ${original_size} bytes → ${webp_size} bytes (${reduction}% smaller)"
        CONVERTED=$((CONVERTED + 1))
        TOTAL_ORIGINAL_SIZE=$((TOTAL_ORIGINAL_SIZE + original_size))
        TOTAL_WEBP_SIZE=$((TOTAL_WEBP_SIZE + webp_size))
    else
        echo "   ❌ Failed to convert: $file"
        FAILED=$((FAILED + 1))
    fi
    echo ""
done

echo "======================================"
echo "Conversion Complete!"
echo "======================================"
echo "Successfully converted: $CONVERTED"
echo "Skipped (already exist): $SKIPPED"
echo "Failed: $FAILED"

if [ $CONVERTED -gt 0 ]; then
    total_saved=$((TOTAL_ORIGINAL_SIZE - TOTAL_WEBP_SIZE))
    avg_reduction=$(( total_saved * 100 / TOTAL_ORIGINAL_SIZE ))
    echo ""
    echo "Total space saved: $(( total_saved / 1024 / 1024 )) MB"
    echo "Average reduction: ${avg_reduction}%"
fi
```

#### Step 4: Verify Conversions
```bash
# Compare counts: PNGs/JPGs vs WebPs
echo "PNG files: $(find ./decks -type f -name "*.png" ! -path "*thumbnails*" | wc -l)"
echo "JPG files: $(find ./decks -type f -name "*.jpg" ! -path "*thumbnails*" | wc -l)"
echo "WebP files: $(find ./decks -type f -name "*.webp" ! -path "*thumbnails*" | wc -l)"

# Check a sample conversion
file_sample=$(find ./decks -type f -name "*.png" ! -path "*thumbnails*" | head -1)
if [ -f "$file_sample" ]; then
    webp_sample="${file_sample%.*}.webp"
    echo ""
    echo "Sample comparison:"
    ls -lh "$file_sample" "$webp_sample"
fi
```

## Quality Settings

### Recommended Quality Levels:
- **85** (default): Best balance of quality and size for photographic images
- **90**: Higher quality, slightly larger files (for detailed artwork)
- **80**: More aggressive compression (acceptable for thumbnails)
- **75**: Maximum compression (noticeable quality loss)

### Adjusting Quality:
Change the `QUALITY` variable in the script above:
```bash
QUALITY=90  # For higher quality
QUALITY=80  # For smaller files
```

## Important Notes

### ⚠️ Keep Original Files
**DO NOT delete the original PNG/JPG files!** They serve as fallbacks for:
- Older browsers that don't support WebP
- The HTML `<picture>` element's fallback chain
- Future re-conversion at different quality settings

### ✅ How DeckLoader Uses WebP
The project uses the `<picture>` element for progressive enhancement:
```html
<picture>
  <source srcset="card.webp" type="image/webp">   <!-- Modern browsers -->
  <source srcset="card.jpg" type="image/jpeg">    <!-- Fallback -->
  <img src="card.jpg" alt="Card Name">            <!-- Final fallback -->
</picture>
```

This is handled automatically by `DeckLoader.js:258-306`.

## File Size Expectations

### Typical Compression Results:
- **PNG to WebP**: 80-96% size reduction
  - Example: 700KB PNG → 100KB WebP (86% smaller)
- **JPG to WebP**: 20-50% size reduction
  - Example: 200KB JPG → 100KB WebP (50% smaller)

### Project Statistics (from log):
- Total images converted: ~316 full-size images
- Average reduction: ~85%
- Space saved: ~50-70MB for full-size images

## Troubleshooting

### Issue 1: cwebp command not found
**Solution**: Install WebP tools (see Prerequisites)

### Issue 2: Permission denied
**Solution**: Make script executable
```bash
chmod +x convert-to-webp.sh
```

### Issue 3: Images look blurry
**Solution**: Increase quality setting to 90
```bash
cwebp -q 90 input.png -o output.webp
```

### Issue 4: Some images fail to convert
**Solution**: Check file corruption
```bash
file image.png  # Verify file type
```

## Testing After Conversion

### 1. Browser Testing
Test in multiple browsers to ensure fallback works:
- Chrome/Edge (WebP supported)
- Safari (WebP supported since v14)
- Firefox (WebP supported)
- Older browsers (should use PNG/JPG fallback)

### 2. Visual Quality Check
Compare original and WebP side-by-side:
```bash
# Open both files for visual comparison
open original.png webp-version.webp
```

### 3. Performance Testing
Check page load improvements:
- Use browser DevTools Network tab
- Compare before/after file sizes
- Measure page load time

## Converting Thumbnails

If you need to convert thumbnails separately:
```bash
# Find and convert thumbnail images
find ./decks -type f \( -name "*.png" -o -name "*.jpg" \) -path "*thumbnails*" | while read file; do
    webp_file="${file%.*}.webp"
    if [ ! -f "$webp_file" ]; then
        echo "Converting thumbnail: $(basename "$file")"
        cwebp -q 85 "$file" -o "$webp_file"
    fi
done
```

Note: Thumbnails may already have both `.webp` and `.jpg` versions as seen in the project structure.

## Batch Operations

### Convert Only New Images
```bash
# Find images added in the last 7 days
find ./decks -type f \( -name "*.png" -o -name "*.jpg" \) -mtime -7 ! -path "*thumbnails*" | while read file; do
    webp_file="${file%.*}.webp"
    if [ ! -f "$webp_file" ]; then
        cwebp -q 85 "$file" -o "$webp_file"
    fi
done
```

### Convert Specific Deck
```bash
# Convert only artistic-tarot-cards deck
find ./decks/artistic-tarot-cards -type f \( -name "*.png" -o -name "*.jpg" \) | while read file; do
    webp_file="${file%.*}.webp"
    if [ ! -f "$webp_file" ]; then
        cwebp -q 85 "$file" -o "$webp_file"
    fi
done
```

## Integration with Claude Workflow

When user says "convert images to webp" or "optimize images":
1. **THIS SKILL ACTIVATES**
2. Check for cwebp installation
3. Find images that need conversion
4. Run conversion with progress updates
5. Generate statistics report
6. Verify conversions completed successfully
7. Report file size savings to user

## Conversion Report Template

After conversion, provide this report:
```
🖼️  WebP Conversion Report
=========================

Images Processed:
  ✓ Successfully converted: X images
  ⏭️  Skipped (already exist): X images
  ❌ Failed: X images

Quality Setting: 85

File Size Impact:
  Original total: X.X MB
  WebP total: X.X MB
  Space saved: X.X MB (XX% reduction)

Average Reduction: XX% per image

Status:
  ✅ All images converted successfully
  ✅ Original files preserved as fallbacks
  ✅ Ready for deployment

Next Steps:
  - Test images in browser
  - Verify quality is acceptable
  - Check DeckLoader is serving WebP to modern browsers
```

## Best Practices

### DO:
- ✅ Use quality 85 for full-size images
- ✅ Keep original PNG/JPG files as fallbacks
- ✅ Test visual quality after conversion
- ✅ Convert in batches for better control
- ✅ Generate statistics reports

### DON'T:
- ❌ Delete original images after conversion
- ❌ Use quality below 80 for primary images
- ❌ Convert thumbnails unnecessarily (if already optimized)
- ❌ Skip verification step
- ❌ Forget to test in browsers

## Post-Conversion Checklist

- [ ] All target images converted to WebP
- [ ] Original files still present
- [ ] Visual quality is acceptable
- [ ] File sizes significantly reduced
- [ ] DeckLoader.js correctly serving WebP
- [ ] Tested in modern browsers (WebP loads)
- [ ] Tested in older browsers (fallback works)
- [ ] Statistics report generated
- [ ] No conversion errors

## Additional Resources

- [WebP Documentation](https://developers.google.com/speed/webp/)
- [cwebp Command Reference](https://developers.google.com/speed/webp/docs/cwebp)
- [Browser Support for WebP](https://caniuse.com/webp)
- Project file: `DeckLoader.js` (lines 258-306) - Responsive image implementation
