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
        
        const requestAddingQuiz = await fetch(`${window.location.protocol}://${window.location.hostname}/api/postQuiz`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        });

        if (!requestAddingQuiz.ok) {
            throw new Error(`${window.location.protocol} error! status: ${requestAddingQuiz.status}`);
        }
        
        const fetchResponse = await requestAddingQuiz.json();
        if (fetchResponse.status === 'success') popUp();
    } catch (e) {
        console.error('Error:', e);
        alert('An error occurred while adding the quiz: ' + e.message);
    }
}