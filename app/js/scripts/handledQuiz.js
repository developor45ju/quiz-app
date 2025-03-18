import { escapeSpecialsCaracters } from "../helpers/escapeSpecialsCaracters.js";

class QuizContainer {
    async getQuiz() {
        const response = await fetch('/data/db.json');
        const data = await response.json();
        const findQuiz = data.find(quiz => quiz.quizId === location.pathname.split('quiz/')[1]);
          
        let quizContainer = '';
        if (findQuiz) {
            quizContainer = `
                <h2 class="quiz__title">${findQuiz.quizName}</h2>
                <ul class="questions__container">
                    ${findQuiz.questions.map(question => `
                        <li class="question__item">
                            <p class="question__title">${escapeSpecialsCaracters(question.question)}</p>
                            <ul class="answers__container">
                                ${question.answers.map(answer => `
                                    <li class="answer__item">${escapeSpecialsCaracters(answer.response)}</li>
                                `).join('')}
                            </ul>
                        </li>
                    `).join('')}
                </ul>
                <button id="quiz-submit" class="quiz__submit">Submit</button>
            `;
        } else {
            quizContainer = '<p>Quiz not found.</p>';
        }
        document.getElementById('quiz-container').innerHTML = quizContainer;
        // Add event listeners after the content is added to DOM
        document.querySelectorAll('.answer__item').forEach(item => {
            item.addEventListener('click', (event) => {
                event.target.parentElement.querySelectorAll('.answer__item').forEach(answer => {                    
                    if (answer === event.target) {
                        answer.classList.add('selected');
                    } else {
                        answer.classList.remove('selected');
                    }
                });
            });
        });
    }

    async submitResponse() {
        const response = await fetch('/data/db.json');
        const data = await response.json();
        const findQuiz = data.find(quiz => quiz.quizId === location.pathname.split('quiz/')[1]);
        const questions = [...document.querySelectorAll('.question__item')];
        
        let score = 0;
        questions.forEach((question, index) => {
            
            const answers = [...question.querySelectorAll('.answer__item')];
            const correctAnswer = findQuiz.questions[index].answers.find(answer => answer.correct);
            
            const selectedAnswer = answers.find(answer => answer.classList.contains('selected'));

            if (!selectedAnswer) throw new Error('Veuillez répondre à toutes les quesrtions !');
            
            if (correctAnswer.response === selectedAnswer.textContent) {
                selectedAnswer.style.backgroundColor = 'green';
                score++;
            } else {
                selectedAnswer.style.backgroundColor = 'red';
                answers.find(answer => answer.textContent === correctAnswer.response).style.backgroundColor = 'green';
            }
        });
        const paragraph = document.createElement('p');
        paragraph.textContent = `Your score is ${score}/${questions.length}`;
        document.getElementById('quiz-container').appendChild(paragraph);
    }
}

const quizContainer = new QuizContainer();
await quizContainer.getQuiz();

document.getElementById('quiz-submit').addEventListener('click', () => {
    quizContainer.submitResponse();
});