import { popUp } from '../components/popUp.js';

/**
 * Send a object to server via POST and without for the bank realoding
 * 
 * @param {FormData} formData
 * 
 * @return void
 */

export async function addedQuiz(formData) {
    try {
        // Récupération de l'URL qui permet de créer un quiz
        const data = {}
        const formDataQ = new FormData(formData);
        formDataQ.forEach((value, key) => data[key] = value);
        
        const requestAddingQuiz = await fetch('../../../api/postQuiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        });

        if (!requestAddingQuiz.ok) {
            throw new Error(`HTTP error! status: ${requestAddingQuiz.status}`);
        }
        
        const fetchResponse = await requestAddingQuiz.json();
        if (fetchResponse.status === 'success') {
            popUp();
            const requestAllQuiz = await fetch('http://quiz/api/getAllQuiz', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            });
            const responsePage = await requestAllQuiz.text();
            mainContainer.innerHTML = responsePage;
        }
    } catch (e) {
        console.error('Error:', e);
        alert('An error occurred while adding the quiz: ' + e.message);
    }
}