// Language translations
const translations = {
	en: {
		title: "Card of Today",
		subtitle: "Select one to begin your reading",
		chooseYourDeck: "Select one to begin your reading",
		question1: "Where should I focus my intention today?",
		question2: "What does this relationship need right now?",
		question3: "Am I on the right track?",
		riderWaite: "Rider-Waite Classic",
		artistic: "Artistic Tarot",
		miro: "Miró Surrealism",
		drawAnother: "Draw Another Card",
		changeDeck: "Choose Different Deck",
		upright: "Upright",
		reversed: "Reversed"
	},
	fr: {
		title: "Carte du Jour",
		subtitle: "Sélectionnez-en un pour commencer votre lecture",
		chooseYourDeck: "Sélectionnez-en un pour commencer votre lecture",
		question1: "Où devrais-je concentrer mon intention aujourd'hui?",
		question2: "De quoi cette relation a-t-elle besoin maintenant?",
		question3: "Suis-je sur la bonne voie?",
		riderWaite: "Rider-Waite Classique",
		artistic: "Tarot Artistique",
		miro: "Surréalisme de Miró",
		drawAnother: "Tirer une Autre Carte",
		changeDeck: "Choisir un Autre Jeu",
		upright: "À l'endroit",
		reversed: "Inversé"
	},
	es: {
		title: "Carta del Día",
		subtitle: "Selecciona uno para comenzar tu lectura",
		chooseYourDeck: "Selecciona uno para comenzar tu lectura",
		question1: "¿Dónde debería enfocar mi intención hoy?",
		question2: "¿Qué necesita esta relación ahora mismo?",
		question3: "¿Estoy en el camino correcto?",
		riderWaite: "Rider-Waite Clásico",
		artistic: "Tarot Artístico",
		miro: "Surrealismo de Miró",
		drawAnother: "Sacar Otra Carta",
		changeDeck: "Elegir Otro Mazo",
		upright: "Derecha",
		reversed: "Invertida"
	},
	zh: {
		title: "今日塔罗牌",
		subtitle: "选择一个开始您的阅读",
		chooseYourDeck: "选择一个开始您的阅读",
		question1: "今天我应该把注意力集中在哪里？",
		question2: "这段关系现在需要什么？",
		question3: "我走在正确的道路上吗？",
		riderWaite: "经典莱德伟特",
		artistic: "艺术塔罗",
		miro: "米罗超现实",
		drawAnother: "再抽一张牌",
		changeDeck: "选择其他牌组",
		upright: "正位",
		reversed: "逆位"
	},
	ja: {
		title: "今日のカード",
		subtitle: "リーディングを始めるには1つ選択してください",
		chooseYourDeck: "リーディングを始めるには1つ選択してください",
		question1: "今日はどこに意識を向けるべきですか？",
		question2: "この関係は今何を必要としていますか？",
		question3: "私は正しい道を歩んでいますか？",
		riderWaite: "ライダーウェイトクラシック",
		artistic: "アーティスティックタロット",
		miro: "ミロシュルレアリズム",
		drawAnother: "別のカードを引く",
		changeDeck: "別のデッキを選択",
		upright: "正位置",
		reversed: "逆位置"
	},
	ko: {
		title: "오늘의 카드",
		subtitle: "리딩을 시작하려면 하나를 선택하세요",
		chooseYourDeck: "리딩을 시작하려면 하나를 선택하세요",
		question1: "오늘 어디에 의도를 집중해야 할까요?",
		question2: "이 관계는 지금 무엇이 필요할까요?",
		question3: "나는 올바른 길을 가고 있나요?",
		deckSubtitle: "리딩을 위한 예술 스타일 선택",
		riderWaite: "라이더 웨이트 클래식",
		artistic: "아티스틱 타로",
		miro: "미로 초현실주의",
		drawAnother: "다른 카드 뽑기",
		changeDeck: "다른 덱 선택",
		upright: "정방향",
		reversed: "역방향"
	}
};

// Load saved language preference or default to English
let currentLanguage = localStorage.getItem('tarotLanguage') || 'en';

// Language change handlers (called from HTML)
function changeLanguage() {
	currentLanguage = document.getElementById('language-select').value;

	const mobileSelect = document.getElementById('language-select-mobile');
	if (mobileSelect) mobileSelect.value = currentLanguage;

	localStorage.setItem('tarotLanguage', currentLanguage);
	updateUILanguage();
}

function changeMobileLanguage() {
	currentLanguage = document.getElementById('language-select-mobile').value;

	document.getElementById('language-select').value = currentLanguage;

	localStorage.setItem('tarotLanguage', currentLanguage);
	updateUILanguage();
}

async function updateUILanguage() {
	const trans = translations[currentLanguage];

	document.getElementById('card-of-today').textContent = trans.title;
	document.getElementById('subtitle').textContent = trans.subtitle;

	const questionKey = `question${currentQuestionIndex + 1}`;
	document.getElementById('question-text').textContent = trans[questionKey];

	const elements = document.querySelectorAll('[data-translate]');
	elements.forEach(el => {
		const key = el.getAttribute('data-translate');
		if (trans[key]) {
			if (el.tagName === 'INPUT' || el.tagName === 'BUTTON') {
				el.value = trans[key];
			} else {
				el.textContent = trans[key];
			}
		}
	});

	if (currentCard && currentIsReversed !== null) {
		let readingEnglish = getReadingFromJSON(currentDeck, currentCard.name, currentQuestion, currentIsReversed);

		if (!readingEnglish) {
			const meaning = getCardMeaning(currentCard.name);
			if (meaning) {
				readingEnglish = await generateDailyAdvice(currentCard.name, meaning, currentIsReversed, 'en');
			}
		}

		if (readingEnglish) {
			if (currentLanguage === 'en') {
				showReadingBox(currentCard, currentIsReversed, readingEnglish);
			} else {
				const translatedReading = await translateText(readingEnglish, currentLanguage);
				showReadingBox(currentCard, currentIsReversed, translatedReading);
			}
		}
	}
}

async function translateText(text, targetLang) {
	// Try using Google Translate API (requires API key)
	try {
		const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
		const data = await response.json();

		if (data && data[0] && data[0][0] && data[0][0][0]) {
			// Combine all translated segments
			return data[0].map(segment => segment[0]).join('');
		}
	} catch (error) {
		console.warn('Translation failed, using English:', error);
	}

	// Fallback: return English if translation fails
	return text;
}
