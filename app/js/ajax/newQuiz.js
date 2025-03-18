import { popUp } from '/app/js/components/popUp.js';

/**
 * Send an object to server via POST without bank reloading
 * 
 * @param {HTMLFormElement} formData
 * 
 * @return {Promise<void>}
 */

export async function addedQuiz(formData) {
    try {
        // Récupération de l'URL qui permet de créer un quiz
        const data = {}
        const formDataQ = new FormData(formData);
        formDataQ.forEach((value, key) => data[key] = value);
        
        const requestAddingQuiz = await fetch('/api/postQuiz', {
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
            try {
                popUp();
            } catch (popupError) {
                console.warn('Popup display error:', popupError);
            }
        }
    } catch (e) {
        console.error('Error:', e);
        alert('An error occurred while adding the quiz: ' + e.message);
    }
}