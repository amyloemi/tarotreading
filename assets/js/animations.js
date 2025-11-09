// Shuffle animation variables
let animCards = [];
let isAnimating = false;
let canPickCard = false;
let selectedCardElement = null;
let selectedCardScale = 1;
let selectedCardTopPosition = 0;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function setInstruction(text) {
	const instruction = document.getElementById('shuffle-instruction');
	if (instruction) {
		instruction.textContent = text;
	}
}

function createAnimatedCard(index, tarotCard) {
	const card = document.createElement('div');
	card.className = 'anim-card';
	card.dataset.index = index;
	card.dataset.cardName = tarotCard.name;

	const cardInner = document.createElement('div');
	cardInner.className = 'anim-card-inner';

	// Card face (front) - use thumbnail for faster loading
	const cardFace = document.createElement('div');
	cardFace.className = 'anim-card-face';
	const deckIdMap = {
		'rider': 'rider-waite',
		'artistic': 'artistic',
		'miro': 'miro'
	};
	const deckId = deckIdMap[currentDeck] || 'rider-waite';

	// Use thumbnail image for better performance during shuffle
	const imagePath = DeckLoader.getImagePath(deckId, tarotCard, true); // true for thumbnail
	const cardImg = document.createElement('img');
	cardImg.src = imagePath;
	cardImg.alt = tarotCard.name;
	cardImg.loading = 'eager'; // Load immediately for smoother animation
	cardFace.appendChild(cardImg);

	// Card back - deck-specific image with fallback
	const cardBack = document.createElement('div');
	cardBack.className = 'anim-card-back';

	// Get deck-specific card back image path
	const cardBackPaths = {
		'rider': 'decks/images/card-back.png',
		'artistic': 'decks/artistic-tarot-cards/card-back.png',
		'miro': 'decks/miro-tarot-cards/card-back.png'
	};
	const cardBackPath = cardBackPaths[currentDeck] || 'decks/images/card-back.png';

	// Create image element with error fallback
	const cardBackImg = document.createElement('img');
	cardBackImg.src = cardBackPath;
	cardBackImg.alt = 'Card Back';
	cardBackImg.loading = 'eager'; // Load immediately for visible cards
	cardBackImg.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 8px;';

	// Fallback to CSS gradient if image fails to load
	cardBackImg.onerror = function() {
		cardBack.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
		cardBack.style.border = '3px solid #FFD700';
		cardBack.innerHTML = '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-size: 2em;">🔮</div>';
	};

	cardBack.appendChild(cardBackImg);

	cardInner.appendChild(cardFace);
	cardInner.appendChild(cardBack);
	card.appendChild(cardInner);

	// Initial position (center, stacked)
	card.style.left = '50%';
	card.style.top = '50%';
	card.style.transform = 'translate(-50%, -50%)';
	card.style.zIndex = index;

	card.addEventListener('click', () => selectAnimatedCard(card, tarotCard));

	return card;
}

function createShuffleDeck() {
	const container = document.getElementById('animation-area');

	// Preserve the shuffle instruction element
	const instruction = document.getElementById('shuffle-instruction');

	// Clear all existing cards explicitly before clearing innerHTML
	const existingCards = container.querySelectorAll('.anim-card');
	existingCards.forEach(card => {
		if (card.parentNode) {
			card.parentNode.removeChild(card);
		}
	});

	container.innerHTML = '';

	// Re-append the instruction if it exists
	if (instruction) {
		container.appendChild(instruction);
	}

	animCards = [];

	// Get all cards from DeckLoader
	const allTarotCards = DeckLoader.getAllCards();
	const shuffledTarot = [...allTarotCards].sort(() => Math.random() - 0.5);

	// Create cards for animation - fewer on mobile for better performance
	const isMobile = window.innerWidth <= 768;
	const numCards = isMobile ? 30 : 50;

	for (let i = 0; i < numCards; i++) {
		const tarotCard = shuffledTarot[i % shuffledTarot.length];
		const card = createAnimatedCard(i, tarotCard);
		container.appendChild(card);
		animCards.push(card);
	}
}

async function riffleShuffleAnimation(speed = 'normal') {
	const halfLength = Math.floor(animCards.length / 2);

	// Speed presets
	const speeds = {
		fast: { split: 200, pause: 100, interleave: 4 },
		normal: { split: 800, pause: 500, interleave: 50 }
	};

	const timing = speeds[speed] || speeds.normal;

	// Split deck into two halves
	const leftHalf = animCards.slice(0, halfLength);
	const rightHalf = animCards.slice(halfLength);
	const splitInterval = timing.split / animCards.length;

	// Position both halves simultaneously
	for (let i = 0; i < Math.max(leftHalf.length, rightHalf.length); i++) {
		if (i < leftHalf.length) {
			leftHalf[i].style.left = 'calc(50% - 150px)';
			leftHalf[i].style.top = '50%';
			leftHalf[i].style.transform = `translate(-50%, -50%) rotate(-5deg)`;
			leftHalf[i].style.zIndex = i;
		}
		if (i < rightHalf.length) {
			rightHalf[i].style.left = 'calc(50% + 150px)';
			rightHalf[i].style.top = '50%';
			rightHalf[i].style.transform = `translate(-50%, -50%) rotate(5deg)`;
			rightHalf[i].style.zIndex = i + halfLength;
		}
		await sleep(splitInterval);
	}

	await sleep(timing.pause);

	// Interleave cards (riffle effect)
	const maxLength = Math.max(leftHalf.length, rightHalf.length);
	for (let i = 0; i < maxLength; i++) {
		if (i < leftHalf.length) {
			leftHalf[i].style.left = '50%';
			leftHalf[i].style.top = '50%';
			leftHalf[i].style.transform = 'translate(-50%, -50%)';
			leftHalf[i].style.zIndex = i * 2;
			await sleep(timing.interleave);
		}
		if (i < rightHalf.length) {
			rightHalf[i].style.left = '50%';
			rightHalf[i].style.top = '50%';
			rightHalf[i].style.transform = 'translate(-50%, -50%)';
			rightHalf[i].style.zIndex = i * 2 + 1;
			await sleep(timing.interleave);
		}
	}
}

async function displayCardsInRow() {
	const container = document.getElementById('animation-area');
	const containerRect = container.getBoundingClientRect();
	const containerWidth = containerRect.width;
	const containerHeight = containerRect.height;

	const margin = 80;
	const totalWidth = containerWidth - margin * 2;
	const spacing = Math.min(50, totalWidth / animCards.length);

	const totalCardSpread = (animCards.length - 1) * spacing;
	const startX = (containerWidth - totalCardSpread) / 2;
	const baseY = containerHeight * 0.5; // Center vertically
	const arcHeight = 30;

	for (let i = 0; i < animCards.length; i++) {
		const progress = i / (animCards.length - 1);
		const x = startX + i * spacing;

		const arcOffset = Math.sin(progress * Math.PI) * arcHeight;
		const y = baseY - arcOffset;

		const rotation = (progress - 0.5) * 8;

		animCards[i].style.left = `${x}px`;
		animCards[i].style.top = `${y}px`;
		animCards[i].style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
		animCards[i].style.zIndex = i;
		animCards[i].style.opacity = '1';
		animCards[i].style.pointerEvents = 'auto';

		await sleep(40);
	}
}

async function shuffleAnimation() {
	if (isAnimating) return;
	isAnimating = true;
	canPickCard = false;

	setInstruction('Shuffling the cards...');

	// Mark all cards as shuffling
	animCards.forEach(card => card.classList.add('shuffling'));

	// Phase 1: Initial Riffle Shuffle (fast)
	await riffleShuffleAnimation('fast');
	await sleep(400);

	// Phase 2: Infinity Symbol Spread (simplified on mobile to prevent rendering artifacts)
	const spreadInterval = 1000 / animCards.length;
	const isMobile = window.innerWidth <= 768;

	for (let i = 0; i < animCards.length; i++) {
		const progress = i / (animCards.length - 1);

		const t = progress * Math.PI * 8;

		const minScale = 40;
		const maxScale = 220;
		const a = minScale + (maxScale - minScale) * Math.pow(progress, 0.8);

		const sinT = Math.sin(t);
		const cosT = Math.cos(t);
		const denominator = 1 + sinT * sinT;

		const lemniscateX = (a * cosT) / denominator;
		const lemniscateY = (a * sinT * cosT) / denominator;

		const container = document.getElementById('animation-area');
		const containerRect = container.getBoundingClientRect();
		const containerWidth = containerRect.width;
		const containerHeight = containerRect.height;
		const centerX = containerWidth / 2;
		const centerY = containerHeight / 2;

		const x = centerX + lemniscateX;
		const y = centerY + lemniscateY;

		const rotationSpeed = 360 + (progress * 720);
		const rotation = t * (180 / Math.PI) + rotationSpeed;

		const scale = 0.8 + (progress * 0.4);

		animCards[i].style.left = `${x}px`;
		animCards[i].style.top = `${y}px`;

		// Simplified transform for mobile to prevent GPU rendering artifacts
		if (isMobile) {
			animCards[i].style.transform = `translate(-50%, -50%)
				rotate(${rotation}deg)
				scale(${scale})`;
		} else {
			const tiltX = sinT * 15;
			const tiltY = cosT * 10;
			animCards[i].style.transform = `translate(-50%, -50%)
				rotate(${rotation}deg)
				rotateX(${tiltX}deg)
				rotateY(${tiltY}deg)
				scale(${scale})`;
		}

		animCards[i].style.opacity = 0.7 + (progress * 0.3);

		await sleep(spreadInterval);
	}

	await sleep(800);

	// Phase 3: Gather to center (simplified on mobile)
	const gatherInterval = 20;

	for (let i = animCards.length - 1; i >= 0; i--) {
		animCards[i].style.left = '50%';
		animCards[i].style.top = '50%';

		// Simplified transform for mobile to prevent GPU rendering artifacts
		if (isMobile) {
			const rotation = (i % 4) * 90; // Simple rotation variation
			animCards[i].style.transform = `translate(-50%, -50%)
				rotate(${rotation}deg)
				scale(1)`;
		} else {
			const tumbleX = (i % 3 - 1) * 180;
			const tumbleY = (i % 2) * 360;
			animCards[i].style.transform = `translate(-50%, -50%)
				rotateY(${720 + tumbleY}deg)
				rotateX(${tumbleX}deg)
				scale(1)`;
		}

		animCards[i].style.opacity = '1';
		animCards[i].style.zIndex = animCards.length - i;

		await sleep(gatherInterval);
	}

	await sleep(800);

	// Phase 4: Final riffle shuffle
	await riffleShuffleAnimation();

	await sleep(800);

	// Phase 5: Display in row for selection
	setInstruction('Pick a card...');
	await displayCardsInRow();

	// Remove shuffling class
	animCards.forEach(card => card.classList.remove('shuffling'));

	canPickCard = true;
	isAnimating = false;
}

async function selectAnimatedCard(selectedCard, tarotCard) {
	if (!canPickCard || isAnimating) return;

	isAnimating = true;
	canPickCard = false;

	// Randomly select actual card from all 78 cards at moment of click
	const allTarotCards = DeckLoader.getAllCards();
	const randomIndex = Math.floor(Math.random() * allTarotCards.length);
	const actualCard = allTarotCards[randomIndex];

	// Store selected card globally
	selectedCardElement = selectedCard;

	// Fade out instruction text
	const instruction = document.getElementById('shuffle-instruction');
	instruction.classList.add('fade-out');

	// Fade out the animation border immediately on card click
	const animArea = document.getElementById('animation-area');
	animArea.classList.add('fade-border');

	// Mark as selected
	selectedCard.classList.add('selected');

	// Determine if reversed
	const isReversed = Math.random() < 0.3;

	// Make selected card glow
	selectedCard.style.boxShadow = '0 0 40px rgba(255, 255, 255, 1)';
	selectedCard.style.filter = 'brightness(1.3)';

	await sleep(300);

	// Fade out non-selected cards completely
	const unpickedCards = animCards.filter(card => card !== selectedCard);

	for (let i = 0; i < unpickedCards.length; i++) {
		// Immediately hide cards completely to prevent rendering artifacts
		unpickedCards[i].style.transition = 'none';
		unpickedCards[i].style.opacity = '0';
		unpickedCards[i].style.visibility = 'hidden'; // Hide immediately, not later!
		unpickedCards[i].style.display = 'none'; // Remove from layout immediately
		unpickedCards[i].style.transform = 'translate(-50%, -50%) scale(0.3)';
		await sleep(20);
	}

	// Immediately hide and remove unpicked cards to prevent visual artifacts
	unpickedCards.forEach(card => {
		card.style.visibility = 'hidden'; // Hide from rendering
		card.style.display = 'none'; // Hide immediately
		card.style.pointerEvents = 'none'; // Disable all interaction
		if (card.parentNode) {
			card.parentNode.removeChild(card);
		}
	});

	await sleep(500);

	// Allow overflow so card won't be clipped when scaled up
	animArea.classList.add('allow-overflow');

	// Pre-calculate and set animation area height for smooth footer transition
	const isMobile = window.innerWidth <= 768;
	const cardWidth = isMobile ? 88 : 132;
	const cardHeight = isMobile ? 132 : 198;

	// Estimate scale (same logic as in positionCardAndReadingBox)
	let estimatedScale;
	if (isMobile) {
		const viewportWidth = window.innerWidth;
		const maxCardWidth = viewportWidth * 0.75;
		const scaleByWidth = maxCardWidth / cardWidth;
		estimatedScale = Math.min(scaleByWidth, 5);
	} else {
		const maxDesktopHeight = window.innerHeight * 0.65;
		const scaleByHeight = maxDesktopHeight / cardHeight;
		estimatedScale = Math.min(scaleByHeight, 3);
	}

	const scaledCardHeight = cardHeight * estimatedScale;

	if (isMobile) {
		// Mobile: card at top (30px) + scaled height + gap (20px) + reading box estimate (500px) + buffer (100px)
		const estimatedHeight = 30 + scaledCardHeight + 20 + 500 + 100;
		animArea.style.minHeight = `${estimatedHeight}px`;
	} else {
		// Desktop: max of card or reading box height + buffer
		const estimatedHeight = Math.max(scaledCardHeight, 600) + 100;
		animArea.style.minHeight = `${estimatedHeight}px`;
	}

	// Position card using new function with enhanced depth shadow and golden glow
	selectedCard.style.boxShadow = `
		0 0 40px rgba(212, 175, 55, 0.6),
		0 0 80px rgba(212, 175, 55, 0.3),
		0 20px 60px rgba(0, 0, 0, 0.4),
		0 10px 30px rgba(0, 0, 0, 0.3),
		0 5px 15px rgba(0, 0, 0, 0.2),
		0 0 0 1px rgba(255, 255, 255, 0.1)
	`;
	selectedCard.style.zIndex = 1000;
	selectedCard.style.transition = 'all 0.8s ease';
	positionCardAndReadingBox();

	await sleep(800);

	// Update card face to show the randomly selected card and wait for it to load
	const deckIdMap = {
		'rider': 'rider-waite',
		'artistic': 'artistic',
		'miro': 'miro'
	};
	const deckId = deckIdMap[currentDeck] || 'rider-waite';
	const cardFace = selectedCard.querySelector('.anim-card-face img');
	if (cardFace) {
		const actualImagePath = DeckLoader.getImagePath(deckId, actualCard, true); // Use thumbnail

		// Preload the image before changing src to prevent flicker
		await new Promise((resolve) => {
			const tempImg = new Image();
			tempImg.onload = () => {
				cardFace.src = actualImagePath;
				cardFace.alt = actualCard.name;
				resolve();
			};
			tempImg.onerror = () => {
				// If image fails to load, still update but don't wait
				cardFace.src = actualImagePath;
				cardFace.alt = actualCard.name;
				resolve();
			};
			tempImg.src = actualImagePath;
		});
	}

	// Flip the card to show front
	if (isReversed) {
		selectedCard.classList.add('reversed');
	} else {
		selectedCard.classList.add('flipped');
	}

	await sleep(800);

	// Get reading text using the randomly selected card
	let readingEnglish = getReadingFromJSON(currentDeck, actualCard.name, currentQuestion, isReversed);

	if (!readingEnglish) {
		const meaning = getCardMeaning(actualCard.name);
		if (meaning) {
			readingEnglish = await generateDailyAdvice(actualCard.name, meaning, isReversed, 'en');
		}
	}

	// Translate if needed
	let reading = readingEnglish;
	if (currentLanguage !== 'en') {
		reading = await translateText(readingEnglish, currentLanguage);
	}

	// Store current card info
	currentCard = actualCard;
	currentIsReversed = isReversed;

	// Create and show reading box
	showReadingBox(actualCard, isReversed, reading);

	isAnimating = false;
}
