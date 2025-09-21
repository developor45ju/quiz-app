import { DivContainer } from '/app/js/objects/DivContainer.js';
import { InputField } from '/app/js/objects/InputField.js';
import { Label } from '/app/js/objects/Label.js';
import { RadioButton } from '/app/js/objects/RadioButton.js';
import { addedQuiz } from '/app/js/ajax/newQuiz.js';

const nbQuestions = document.getElementById('nbQuestions');
let previousValue = Number(nbQuestions.value);

const lettre = ['A', 'B', 'C', 'D'];

nbQuestions.addEventListener('input', function() {
    const newValue = Number(this.value);    
    const isIncrementing = newValue > previousValue;

    if (newValue === 0) return;

    if (isIncrementing) {
        for (let q = previousValue; q < newValue; q++) {
            const wrapperField = new DivContainer('quiz__field').createDivContainer();
            const questionGroup = new DivContainer('question__container').createDivContainer();
            const quizQuestionLabel = new Label(`question${q + 1}`, 'quiz__label', `Question ${q +1}`).createLabel();
            const questionInputName = new InputField('question__name quiz__input', `question${q + 1}`, `question${q + 1}name`, 'Saisir l\'énoncé de la question', true).createInputField();
            const questionProposition = new DivContainer('proposition__container').createDivContainer();
            wrapperField.appendChild(quizQuestionLabel);
            wrapperField.appendChild(questionInputName);
            questionGroup.appendChild(wrapperField);
            for (let i = 0; i < 4; i++) {
                const propositionGroup = new DivContainer('proposition__group').createDivContainer();
                const choiceAnswer = new RadioButton(`question__choice`, `question${q + 1}choice`, 'wrong', 'Mauvaise réponse').createRadioButton();
                const proposition = new InputField('question__answer quiz__input', null, `question${q + 1}answer${lettre[i]}wrong`, `Proposition ${i + 1}`, true).createInputField();
                propositionGroup.appendChild(choiceAnswer);
                propositionGroup.appendChild(proposition);
                questionProposition.appendChild(propositionGroup);
                questionGroup.appendChild(questionProposition);
            }
            document.getElementById('questions').appendChild(questionGroup);
            const smallTextHelp = document.createElement('small');
            smallTextHelp.className = 'quiz__help';
            smallTextHelp.textContent = 'Séléctionnez la bonne réponse en cochant le bouton radio correspondant.';
            questionGroup.appendChild(smallTextHelp);
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
