import { ArticleContainer } from '../objects/ArticleContainer.js';
import { ParagraphContainer } from '../objects/Paragraph.js';
import { DivContainer } from '../objects/DivContainer.js';
import { LevelHeadingContainer } from '../objects/LevelHeading.js';
import { LinkContainer } from '../objects/Link.js';

class HandledDisplayQuizes {
    async displayQuizes() {
        try {
            const displayQuizesElement = document.getElementById('display-quizes');
            
            if (!displayQuizesElement) {
                throw new Error("Element 'display-quizes' not found");
            }

            const getQuizes = await fetch('/data/db.json');
            if (!getQuizes.ok) {
                throw new Error(`HTTP error! status: ${getQuizes.status}`);
            }
            const quizes = await getQuizes.json();
            quizes.forEach(quiz => {
            const articleContainer = new ArticleContainer('card__container', `quiz-${quiz.quizId}`);
            const article = articleContainer.createArticleContainer();
            const divContainer = new DivContainer('quiz__container', `quiz__container-${quiz.quizId}`);
            const div = divContainer.createDivContainer();
            const levelHeadingContainer = new LevelHeadingContainer('h2', quiz.quizName, 'quiz__title', `quiz__title-${quiz.quizId}`);
            const quizQuestionInfo = new ParagraphContainer('quiz__nbQuestion', `quiz__nbQuestion-${quiz.quizId}`, `Il y a ${quiz.nbQuestion} questions à ce quiz`);
            const paragraph = quizQuestionInfo.createParagraph();            
            const levelHeading = levelHeadingContainer.createLevelHeadingContainer();
            const linkContainer = new LinkContainer('quiz__link', `quiz__link-${quiz.quizId}`, `/quiz/${quiz.quizId}`, 'Start Quiz');
            const link = linkContainer.createLinkContainer();
            

            div.appendChild(levelHeading);
            div.appendChild(paragraph);
            div.appendChild(link);
            article.appendChild(div);
            displayQuizesElement.appendChild(article);
        });   
        [...document.querySelectorAll('#main-container a')].forEach(link => {            
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const path = event.target.getAttribute('href');
                window.router.navigateTo(path);       
            })
        })
    } catch (error) {
        console.error('Error:', error);
    }
}
}

const handledDisplayQuizes = new HandledDisplayQuizes();
handledDisplayQuizes.displayQuizes();