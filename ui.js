import { MAX_BLOCKS, BASE_WIDTH, BASE_HEIGHT, ASPECT_RATIO } from './constants.js';
import { chain, score, level, hashPower, gameActive } from './state.js'; 
import { render } from './game.js'; 
import { resetGame } from './state.js'; 
import { 
    tutorialSteps, educationalPopups, achievements, historicalLevels,
    educationState, advanceTutorial, hideEducationalPopup, 
    getRandomFact, quizQuestions, startQuiz, answerQuestion
} from './education.js';

// Get UI elements
export const canvas = document.getElementById('game');
export const ctx = canvas.getContext('2d');
const blocksEl = document.getElementById('blocks');
const maxBlocksEl = document.getElementById('max-blocks'); 
const hashRateEl = document.getElementById('hash-rate');
// const challengeEl = document.getElementById('challenges'); 
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('final-score');
const gameOverEl = document.getElementById('game-over');
const gameOverMessageEl = document.getElementById('game-over-message'); 
const restartBtn = document.getElementById('restart');
export const gameContainer = document.getElementById('game-container'); 
const levelEl = document.getElementById('level'); 
const levelUpMessageEl = document.getElementById('level-up-message'); 

// Get new educational UI elements
const tutorialOverlay = document.getElementById('tutorial-overlay');
const tutorialTitle = document.getElementById('tutorial-title');
const tutorialText = document.getElementById('tutorial-text');
const tutorialNextBtn = document.getElementById('tutorial-next');
const tutorialSkipBtn = document.getElementById('tutorial-skip');

const popupOverlay = document.getElementById('popup-overlay');
const popupText = document.getElementById('popup-text');
const popupCloseBtn = document.getElementById('popup-close');

const achievementOverlay = document.getElementById('achievement-overlay');
const achievementTitle = document.getElementById('achievement-title');
const achievementDesc = document.getElementById('achievement-desc');
const achievementEdu = document.getElementById('achievement-edu');
const achievementCloseBtn = document.getElementById('achievement-close');

const factOverlay = document.getElementById('fact-overlay');
const factText = document.getElementById('fact-text');
const factCloseBtn = document.getElementById('fact-close');

const helpButton = document.getElementById('help-button');

const quizOverlay = document.getElementById('quiz-overlay');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const quizExplanation = document.getElementById('quiz-explanation');
const quizNextBtn = document.getElementById('quiz-next');
const quizResults = document.getElementById('quiz-results');
const quizScore = document.getElementById('quiz-score');
const quizTotal = document.getElementById('quiz-total');
const quizCloseBtn = document.getElementById('quiz-close');

const historicalYear = document.getElementById('year');
const historicalEvent = document.getElementById('event');
const startQuizBtn = document.getElementById('start-quiz');

// Initialize UI on load
document.addEventListener('DOMContentLoaded', () => {
    // Set initial max blocks display
    if (maxBlocksEl) {
        maxBlocksEl.textContent = MAX_BLOCKS;
    }

    // Setup restart button listener
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            resetGame();
            hideGameOver();
        });
    }

    // Add event listener for window resize 
    window.addEventListener('resize', handleResize);

    // Initial canvas resize and render
    handleResize(); 
    // Initial render will be called by the game setup

    // Setup tutorial buttons
    if (tutorialNextBtn) {
        tutorialNextBtn.addEventListener('click', () => {
            const hasMoreSteps = advanceTutorial();
            if (hasMoreSteps) {
                updateTutorialContent();
            } else {
                hideTutorial();
            }
        });
    }
    
    if (tutorialSkipBtn) {
        tutorialSkipBtn.addEventListener('click', hideTutorial);
    }
    
    // Setup popup close button
    if (popupCloseBtn) {
        popupCloseBtn.addEventListener('click', hideEducationalPopup);
        popupCloseBtn.addEventListener('click', () => {
            popupOverlay.style.display = 'none';
        });
    }
    
    // Setup achievement close button
    if (achievementCloseBtn) {
        achievementCloseBtn.addEventListener('click', () => {
            achievementOverlay.style.display = 'none';
        });
    }
    
    // Setup fact close button
    if (factCloseBtn) {
        factCloseBtn.addEventListener('click', () => {
            factOverlay.style.display = 'none';
        });
    }
    
    // Setup help button
    if (helpButton) {
        helpButton.addEventListener('click', showRandomFact);
    }
    
    // Setup quiz buttons
    if (quizNextBtn) {
        quizNextBtn.addEventListener('click', advanceQuiz);
    }
    
    if (quizCloseBtn) {
        quizCloseBtn.addEventListener('click', () => {
            quizOverlay.style.display = 'none';
        });
    }
    
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', () => {
            hideGameOver();
            showQuiz();
        });
    }
});

// Handle resize logic
function handleResize() {
    // Use constants for aspect ratio
    const containerWidth = gameContainer.offsetWidth;
    const containerHeight = containerWidth / ASPECT_RATIO;

    canvas.width = containerWidth;
    canvas.height = containerHeight;

    // Redraw the game state and UI overlays after resize
    render(); 
    // Ensure game over overlay stays correctly positioned/sized if visible
    if (gameOverEl.style.display !== 'none') {
        gameOverEl.style.display = 'flex'; 
    }
}

// Functions to update UI elements
export function updateScoreDisplay(currentScore) {
    if (scoreEl) scoreEl.textContent = currentScore;
}

export function updateBlocksDisplay(currentBlocks, maxBlocks) {
    if (blocksEl) blocksEl.textContent = currentBlocks;
    if (maxBlocksEl) maxBlocksEl.textContent = maxBlocks; 
}

export function updateHashRateDisplay(currentHashRate) {
    if (hashRateEl) hashRateEl.textContent = currentHashRate.toFixed(1);
}

export function updateLevelDisplay(currentLevel) {
    if (levelEl) levelEl.textContent = currentLevel;
}

// Game over UI
export function showGameOver(finalScore, message) {
    if (finalScoreEl) finalScoreEl.textContent = finalScore;
    if (gameOverMessageEl) gameOverMessageEl.textContent = message;
    if (gameOverEl) gameOverEl.style.display = 'flex'; 
}

export function hideGameOver() {
    if (gameOverEl) gameOverEl.style.display = 'none';
    if (gameOverMessageEl) gameOverMessageEl.textContent = ''; 
}

// Level Up message UI
export function showMessage(text, duration = 2000) {
    if (levelUpMessageEl) {
        levelUpMessageEl.textContent = text;
        levelUpMessageEl.style.display = 'block';
        setTimeout(() => {
            levelUpMessageEl.style.display = 'none';
        }, duration);
    }
}

// Educational UI functions
export function showTutorial() {
    if (tutorialOverlay) {
        updateTutorialContent();
        tutorialOverlay.style.display = 'flex';
    }
}

function updateTutorialContent() {
    const currentStep = tutorialSteps[educationState.currentTutorialStep];
    if (tutorialTitle && currentStep) {
        tutorialTitle.textContent = currentStep.title;
    }
    if (tutorialText && currentStep) {
        tutorialText.textContent = currentStep.text;
    }
}

export function hideTutorial() {
    if (tutorialOverlay) {
        tutorialOverlay.style.display = 'none';
        educationState.tutorialActive = false;
        educationState.tutorialCompleted = true;
    }
}

export function showEducationalPopup(popupKey) {
    if (popupOverlay && educationalPopups[popupKey]) {
        popupText.textContent = educationalPopups[popupKey];
        popupOverlay.style.display = 'flex';
    }
}

export function showAchievement(achievementKey) {
    if (achievementOverlay && achievements[achievementKey]) {
        const achievement = achievements[achievementKey];
        achievementTitle.textContent = achievement.title;
        achievementDesc.textContent = achievement.description;
        achievementEdu.textContent = achievement.educational;
        achievementOverlay.style.display = 'flex';
    }
}

export function showRandomFact() {
    if (factOverlay) {
        factText.textContent = getRandomFact();
        factOverlay.style.display = 'flex';
    }
}

export function updateHistoricalEvent(currentLevel) {
    if (historicalYear && historicalEvent && historicalLevels[currentLevel]) {
        historicalYear.textContent = historicalLevels[currentLevel].year;
        historicalEvent.textContent = historicalLevels[currentLevel].event;
    }
}

export function showQuiz() {
    if (quizOverlay) {
        startQuiz();
        updateQuizQuestion();
        quizOverlay.style.display = 'flex';
    }
}

function updateQuizQuestion() {
    const currentQ = quizQuestions[educationState.currentQuestion];
    
    if (quizQuestion && currentQ) {
        quizQuestion.textContent = currentQ.question;
    }
    
    if (quizOptions && currentQ) {
        quizOptions.innerHTML = '';
        currentQ.options.forEach((option, index) => {
            const button = document.createElement('div');
            button.className = 'quiz-option';
            button.textContent = option;
            button.dataset.index = index;
            button.addEventListener('click', () => handleQuizAnswer(index));
            quizOptions.appendChild(button);
        });
    }
    
    // Hide explanation and next button
    quizExplanation.classList.add('hidden');
    quizNextBtn.classList.add('hidden');
    quizResults.classList.add('hidden');
    
    // Add early termination button
    const earlyEndBtn = document.createElement('button');
    earlyEndBtn.id = 'quiz-end-early';
    earlyEndBtn.textContent = 'TERMINAR QUIZ';
    earlyEndBtn.addEventListener('click', terminateQuizEarly);
    quizOptions.appendChild(earlyEndBtn);
}

function terminateQuizEarly() {
    // Calculate score based on progress so far
    const result = {
        complete: true,
        finalScore: educationState.quizScore,
        totalQuestions: quizQuestions.length
    };
    
    // Display results
    quizScore.textContent = result.finalScore;
    quizTotal.textContent = result.totalQuestions;
    quizExplanation.classList.add('hidden');
    quizNextBtn.classList.add('hidden');
    quizResults.classList.remove('hidden');
}

function handleQuizAnswer(optionIndex) {
    const result = answerQuestion(optionIndex);
    const currentQ = quizQuestions[educationState.currentQuestion - 1]; 
    
    // Mark selected option
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(option => {
        const index = parseInt(option.dataset.index);
        option.classList.remove('correct', 'incorrect');
        
        if (index === optionIndex) {
            option.classList.add(result.correct ? 'correct' : 'incorrect');
        }
        
        if (index === currentQ.correct) {
            option.classList.add('correct');
        }
        
        // Disable further clicks
        option.style.pointerEvents = 'none';
    });
    
    // Show explanation
    quizExplanation.textContent = currentQ.explanation;
    quizExplanation.classList.remove('hidden');
    
    if (result.complete) {
        // Show final results
        quizScore.textContent = result.finalScore;
        quizTotal.textContent = result.totalQuestions;
        quizResults.classList.remove('hidden');
    } else {
        // Show next button
        quizNextBtn.classList.remove('hidden');
    }
}

function advanceQuiz() {
    updateQuizQuestion();
}