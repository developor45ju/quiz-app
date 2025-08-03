export default class Quiz {
    id = '';

    constructor(id) {
        this.id = id;
        
    };

    async getQuiz() {
        try {
            const responseQuiz = await fetch(`../../../api/getQuiz/${this.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json;utf-8'
                }
            });
            const resultQuiz = await responseQuiz.json();
            
            if (responseQuiz.ok && resultQuiz.message) {
                const quizElement = document.querySelector('.content__quiz');

                const prevBtnEl = document.createElement('button');
                prevBtnEl.classList.add('btn-prev');
                prevBtnEl.innerHTML = 'Précédent'
                
                const nextBtnEl = document.createElement('button');
                nextBtnEl.classList.add('btn-next');
                nextBtnEl.innerHTML = 'Suivant'

                const wrapperDivBtnEl = document.createElement('div');
                wrapperDivBtnEl.classList.add('wrapper-btn--quiz')
    
                const questionsContainer = document.createElement('div');
                questionsContainer.className = 'questions-container';
                resultQuiz.message.questions.forEach(question => {
                    const questionElement = document.createElement('div');
                    questionElement.className = 'question-item';
                    questionElement.innerHTML = `
                        <h3>${question.question}</h3>
                        <ul class="answers-list">
                            ${question.answer.map(answer => `
                                <li class="answer-item">
                                    <button class="answer__choice-player">
                                    ${answer.answer}
                                    </button>
                                </li>
                            `).join('')}
                        </ul>
                    `;
                    questionsContainer.appendChild(questionElement);
                });
                quizElement.appendChild(questionsContainer);

                quizElement.appendChild(wrapperDivBtnEl);
                wrapperDivBtnEl.appendChild(prevBtnEl);
                wrapperDivBtnEl.appendChild(nextBtnEl);
            } else {
                console.error('Failed to fetch quiz:', resultQuiz);
            }
        } catch (e) {
            console.error('Error fetching quiz:', e);
        }
    }

    async getNbQuiz() {
        const responseQuiz = await fetch(`../../../api/getQuiz/${this.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;utf-8'
            }
        });
        const resultQuiz = await responseQuiz.json();        
        return resultQuiz.message.nb_question;
    }

    async getCatQuiz() {
        const responseQuiz = await fetch(`../../../api/getQuiz/${this.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;utf-8'
            }
        });
        const resultQuiz = await responseQuiz.json();
        return resultQuiz.message.category;
    }
}
        