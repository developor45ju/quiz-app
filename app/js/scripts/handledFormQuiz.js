import { DivContainer } from '/app/js/objects/DivContainer.js';
import { InputField } from '/app/js/objects/InputFieild.js';
import { Label } from '/app/js/objects/Label.js';
import { RadioButton } from '/app/js/objects/RadioButton.js';
import { addedQuiz } from '/app/js/ajax/newQuiz.js';

const nbQuestions = document.getElementById('nbQuestions');


let previousValue = Number(nbQuestions.value);

const lettre = ['A', 'B', 'C', 'D'];

const questionGroup = new DivContainer('question__container', 'questions1').createDivContainer();
const questionProposition = new DivContainer('proposition__container', 'propositions1').createDivContainer();
const questionLabel = new Label('question1', 'Question 1').createLabel();
const questionInputName = new InputField('question__name', 'question1', 'question1name', 'text', 'Question 1', true).createInputField();
for (let i = 0; i < 4; i++) {
    const choiceAnswer = new RadioButton(`question__choice`, `choice${lettre[i]}`, `question1choice`, 'wrong').createRadioButton();
    const proposition = new InputField('question__proposition', `choice${lettre[i]}_1`, `question1answer${lettre[i]}wrong`, 'text', `Proposition ${i + 1}`, true).createInputField();
    questionProposition.appendChild(choiceAnswer);
    questionProposition.appendChild(proposition);
    questionGroup.appendChild(questionProposition );
}
document.getElementById('questions').appendChild(questionGroup);
questionGroup.appendChild(questionLabel);
questionGroup.appendChild(questionInputName);
questionGroup.appendChild(questionProposition);

nbQuestions.addEventListener('keypress', function(e) {
    
    if (e.key === 'Enter') {
        const newValue = Number(this.value);
        
        const isIncrementing = newValue > previousValue;
        const isSameNumber = newValue === previousValue;
        const isDesincrementing = newValue < previousValue;
        if (isSameNumber) alert('Veullez renseigné un autre nombre.');            
        if (isIncrementing) {
            for (let i = previousValue; i <= newValue; i++) {
                    const questionGroup = new DivContainer('question__container', `questions${i + 1}`).createDivContainer();
                    const questionProposition = new DivContainer('proposition__container', `propositions${i + 1}`).createDivContainer();
                    const questionLabel = new Label(`question${i + 1}`, `Question ${i + 1}`).createLabel();
                    const questionInputName = new InputField('question__name', `question${i + 1}`, `question${i + 1}name`, 'text', `Question ${i + 1}`, true).createInputField();
                    for (let j = 0; j < 4; j++) {
                        const choiceAnswer = new RadioButton(`question__choice`, `choice${lettre[j]}_${i + 1}`, `question${i + 1}choice`, 'wrong').createRadioButton();
                        const proposition = new InputField('question__proposition', `choice${lettre[j]}_${i + 1}`, `question${i + 1}answer${lettre[j]}wrong`, 'text', `Proposition ${j + 1}`, true).createInputField();
                        questionProposition.appendChild(choiceAnswer);
                        questionProposition.appendChild(proposition);
                        questionGroup.appendChild(questionProposition);
                    }
                    questionGroup.appendChild(questionLabel);
                    questionGroup.appendChild(questionInputName);
                    questionGroup.appendChild(questionProposition);
                    document.getElementById('questions').appendChild(questionGroup);
            }
        }
        if (isDesincrementing) {
            const questionsDiv = document.getElementById('questions');
            for (let i = previousValue - 1; i > newValue; i--) {
                
                questionsDiv.removeChild(questionsDiv.lastChild);
            }
        }
        previousValue = newValue;
    }
});

nbQuestions.addEventListener('change', function() {
    if (this.value === "0") return this.value = "1";
    const newValue = Number(this.value);
    const isIncrementing = newValue > previousValue;
    previousValue = newValue;  

    if (isIncrementing) {
        const questionGroup = new DivContainer('question__container', `questions${newValue}`).createDivContainer();
        const questionProposition = new DivContainer('proposition__container', `propositions${newValue}`).createDivContainer();
        const questionLabel = new Label(`question${newValue}`, `Question ${newValue}`).createLabel();
        const questionInputName = new InputField('question__name', `question${newValue}`, `question${newValue}name`, 'text', `Question ${newValue}`, true).createInputField();
        for (let i = 0; i < 4; i++) {
            const choiceAnswer = new RadioButton(`question__choice`, `choice${lettre[i]}_${newValue}`, `question${newValue}choice`, 'wrong').createRadioButton();
            const proposition = new InputField('question__proposition', `choice${lettre[i]}_${newValue}`, `question${newValue}answer${lettre[i]}wrong`, 'text', `Proposition ${i + 1}`, true).createInputField();
            questionProposition.appendChild(choiceAnswer);
            questionProposition.appendChild(proposition);
            questionGroup.appendChild(questionProposition);
        }
        questionGroup.appendChild(questionLabel);
        questionGroup.appendChild(questionInputName);
        questionGroup.appendChild(questionProposition);
        document.getElementById('questions').appendChild(questionGroup);
    } else {
        const questionsDiv = document.getElementById('questions');
        if (questionsDiv.childElementCount > 1) {
            questionsDiv.removeChild(questionsDiv.lastChild);
        }
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

    const questionsContainer = [...document.getElementsByClassName('question__container')];

    console.log(questionsContainer);
    
    questionsContainer.forEach(questionContainer => {
        questionContainer.remove();
    });

    document.getElementById('nbQuestions').value = '1';
    document.getElementById('quizName').value = '';

    const questionGroup = new DivContainer('question__container', 'questions1').createDivContainer();
    const questionProposition = new DivContainer('proposition__container', 'propositions1').createDivContainer();
    const questionLabel = new Label('question1', 'Question 1').createLabel();
    const questionInputName = new InputField('question__name', 'question1', 'question1name', 'text', 'Question 1', true).createInputField();
    for (let i = 0; i < 4; i++) {
        const choiceAnswer = new RadioButton(`question__choice`, `choice${lettre[i]}`, `question1choice`, 'wrong').createRadioButton();
        const proposition = new InputField('question__proposition', `choice${lettre[i]}_1`, `question1answer${lettre[i]}wrong`, 'text', `Proposition ${i + 1}`, true).createInputField();
        questionProposition.appendChild(choiceAnswer);
        questionProposition.appendChild(proposition);
        questionGroup.appendChild(questionProposition );
    }
    document.getElementById('questions').appendChild(questionGroup);
    questionGroup.appendChild(questionLabel);
    questionGroup.appendChild(questionInputName);
    questionGroup.appendChild(questionProposition);
});
 
