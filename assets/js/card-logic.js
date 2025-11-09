// Card reading and display logic

// Global variables for card state
let currentCard = null;
let currentIsReversed = false;
let readingsData = {
	miro: null,
	artistic: null,
	rider: null
};

// Load reading JSON files
async function loadReadings() {
	try {
		const [miroResponse, artisticResponse, riderResponse] = await Promise.all([
			fetch('data/miro-readings.json'),
			fetch('data/artistic-readings.json'),
			fetch('data/rider-readings.json')
		]);

		readingsData.miro = await miroResponse.json();
		readingsData.artistic = await artisticResponse.json();
		readingsData.rider = await riderResponse.json();

		console.log('Readings loaded successfully');
	} catch (error) {
		console.error('Error loading readings:', error);
	}
}

function getCardMeaning(cardName) {
	if (!riderWaiteData || !riderWaiteData.meanings) return null;

	// Check major arcana
	const majorCard = riderWaiteData.meanings.major_arcana.find(c => c.name === cardName);
	if (majorCard) {
		return {
			upright: majorCard.upright,
			reversed: majorCard.reversed,
			type: 'major'
		};
	}

	// Check minor arcana
	for (const suit in riderWaiteData.meanings.minor_arcana) {
		const minorCard = riderWaiteData.meanings.minor_arcana[suit].find(c => c.name === cardName);
		if (minorCard) {
			return {
				upright: minorCard.upright,
				reversed: minorCard.reversed,
				type: 'minor',
				suit: suit
			};
		}
	}

	return null;
}

// Generate daily advice based on card meaning
async function generateDailyAdvice(cardName, meaning, isReversed, language = 'en') {
	const meaningTextEn = isReversed ? meaning.reversed : meaning.upright;

	// First, generate the English reading
	const templates = {
		reversed_major: `Today, pay attention to ${meaningTextEn}. This energy is blocked or working internally. Take time for introspection and address what's holding you back from within.`,
		reversed_minor: `Today's guidance: ${meaningTextEn} needs your attention. Something in this area is blocked or out of balance. Face it honestly and work to restore flow.`,
		upright_major: `Today brings the powerful energy of ${meaningTextEn}. Embrace this theme fully - it holds an important lesson or opportunity for you. Let it guide your choices.`,
		upright_minor: `Today's message: ${meaningTextEn}. Lean into this energy and let it shape your day. This is what's most important for you to focus on right now.`
	};

	let englishReading;
	if (isReversed) {
		englishReading = meaning.type === 'major' ? templates.reversed_major : templates.reversed_minor;
	} else {
		englishReading = meaning.type === 'major' ? templates.upright_major : templates.upright_minor;
	}

	// If English, return directly
	if (language === 'en') {
		return englishReading;
	}

	// For other languages, translate the entire English reading
	return await translateText(englishReading, language);
}

function getReadingFromJSON(deckType, cardName, question, isReversed) {
	const data = readingsData[deckType];
	if (!data || !data.readings) {
		console.error('No readings data for deck:', deckType);
		return null;
	}

	const cardReading = data.readings.find(r => r.card_name === cardName);
	if (!cardReading || !cardReading.questions) {
		console.error('No reading found for card:', cardName);
		return null;
	}

	const questionReading = cardReading.questions[question];
	if (!questionReading) {
		console.error('No reading found for question:', question);
		return null;
	}

	return isReversed ? questionReading.reversed : questionReading.upright;
}

function renderCardUnified(deckId, card, isReversed) {
	const container = document.getElementById('card-image-container');
	if (!container) {
		console.error('Card container not found');
		return;
	}

	container.innerHTML = '';
	container.classList.remove('loaded');

	const picture = DeckLoader.createResponsiveImage(deckId, card, {
		thumbnail: true,
		loading: 'eager',
		className: isReversed ? 'reversed' : ''
	});

	const img = picture.querySelector('img');

	DeckLoader.addErrorHandler(img);

	if (typeof PerformanceMonitor !== 'undefined') {
		PerformanceMonitor.measureImageLoad(img, deckId, card.name);
	}

	img.onload = () => {
		container.classList.add('loaded');
	};

	img.onerror = () => {
		container.classList.add('loaded');
	};

	container.appendChild(picture);
}

function showReadingBox(card, isReversed, reading) {
	const trans = translations[currentLanguage];

	// Remove existing reading box if any
	const existingBox = document.getElementById('reading-box');
	if (existingBox) {
		existingBox.remove();
	}

	// Create reading box
	const readingBox = document.createElement('div');
	readingBox.id = 'reading-box';
	readingBox.innerHTML = `
		<div class="reading-card-name-container">
			<div class="reading-card-name">${card.name}</div>
			<div class="reading-card-orientation">${isReversed ? `(${trans.reversed})` : `(${trans.upright})`}</div>
		</div>
		<div class="reading-text">${reading}</div>
		<div class="reading-buttons">
			<button class="btn btn-primary" onclick="drawAnotherCard()">
				<span>${trans.drawAnother}</span>
			</button>
			<button class="btn btn-secondary" onclick="returnToDeckSelection()">
				<span>${trans.changeDeck}</span>
			</button>
		</div>
	`;

	// Append to animation area instead of body
	const animArea = document.getElementById('animation-area');
	animArea.appendChild(readingBox);

	// Position it relative to the card after DOM renders and all animations settle
	// Use requestAnimationFrame to ensure DOM has rendered
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			positionCardAndReadingBox();
		});
	});

	// Show with fade in
	setTimeout(() => {
		readingBox.classList.add('show');
	}, 100);
}

async function showFinalReading(selectedCard, isReversed) {
	const cardImageContainer = document.getElementById('card-image-container');
	const cardName = document.getElementById('card-name');
	const cardOrientation = document.getElementById('card-orientation');
	const cardReading = document.getElementById('card-reading');

	// Clear previous content
	cardImageContainer.innerHTML = '';
	cardName.textContent = '';
	cardOrientation.textContent = '';
	cardReading.textContent = '';

	// Get reading
	let readingEnglish = getReadingFromJSON(currentDeck, selectedCard.name, currentQuestion, isReversed);

	if (!readingEnglish) {
		const meaning = getCardMeaning(selectedCard.name);
		if (meaning) {
			readingEnglish = await generateDailyAdvice(selectedCard.name, meaning, isReversed, 'en');
		}
	}

	// Translate if needed
	let reading = readingEnglish;
	if (currentLanguage !== 'en') {
		reading = await translateText(readingEnglish, currentLanguage);
	}

	// Store current card info
	currentCard = selectedCard;
	currentIsReversed = isReversed;

	// Render card
	const deckIdMap = {
		'rider': 'rider-waite',
		'artistic': 'artistic',
		'miro': 'miro'
	};
	const deckId = deckIdMap[currentDeck] || 'rider-waite';
	renderCardUnified(deckId, selectedCard, isReversed);

	// Update card info
	const trans = translations[currentLanguage];
	cardName.textContent = selectedCard.name;
	const leftParen = currentLanguage === 'zh' ? '（' : '(';
	const rightParen = currentLanguage === 'zh' ? '）' : ')';
	cardOrientation.textContent = isReversed ? `${leftParen}${trans.reversed}${rightParen}` : `${leftParen}${trans.upright}${rightParen}`;
	cardReading.textContent = reading;

	// Show card container with reading already visible
	document.getElementById('card-container').classList.remove('hidden');
	document.getElementById('card-reading').classList.add('revealed');
	document.getElementById('action-buttons').style.display = 'flex';
	document.getElementById('action-buttons').classList.add('revealed');
}

function positionCardAndReadingBox() {
	if (!selectedCardElement) return;

	const isMobile = window.innerWidth <= 768;
	const animArea = document.getElementById('animation-area');
	const animAreaRect = animArea.getBoundingClientRect();

	// Current card dimensions (before scaling)
	const cardWidth = isMobile ? 88 : 132;
	const cardHeight = isMobile ? 132 : 198;

	// Calculate card scale
	let finalScale;
	if (isMobile) {
		// Mobile: scale up to make card large and prominent
		const viewportWidth = window.innerWidth;
		const maxCardWidth = viewportWidth * 0.75; // Card can take 75% of screen width
		const scaleByWidth = maxCardWidth / cardWidth;
		finalScale = Math.min(scaleByWidth, 5); // Much larger max scale
	} else {
		// Desktop: scale to fit nicely in left portion
		const maxDesktopHeight = window.innerHeight * 0.65;
		const scaleByHeight = maxDesktopHeight / cardHeight;
		finalScale = Math.min(scaleByHeight, 3);
	}

	// Store scale for later use
	selectedCardScale = finalScale;

	// Calculate scaled card dimensions
	const scaledCardWidth = cardWidth * finalScale;
	const scaledCardHeight = cardHeight * finalScale;

	// Position card and reading box
	if (isMobile) {
		// MOBILE: Card at top, reading box below it
		// Position card 30px from top of animation area
		const cardTopPosition = 30;
		const cardLeftPosition = animAreaRect.width / 2;

		selectedCardElement.style.left = `${cardLeftPosition}px`;
		selectedCardElement.style.top = `${cardTopPosition}px`;
		selectedCardElement.style.transformOrigin = 'top center'; // Scale from top, not center
		selectedCardElement.style.transform = `translate(-50%, 0) scale(${finalScale})`; // No vertical centering

		// Position reading box below card with 20px gap
		const readingBox = document.getElementById('reading-box');
		if (readingBox) {
			const readingBoxTop = cardTopPosition + scaledCardHeight + 20;

			readingBox.style.left = '5%';
			readingBox.style.right = '5%';
			readingBox.style.top = `${readingBoxTop}px`;
			readingBox.style.width = 'auto';
			readingBox.style.maxHeight = 'none';
			readingBox.style.overflowY = 'visible';
			readingBox.style.zIndex = '1001';

			// Pre-calculate required height to prevent layout shift
			// Use requestAnimationFrame to ensure reading box is rendered
			requestAnimationFrame(() => {
				const readingBoxRect = readingBox.getBoundingClientRect();
				const totalHeight = readingBoxTop + readingBoxRect.height + 40; // 40px bottom padding
				animArea.style.minHeight = `${totalHeight}px`;
			});
		}
	} else {
		// DESKTOP: Card on left, reading box on right, both top-aligned with animation area
		// Position card at 16.67% from left (center of left third)
		const cardLeftPercent = 16.67;

		// Both card and reading box start at top of animation area (0px)
		const readingBoxTopPosition = 0;
		const cardTopPosition = 0;

		selectedCardElement.style.left = `${cardLeftPercent}%`;
		selectedCardElement.style.top = `${cardTopPosition}px`;
		selectedCardElement.style.transformOrigin = 'top center'; // Scale from top, not center
		selectedCardElement.style.transform = `translate(-50%, 0) scale(${finalScale})`; // No vertical centering in transform

		// Store top position for alignment
		selectedCardTopPosition = cardTopPosition;

		// Position reading box on the right
		const readingBox = document.getElementById('reading-box');
		if (readingBox) {
			readingBox.style.left = '38%'; // Start at 38% to create gap
			readingBox.style.right = '2%';
			readingBox.style.top = `${readingBoxTopPosition}px`; // Box starts at top (0px)
			readingBox.style.width = 'auto';
			readingBox.style.maxWidth = 'none';
			readingBox.style.maxHeight = 'none';
			readingBox.style.overflowY = 'visible';
			readingBox.style.zIndex = '500';

			// Pre-calculate required height to prevent layout shift
			requestAnimationFrame(() => {
				const readingBoxRect = readingBox.getBoundingClientRect();
				const totalHeight = Math.max(cardTopPosition + scaledCardHeight, readingBoxTopPosition + readingBoxRect.height) + 60;
				animArea.style.minHeight = `${totalHeight}px`;
			});
		}
	}
}
