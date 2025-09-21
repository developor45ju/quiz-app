import Quiz from '/app/js/ajax/quiz.js';

const getIdQuiz = window.location.pathname.split('/')[2];
console.log(getIdQuiz);


const quiz = new Quiz(getIdQuiz);


const correctAnswers = await quiz.getResponseCorrect();
const myResponses = JSON.parse(window.localStorage.getItem('myResponses'));


const spanResultUser = document.querySelector('span[data-myScore]');

const spanNbQuestions = document.querySelector('span[data-nbQuestion]');

spanResultUser.textContent = correctAnswers.filter((correct, indx) => myResponses[indx] == correct).length;
spanNbQuestions.textContent = await quiz.getLength();
