import { allQuiz } from '../ajax/allQuiz.js';
// import { deleteQuiz } from "../ajax/deleteQuiz.js";

await allQuiz();

const deleteButton = [...document.getElementsByClassName('quiz__delete')];
console.log(deleteButton);


deleteButton.forEach((button) => {
    button.addEventListener('click', async (e) => {
        const quizId = e.currentTarget.dataset.id;
        
        try {
            const fetchDeleteQuiz = await fetch( `../../../api/deleteQuiz/${quizId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json;utf-8'
                }
            });
            await fetchDeleteQuiz.json();
            const quizItem = e.target.closest('.quiz__item');
            
            if (quizItem) {
                quizItem.classList.add('card-current__delete');
                const deletedCard = document.getElementsByClassName('card-current__delete')[0];
                const getAnimationDelay = getComputedStyle(deletedCard).animationDuration;
                

                setTimeout(() => {
                    quizItem.remove();
                }, parseFloat(getAnimationDelay.split('s')[0]) * 1000);
                
                
            }
        } catch (error) {
            console.error('Error deleting quiz:', error);
        }
    });
});