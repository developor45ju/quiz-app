export class RadioButton {
    /**
     * Constructor for RadioButton class
     * 
     * @param {string} className - The identifiator for CSS
     * @param {string} name - The name of imput for sending in PHP
     * @param {string} value - The value of the radio button
     * @param {string} ariaLabel - It's for the readers screen 
     */

    constructor(className, name, value, ariaLabel) {
        this.className = className;
        this.name = name;
        this.value = value;
        this.ariaLabel = ariaLabel;
    }

    /**
     * Method to create a radio button
     * 
     * @returns {HTMLElement} The created radio button element
     */

    createRadioButton() {
        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.className = this.className;
        radioButton.name = this.name;
        radioButton.value = this.value;
        radioButton.setAttribute('aria-label', this.ariaLabel);

        return radioButton;
    }
}