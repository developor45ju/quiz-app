export async function allQuiz() {
    try {
        const fetchAllQuiz = await fetch(`${window.location.protocol}://${window.location.hostname}/api/getAllQuiz`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;utf-8'
            }
        });
        const getAllQuiz = await fetchAllQuiz.json();
        console.log(getAllQuiz);
          
        
        if (
            fetchAllQuiz.ok &&
            Array.isArray(getAllQuiz.message) &&
            window.location.pathname === '/allQuiz'
        ) {
            let gridQuiz = document.getElementById('quiz-container');
            
            for (const quiz of getAllQuiz.message) {
                const quizElement = document.createElement('div');
                quizElement.className = 'quiz__item';
                quizElement.innerHTML = `
                    <h2>${quiz.title}</h2>
                    <p>${quiz.content_desc}</p>
                    <a href="/allQuiz/${quiz.ID}" class="quiz__link" data-link>
                        Voir le quiz
                    </a>
                    <button class="quiz__delete" data-id="${quiz.ID}">
                        Supprimer le quiz
                    </button>
                `;
                gridQuiz.appendChild(quizElement);
            }
    }
    } catch (e) {
        console.error(e);
    }
}