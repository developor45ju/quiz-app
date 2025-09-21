export class InputField {
    /**
     * Constructor for InputField class
     * 
     * @param {string} className - The identifier for CSS styling
     * @param {string|null} id - The identifier for the input field
     * @param {string} name - The name of the input field
     * @param {string} placeholder - The placeholder text for the input field
     * @param {boolean} required - If yes or no the field is required
     */
    constructor(className, id = null, name, placeholder, required = false) {
        this.className = className;
        this.id = id;
        this.name = name;
        this.placeholder = placeholder;
        this.required = required;
    }

    /**
     * Method to create an input field
     * 
     * @returns {HTMLInputElement} The created input field element
     */
    createInputField() {
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.className = this.className;
        if (this.id) {
            inputField.id = this.id;
        }
        inputField.name = this.name;
        inputField.placeholder = this.placeholder;
        inputField.required = this.required;

        return inputField;
    }
}