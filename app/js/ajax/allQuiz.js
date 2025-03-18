async function allQuiz() {
    try {
        const fetchAllQuiz = await fetch('/api/getAllQuiz', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const getAllQuiz = await fetchAllQuiz.json();
        console.log(getAllQuiz);
        
    } catch (e) {
        console.error(e);
    }
}