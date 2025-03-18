export class RadioButton {
    /**
     * Constructor for RadioButton class
     * 
     * @param {string} className - The identifiator for CSS
     * @param {string} id - The unique identificator for JS
     * @param {string} name - The name of imput for sending in PHP
     * @param {string} value - The value of the radio button
     */

    constructor(className, id, name, value) {
        this.className = className;
        this.id = id;
        this.name = name;
        this.value = value;
    }

    /**
     * Method to create a radio button
     * 
     * @returns {HTMLElement} The created radio button element
     */

    createRadioButton() {
        const radioButton = document.createElement('input');
        radioButton.className = this.className;
        radioButton.id = this.id;
        radioButton.name = this.name;
        radioButton.value = this.value;
        radioButton.type = 'radio';

        return radioButton;
    }
}