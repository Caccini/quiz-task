class Quiz {
    constructor() {
        this.questions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.loadQuestions();
    }
    async loadQuestions() {
        try {
            const response = await fetch('questions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json();
            this.questions = data.questions;
            console.log("Questions loaded:", this.questions);
        } catch (error) {
            console.log("Failed to load questions:", error)
        }
        this.displayQuestion()
    }

    displayQuestion() {
        // console.log("Displaying question:", current.question);
        const questionContainer = document.getElementById("questions-container");
       
        const current = this.questions[this.currentQuestion];

        let questionHTML = `<h3>${current.text}</h3>`;
        current.options.forEach((option) => {
            questionHTML += `<div class="answer-options">
                <input type="radio" name="option" value="${option.id}" id="option-${option.id}">
                <label for="option-${option.id}">${option.text}</label>
            </div>`;
        });
        questionHTML += `<div id="feedback-message"></div>`;

        questionContainer.innerHTML =  questionHTML;
    }

    checkAnswer() {
        const selectedOption = document.querySelector('input[name="option"]:checked');
        const feedbackMessage = document.getElementById("feedback-message");

        if (selectedOption) {
            const answer = selectedOption.value;
            const current = this.questions[this.currentQuestion];

            // console.log("Selected Answer:", answer); // test 
            // console.log("Correct Answer:", current.correct); // test

            feedbackMessage.textContent = '';
            feedbackMessage.className = '';

            if (answer === current.correct) {
                this.score ++;
                feedbackMessage.textContent = "Correct! 🎉";
                feedbackMessage.className = "correct";
            } else {
                feedbackMessage.textContent = `Incorrect answer!`;
                feedbackMessage.className = "incorrect";
            }

            this.updateScoreDisplay();

            this.currentQuestion++;
        }

        if (this.currentQuestion < this.questions.length) {
            setTimeout(() => {
                this.displayQuestion(); 
            }, 2000)  
        } else {
            setTimeout(() => {
                this.showFinalScore();
            }, 1000)
        }
    }

    updateScoreDisplay() {
        const totalQuestions = this.questions.length;
        const percentage = (this.score / totalQuestions) * 100;
    
        const scoreElement = document.getElementById("score-percentage");
        scoreElement.textContent = `${percentage.toFixed(0)}%`;
    }

    showFinalScore() {
        const totalQuestions = this.questions.length;
        const finalPercentage = (this.score / totalQuestions) * 100;

        const questionContainer = document.getElementById("questions-container");
        questionContainer.innerHTML = `<h2>Quiz Completed!</h2>
            <p>Your total score is: ${this.score} out of ${totalQuestions} (${finalPercentage.toFixed(0)}%)</p>
            <button id="restart-button">Restart Quiz</button>
        `;

        document.getElementById("submit-button").style.display = 'none';
        document.getElementById("restart-button").addEventListener("click", () => {
            this.restartQuiz();
        });
    }

    restartQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.loadQuestions();
        this.updateScoreDisplay();
        document.getElementById("submit-button").style.display = 'block';
    }

    
}

const quiz = new Quiz();

document.querySelector(".quiz-form").addEventListener("submit", function(event) {
    event.preventDefault();
    quiz.checkAnswer();
})