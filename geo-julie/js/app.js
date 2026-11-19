let questions = [];
let flashcards = [];

let currentQuiz = [];
let currentQuestionIndex = 0;

let score = 0;

let weakTopics = [];

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


function startQuiz(mode = "normal") {

    document.getElementById("quizSection")
        .classList.remove("hidden");

  