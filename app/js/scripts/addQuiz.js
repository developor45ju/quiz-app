import { DivContainer } from '../objects/DivContainer.js';
import { InputField } from '../objects/InputField.js';
import { InputSelect } from '../objects/InputSelect.js';
import { Label } from '../objects/Label.js';
import { RadioButton } from '../objects/RadioButton.js';
import { addedQuiz } from '../ajax/newQuiz.js';

const nbQuestions = document.getElementById('nbQuestions');
let previousValue = Number(nbQuestions.value);

const lettre = ['A', 'B', 'C', 'D'];

nbQuestions.addEventListener('input', function() {
    const newValue = Number(this.value);    
    const isIncrementing = newValue > previousValue;

    if (newValue === 0) return;

    if (isIncrementing) {
        for (let q = previousValue; q < newValue; q++) {
            const questionGroup = new DivContainer('question__container').createDivContainer();
            const quizQuestionLabel = new Label(`question${q + 1}`, `Question ${q +1}`).createLabel();
            const questionInputName = new InputField('question__name', `question${q + 1}`, `question${q + 1}name`, 'text', `Question ${q + 1}`).createInputField();
            const difficultyQuestionLabel = new Label(`question${q + 1}difficulty`, 'Difficulté de la question').createLabel();
            const questionDifficulty = new InputSelect(`question${q+1}difficulty`, `question${q + 1}difficulty`, [
                { value: 'easy', text: '1' },
                { value: 'medium', text: '2' },
                { value: 'hard', text: '3' }
            ]).createSelect();
            const questionProposition = new DivContainer('proposition__container').createDivContainer();
            questionGroup.appendChild(quizQuestionLabel);
            questionGroup.appendChild(questionInputName);
            questionGroup.appendChild(difficultyQuestionLabel);
            questionGroup.appendChild(questionDifficulty);
            for (let i = 0; i < 4; i++) {
                const choiceAnswer = new RadioButton(`question__choice`, `question${q + 1}choice`, 'wrong').createRadioButton();
                const proposition = new InputField('question__answer', `question${q + 1}choice${lettre[i]}`, `question${q + 1}choice${lettre[i]}`, 'text', `Proposition ${i + 1}`).createInputField();
                questionProposition.appendChild(choiceAnswer);
                questionProposition.appendChild(proposition);
                questionGroup.appendChild(questionProposition);
            }
            document.getElementById('questions').appendChild(questionGroup);
        }
        previousValue = newValue;
        
    } else {
        const questionsDiv = document.getElementById('questions');
        while (questionsDiv.childElementCount > newValue) {
            questionsDiv.removeChild(questionsDiv.lastChild);
        }
        previousValue = newValue;
    }
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('question__choice')) {
        const radio = e.target;
        const nextSibling = radio.nextElementSibling;
        document.querySelectorAll(`input[name="${radio.name}"]`).forEach(r => {
            r.setAttribute('value', 'wrong');
            const rNextSibling = r.nextElementSibling;
            if (rNextSibling.name.includes('correct')) {
                rNextSibling.setAttribute('name', rNextSibling.name.replace('correct', 'wrong'));
            }
        });
        if (radio.checked) {
            radio.setAttribute('value', 'correct');
            if (nextSibling.name.includes('wrong')) {
                nextSibling.setAttribute('name', nextSibling.name.replace('wrong', 'correct'));
            }
        }
    }
});

const formAddingQuiz = document.getElementById('form-quiz');

formAddingQuiz.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const questions = [...document.getElementsByClassName('proposition__container')];    
    let allAnswered = true;

    questions.forEach(question => {
        const choices = [...question.querySelectorAll('input[type="radio"]')];        
        const isAnswered = choices.some(choice => choice.checked);
        if (!isAnswered) {
            allAnswered = false;
            question.classList.add('unanswered');
        } else {
            question.classList.remove('unanswered');
        }
    });

    if (!allAnswered) {
        alert('Veuillez répondre à toutes les questions.');
        return;
    }

    addedQuiz(formAddingQuiz);
});
