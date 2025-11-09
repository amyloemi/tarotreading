// UI helper functions

// Global variables for questions
let currentQuestionIndex = 0;
const questions = [
	"Where should I focus my intention today?",
	"What does this relationship need right now?",
	"Am I on the right track?"
];
let currentQuestion = questions[0];

// Cycle through questions with animation (forward)
function cycleQuestion() {
	const questionText = document.getElementById('question-text');

	// Start swipe out animation
	questionText.classList.add('swipe-out-right');

	// After animation completes, change text and swipe in
	setTimeout(() => {
		currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
		currentQuestion = questions[currentQuestionIndex]; // Keep English for reading lookup

		// Display translated question
		const trans = translations[currentLanguage];
		const questionKey = `question${currentQuestionIndex + 1}`;
		questionText.textContent = trans[questionKey];

		// Remove swipe out and add swipe in
		questionText.classList.remove('swipe-out-right');
		questionText.classList.add('swipe-in-left');

		// Clean up animation class after it completes
		setTimeout(() => {
			questionText.classList.remove('swipe-in-left');
		}, 400);
	}, 400);
}

// Cycle through questions with animation (backward) - for swipe gestures
function cyclePreviousQuestion() {
	const questionText = document.getElementById('question-text');

	// Start swipe out animation to the left
	questionText.classList.add('swipe-out-left');

	// After animation completes, change text and swipe in from right
	setTimeout(() => {
		currentQuestionIndex = (currentQuestionIndex - 1 + questions.length) % questions.length;
		currentQuestion = questions[currentQuestionIndex]; // Keep English for reading lookup

		// Display translated question
		const trans = translations[currentLanguage];
		const questionKey = `question${currentQuestionIndex + 1}`;
		questionText.textContent = trans[questionKey];

		// Remove swipe out and add swipe in from right
		questionText.classList.remove('swipe-out-left');
		questionText.classList.add('swipe-in-right');

		// Clean up animation class after it completes
		setTimeout(() => {
			questionText.classList.remove('swipe-in-right');
		}, 400);
	}, 400);
}
