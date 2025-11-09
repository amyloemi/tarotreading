// Main application logic

// Global variable for current deck
let currentDeck = null;

// Main deck selection function
async function selectDeck(deckType) {
	currentDeck = deckType;

	// Ensure readings are loaded
	if (!readingsData[deckType]) {
		await loadReadings();
	}

	// Hide deck selection
	const deckSelection = document.getElementById('deck-selection');
	deckSelection.classList.add('fade-out');

	setTimeout(() => {
		deckSelection.style.display = 'none';

		// Show shuffle container and start animation
		const shuffleContainer = document.getElementById('shuffle-container');
		shuffleContainer.classList.remove('hidden');

		// Scroll to show question at top of screen
		const questionContainer = document.getElementById('question-container');
		setTimeout(() => {
			questionContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}, 100);

		createShuffleDeck();
		shuffleAnimation();
	}, 500);
}

function returnToDeckSelection() {
	// Remove reading box
	const readingBox = document.getElementById('reading-box');
	if (readingBox) {
		readingBox.remove();
	}

	// Hide card display and shuffle container
	document.getElementById('card-container').classList.add('hidden');
	document.getElementById('shuffle-container').classList.add('hidden');

	// Remove fade-out from instruction and preserve it
	const instruction = document.getElementById('shuffle-instruction');
	if (instruction) {
		instruction.classList.remove('fade-out');
	}

	// Clear card content
	document.getElementById('card-image-container').innerHTML = '';
	document.getElementById('card-name').textContent = '';
	document.getElementById('card-orientation').textContent = '';
	document.getElementById('card-reading').textContent = '';
	document.getElementById('card-reading').classList.remove('revealed');
	document.getElementById('action-buttons').style.display = 'none';
	document.getElementById('action-buttons').classList.remove('revealed');

	// Clear animation area and remove fade-border, but preserve instruction
	const animArea = document.getElementById('animation-area');
	animArea.innerHTML = '';
	if (instruction) {
		animArea.appendChild(instruction);
	}
	animArea.classList.remove('fade-border');
	animArea.classList.remove('allow-overflow');
	animArea.style.minHeight = ''; // Reset height to default
	animCards = [];

	// Reset selected card globals
	selectedCardElement = null;
	selectedCardScale = 1;
	selectedCardTopPosition = 0;

	// Show deck selection
	const deckSelection = document.getElementById('deck-selection');
	deckSelection.style.display = 'block';
	deckSelection.classList.remove('fade-out');

	// Reset
	currentDeck = null;
	currentCard = null;
	isAnimating = false;
	canPickCard = false;

	// Scroll to top
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

function drawAnotherCard() {
	// Remove reading box
	const readingBox = document.getElementById('reading-box');
	if (readingBox) {
		readingBox.remove();
	}

	// Hide card display and shuffle container
	document.getElementById('card-container').classList.add('hidden');
	document.getElementById('shuffle-container').classList.add('hidden');

	// Remove fade-out from instruction and preserve it
	const instruction = document.getElementById('shuffle-instruction');
	if (instruction) {
		instruction.classList.remove('fade-out');
	}

	// Clear card content
	document.getElementById('card-image-container').innerHTML = '';
	document.getElementById('card-name').textContent = '';
	document.getElementById('card-orientation').textContent = '';
	document.getElementById('card-reading').textContent = '';
	document.getElementById('card-reading').classList.remove('revealed');
	document.getElementById('action-buttons').style.display = 'none';
	document.getElementById('action-buttons').classList.remove('revealed');

	// Clear animation area and remove fade-border, but preserve instruction
	const animArea = document.getElementById('animation-area');
	animArea.innerHTML = '';
	if (instruction) {
		animArea.appendChild(instruction);
	}
	animArea.classList.remove('fade-border');
	animArea.classList.remove('allow-overflow');
	animArea.style.minHeight = ''; // Reset height to default
	animCards = [];

	// Reset selected card globals
	selectedCardElement = null;
	selectedCardScale = 1;
	selectedCardTopPosition = 0;

	// Show deck selection
	const deckSelection = document.getElementById('deck-selection');
	deckSelection.style.display = 'block';
	deckSelection.classList.remove('fade-out');

	// Reset
	currentDeck = null;
	currentCard = null;
	isAnimating = false;
	canPickCard = false;

	// Scroll to top
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
	// Load readings on page load
	await loadReadings();

	// Set initial language
	const savedLanguage = localStorage.getItem('tarotLanguage') || 'en';
	currentLanguage = savedLanguage;
	document.getElementById('language-select').value = savedLanguage;

	const mobileSelect = document.getElementById('language-select-mobile');
	if (mobileSelect) {
		mobileSelect.value = savedLanguage;
	}

	// Update UI with saved language
	updateUILanguage();
});
