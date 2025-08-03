import Quiz from '../ajax/quiz';
import Slider from '../helpers/slider';

const quiz = new Quiz(window.location.pathname.split('/').pop());

await quiz.getQuiz();

const sliders = [...document.getElementsByClassName('question-item')];
sliders[0].classList.add('active')
const slider = new Slider(0, sliders);


const answersBtnDOM = [...document.getElementsByClassName('answers-list')];

answersBtnDOM.forEach(answer => {
    Array.from(answer.getElementsByClassName('answer__choice-player')).forEach(choice => {
        choice.addEventListener('click', (e) => {
            Array.from(answer.getElementsByClassName('answer__choice-player')).forEach(sibling => sibling.classList.remove('btn-clicked'));
            const actualBtn = e.currentTarget;
            actualBtn.classList.add('btn-clicked');
        });
    })
});


const prevBtn = document.querySelector('.wrapper-btn--quiz button:first-child');

const nextBtn = document.querySelector('.wrapper-btn--quiz button:last-child');


/* const mainDOM = document.querySelector('main');
mainDOM.classList.add('starting-quiz');

const backgroundDivEl = document.createElement('div');
backgroundDivEl.classList.add('background-home__starting-quiz');
mainDOM.appendChild(backgroundDivEl);

const divEl = document.createElement('div');
divEl.classList.add('home__starting-quiz');
backgroundDivEl.appendChild(divEl);

const headingH2El = document.createElement('h2');
headingH2El.textContent = 'Prêt à commencer le quiz ?';
divEl.appendChild(headingH2El);

const buttonEl = document.createElement('button');
buttonEl.textContent = 'Commencer';
divEl.appendChild(buttonEl);

const infoDivEl = document.createElement('div');
infoDivEl.classList.add('info-home__starting-quiz');
divEl.appendChild(infoDivEl);

const nbQuizParagraphEl = document.createElement('p');
nbQuizParagraphEl.classList.add('nbQuiz-home__starting-quiz');
nbQuizParagraphEl.innerHTML = `Nombre de quiz: <br><strong>${await quiz.getNbQuiz()}</strong>`;
infoDivEl.appendChild(nbQuizParagraphEl);

const subjectQuizParagraphEl = document.createElement('p');
subjectQuizParagraphEl.classList.add('sujectQuiz-home__starting-quiz')
subjectQuizParagraphEl.innerHTML = `Sujet du quiz: <br><strong>${await quiz.getCatQuiz()}</strong>`;
infoDivEl.appendChild(subjectQuizParagraphEl);

buttonEl.addEventListener('click', () => {
    backgroundDivEl.remove();
    mainDOM.classList.remove('starting-quiz');
}); */

slider.dotSlides();
const dots = [...document.getElementsByClassName('dots-slider')];

prevBtn.addEventListener('click', () =>  {
    slider.navigateSlider('left');
    slider.dotsNavigation(dots);
});
nextBtn.addEventListener('click', () => {
    slider.navigateSlider('right');
    slider.dotsNavigation(dots);
});

dots[0].classList.add('active');
