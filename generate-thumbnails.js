#!/usr/bin/env node

/**
 * Thumbnail Generation Script for Tarot Card Images
 * Generates optimized WebP and JPEG thumbnails at 300x520px
 * Reduces image size by ~90% for faster mobile gallery loading
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');
const execAsync = promisify(exec);

// Configuration
const SOURCE_DIRS = [
    { source: './decks/images', output: './decks/images-thumbnails', name: 'Rider-Waite' },
    { source: './decks/artistic-tarot-cards', output: './decks/artistic-tarot-cards-thumbnails', name: 'Artistic' },
    // Miró cards are already small (~30KB), no thumbnails needed
];
const THUMBNAIL_WIDTH = 300;
const THUMBNAIL_HEIGHT = 520;
const JPEG_QUALITY = 80;
const WEBP_QUALITY = 80;

/**
 * Check if ImageMagick is installed
 */
async function checkImageMagick() {
    try {
        await execAsync('convert -version');
        return true;
    } catch (error) {
        console.error('❌ ImageMagick not found. Please install it:');
        console.error('   macOS: brew install imagemagick');
        console.error('   Ubuntu/Debian: sudo apt-get install imagemagick');
        console.error('   Windows: Download from https://imagemagick.org/');
        return false;
    }
}

/**
 * Get all image files recursively
 */
function getAllImageFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            getAllImageFiles(filePath, fileList);
        } else if (/\.(png|jpg|jpeg)$/i.test(file)) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

/**
 * Create directory structure
 */
function createDirectoryStructure(sourcePath, sourceDir, thumbnailDir) {
    const relativePath = path.relative(sourceDir, path.dirname(sourcePath));
    const targetDir = path.join(thumbnailDir, relativePath);

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    return targetDir;
}

/**
 * Generate thumbnail using ImageMagick
 */
async function generateThumbnail(sourcePath, outputPath, format) {
    const quality = format === 'webp' ? WEBP_QUALITY : JPEG_QUALITY;
    const outputFile = outputPath.replace(/\.(png|jpg|jpeg)$/i, `.${format}`);

    const command = `convert "${sourcePath}" -resize ${THUMBNAIL_WIDTH}x${THUMBNAIL_HEIGHT} -quality ${quality} "${outputFile}"`;

    try {
        await execAsync(command);
        return outputFile;
    } catch (error) {
        throw new Error(`Failed to generate ${format} thumbnail: ${error.message}`);
    }
}

/**
 * Process a single image
 */
async function processImage(sourcePath, sourceDir, thumbnailDir, index, total) {
    const relativePath = path.relative(sourceDir, sourcePath);
    console.log(`[${index + 1}/${total}] Processing: ${relativePath}`);

    try {
        // Create target directory
        const targetDir = createDirectoryStructure(sourcePath, sourceDir, thumbnailDir);
        const fileName = path.basename(sourcePath);
        const outputPath = path.join(targetDir, fileName);

        // Generate WebP thumbnail
        const webpFile = await generateThumbnail(sourcePath, outputPath, 'webp');
        const webpSize = fs.statSync(webpFile).size;

        // Generate JPEG thumbnail (fallback)
        const jpegFile = await generateThumbnail(sourcePath, outputPath, 'jpg');
        const jpegSize = fs.statSync(jpegFile).size;

        const originalSize = fs.statSync(sourcePath).size;
        const reduction = ((originalSize - webpSize) / originalSize * 100).toFixed(1);

        console.log(`  ✓ WebP: ${(webpSize / 1024).toFixed(1)}KB | JPEG: ${(jpegSize / 1024).toFixed(1)}KB | Reduction: ${reduction}%`);

        return { success: true, reduction, originalSize, webpSize, jpegSize };
    } catch (error) {
        console.error(`  ✗ Error: ${error.message}`);
        return { success: false, error: error.message };
    }
}

/**
 * Main execution
 */
async function main() {
    console.log('🎴 Tarot Card Thumbnail Generator\n');
    console.log(`Configuration:`);
    console.log(`  Size: ${THUMBNAIL_WIDTH}×${THUMBNAIL_HEIGHT}px`);
    console.log(`  Quality: WebP ${WEBP_QUALITY}%, JPEG ${JPEG_QUALITY}%\n`);

    // Check ImageMagick
    if (!await checkImageMagick()) {
        process.exit(1);
    }

    const globalStartTime = Date.now();
    const allResults = [];

    // Process each deck
    for (const config of SOURCE_DIRS) {
        console.log('='.repeat(60));
        console.log(`📦 Processing: ${config.name}`);
        console.log(`  Source: ${config.source}`);
        console.log(`  Output: ${config.output}`);
        console.log('='.repeat(60) + '\n');

        // Check if source directory exists
        if (!fs.existsSync(config.source)) {
            console.log(`⚠️  Skipping: Directory not found\n`);
            continue;
        }

        // Get all images
        console.log('📁 Scanning for images...');
        const imageFiles = getAllImageFiles(config.source);
        console.log(`Found ${imageFiles.length} images\n`);

        if (imageFiles.length === 0) {
            console.log(`⚠️  No images found, skipping\n`);
            continue;
        }

        // Create thumbnail directory
        if (!fs.existsSync(config.output)) {
            fs.mkdirSync(config.output, { recursive: true });
        }

        // Process images
        console.log('🔄 Generating thumbnails...\n');
        const startTime = Date.now();

        for (let i = 0; i < imageFiles.length; i++) {
            const result = await processImage(imageFiles[i], config.source, config.output, i, imageFiles.length);
            allResults.push(result);
        }

        // Deck summary
        const deckResults = allResults.slice(-imageFiles.length);
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        const successful = deckResults.filter(r => r.success).length;
        const totalOriginal = deckResults.reduce((sum, r) => sum + (r.originalSize || 0), 0);
        const totalWebp = deckResults.reduce((sum, r) => sum + (r.webpSize || 0), 0);
        const avgReduction = ((totalOriginal - totalWebp) / totalOriginal * 100).toFixed(1);

        console.log(`\n✓ ${config.name}: ${successful}/${imageFiles.length} processed in ${duration}s`);
        console.log(`  Reduction: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB → ${(totalWebp / 1024 / 1024).toFixed(1)}MB (${avgReduction}%)\n`);
    }

    // Global summary
    const globalDuration = ((Date.now() - globalStartTime) / 1000).toFixed(1);
    const successful = allResults.filter(r => r.success).length;
    const failed = allResults.filter(r => !r.success).length;

    const totalOriginal = allResults.reduce((sum, r) => sum + (r.originalSize || 0), 0);
    const totalWebp = allResults.reduce((sum, r) => sum + (r.webpSize || 0), 0);
    const totalJpeg = allResults.reduce((sum, r) => sum + (r.jpegSize || 0), 0);
    const avgReduction = totalOriginal > 0 ? ((totalOriginal - totalWebp) / totalOriginal * 100).toFixed(1) : 0;

    console.log('\n' + '='.repeat(60));
    console.log('📊 Global Summary');
    console.log('='.repeat(60));
    console.log(`✓ Successful: ${successful}`);
    console.log(`✗ Failed: ${failed}`);
    console.log(`⏱  Total Duration: ${globalDuration}s`);
    console.log(`💾 Original size: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB`);
    console.log(`💾 WebP size: ${(totalWebp / 1024 / 1024).toFixed(1)}MB`);
    console.log(`💾 JPEG size: ${(totalJpeg / 1024 / 1024).toFixed(1)}MB`);
    console.log(`📉 Average reduction: ${avgReduction}%`);
    console.log('='.repeat(60));
    console.log('\n✨ Thumbnail generation complete!');
}

// Run the script
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
