// Card Meanings Loader
// Loads unified card meanings from JSON and makes them available globally

(async function() {
    try {
        const basePath = (function() {
            if (window.location.protocol.startsWith('http')) {
                return '/';
            }
            const currentPath = window.location.pathname;
            const parentFolder = currentPath.split('/').slice(-2, -1)[0];
            const isInPagesFolder = parentFolder === 'pages' || currentPath.includes('/pages/');
            return isInPagesFolder ? '../' : '';
        })();

        const response = await fetch(basePath + 'decks/data/card-meanings.json');
        if (!response.ok) {
            throw new Error(`Failed to load card meanings: ${response.status}`);
        }

        const cardMeanings = await response.json();

        // Make available globally
        window.cardMeanings = cardMeanings;

        // For backward compatibility with existing code expecting riderWaiteData.meanings
        if (typeof riderWaiteData === 'undefined') {
            window.riderWaiteData = {};
        }
        window.riderWaiteData.meanings = cardMeanings;

        console.log('Card meanings loaded successfully');
    } catch (error) {
        console.error('Error loading card meanings:', error);
    }
})();
