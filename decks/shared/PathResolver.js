/**
 * PathResolver.js
 * Unified path resolution for all pages (root and /pages/ subfolder)
 * Version: 1.0
 */

class PathResolver {
    /**
     * Determine base path based on current page location
     * Works for: index.html, pages/*.html
     */
    static getBasePath() {
        // Use absolute paths for HTTP(S)
        if (window.location.protocol.startsWith('http')) {
            // Check if we're in a subfolder
            const path = window.location.pathname;
            if (path.includes('/pages/')) {
                return '../';
            }
            return '';
        }

        // For file:// protocol, use relative paths
        const path = window.location.pathname;
        const isInSubfolder = path.includes('/pages/');

        return isInSubfolder ? '../' : '';
    }

    /**
     * Resolve path relative to current page
     * @param {...string} parts - Path components to join
     * @returns {string} Complete path
     *
     * Example: resolve('decks', 'images', 'major_arcana', '00-the-fool.png')
     * Returns: 'decks/images/major_arcana/00-the-fool.png' (from root)
     *       or '../decks/images/major_arcana/00-the-fool.png' (from /pages/)
     */
    static resolve(...parts) {
        const base = this.getBasePath();
        const path = parts.filter(p => p !== '').join('/');
        return base + path;
    }

    /**
     * Check if we're in a subfolder
     * @returns {boolean}
     */
    static isInSubfolder() {
        return window.location.pathname.includes('/pages/');
    }

    /**
     * Get current page name
     * @returns {string}
     */
    static getCurrentPage() {
        const path = window.location.pathname;
        return path.substring(path.lastIndexOf('/') + 1);
    }
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.PathResolver = PathResolver;
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PathResolver;
}
