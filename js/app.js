let questions = [];
let flashcards = [];

let currentQuiz = [];
let currentQuestionIndex = 0;
let score = 0;

let currentCard = 0;
let showingAnswer = false;

const STORAGE_KEY = "geoJulieStats";

document.addEventListener("DOMContentLoaded", async () => {

    loadStats();

    await loadQuestions();
    await loadFlashcards();

    initFlashcards();

});

async function loadQuestions() {

    try {

        const response = await fetch("data/questions.json");
        questions = await response.json();

    } catch (err) {

        console.error("Erreur chargement questions", err);

    }

}

async function loadFlashcards() {

    try {

        const response = await fetch("data/flashcards.json");
        flashcards = await response.json();

    } catch (err) {

        console.error("Erreur chargement flashcards", err);

    }

}

function shuffle(array) {

    return [...array].sort(() => Math.random() - 0.5);

}

function startQuiz() {

    currentQuestionIndex = 0;
    score = 0;

    currentQuiz = shuffle(questions).slice(0, 25);

    document.getElementById("quizSection")
        .classList.remove("hidden");

    document.getElementById("resultSection")
        .classList.add("hidden");

    displayQuestion();

}

function displayQuestion() {

    const q = currentQuiz[currentQuestionIndex];

    if (!q) {

        finishQuiz();
        return;

    }

    document.getElementById("questionCounter")
        .innerText =
        `Question ${currentQuestionIndex + 1}/${currentQuiz.length}`;

    document.getElementById("questionArea")
        .innerHTML = `
            <div class="question-card">
                <h3>${q.question}</h3>
            </div>
        `;

    const answersArea =
        document.getElementById("answersArea");

    answersArea.innerHTML = "";

    q.answers.forEach((answer, index) => {

        const button =
            document.createElement("button");

        button.className =
            "answer-btn";

        button.innerText =
            answer;

        button.onclick =
            () => selectAnswer(index);

        answersArea.appendChild(button);

    });

}

function selectAnswer(index) {

    const q = currentQuiz[currentQuestionIndex];

    const buttons =
        document.querySelectorAll(".answer-btn");

    buttons.forEach(
        b => b.disabled = true
    );

    if (index === q.correct) {

        score++;

        buttons[index]
            .classList.add("correct");

    } else {

        buttons[index]
            .classList.add("wrong");

        buttons[q.correct]
            .classList.add("correct");

    }

    setTimeout(() => {

        currentQuestionIndex++;

        displayQuestion();

    }, 1200);

}

function finishQuiz() {

    document.getElementById("quizSection")
        .classList.add("hidden");

    document.getElementById("resultSection")
        .classList.remove("hidden");

    document.getElementById("finalScore")
        .innerText =
        `${score}/${currentQuiz.length}`;

    const percent =
        Math.round(
            score /
            currentQuiz.length *
            100
        );

    let feedback = "";

    if (percent >= 90) {

        feedback =
            "🏆 Excellent !";

    } else if (percent >= 75) {

        feedback =
            "👍 Très bon travail !";

    } else if (percent >= 50) {

        feedback =
            "📚 Continue à réviser.";

    } else {

        feedback =
            "🌍 Reprends les flashcards puis réessaie.";
    }

    document.getElementById("feedback")
        .innerText =
        feedback;

    saveResult(percent);

}

function restartQuiz() {

    startQuiz();

}

function openSummary() {

    document.getElementById("summarySection")
        .classList.toggle("hidden");

}

function openFlashcards() {

    document.getElementById("flashcardSection")
        .classList.toggle("hidden");

}

function initFlashcards() {

    const card =
        document.getElementById("flashcard");

    if (!card) return;

    card.addEventListener(
        "click",
        flipCard
    );

    nextCard();

}

function nextCard() {

    if (flashcards.length === 0)
        return;

    const card =
        flashcards[currentCard];

    document.getElementById("flashQuestion")
        .innerText =
        card.question;

    document.getElementById("flashAnswer")
        .innerText =
        card.answer;

    document.getElementById("flashQuestion")
        .classList.remove("hidden");

    document.getElementById("flashAnswer")
        .classList.add("hidden");

    showingAnswer = false;

    currentCard++;

    if (
        currentCard >=
        flashcards.length
    ) {

        currentCard = 0;

    }

}

function flipCard() {

    const question =
        document.getElementById("flashQuestion");

    const answer =
        document.getElementById("flashAnswer");

    if (!showingAnswer) {

        question.classList.add("hidden");

        answer.classList.remove("hidden");

    } else {

        question.classList.remove("hidden");

        answer.classList.add("hidden");

    }

    showingAnswer = !showingAnswer;

}

function saveResult(newScore) {

    const stats =
        JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || {

            bestScore: 0,
            quizCount: 0

        };

    stats.quizCount++;

    if (newScore > stats.bestScore) {

        stats.bestScore =
            newScore;

    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(stats)
    );

    loadStats();

}

function loadStats() {

    const stats =
        JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || {

            bestScore: 0,
            quizCount: 0

        };

    const bestScore =
        document.getElementById("bestScore");

    const quizCount =
        document.getElementById("quizCount");

    const globalScore =
        document.getElementById("globalScore");

    if (bestScore)
        bestScore.innerText =
            stats.bestScore + "%";

    if (quizCount)
        quizCount.innerText =
            stats.quizCount;

    if (globalScore)
        globalScore.innerText =
            stats.bestScore + "%";

}