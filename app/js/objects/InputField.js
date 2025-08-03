export class InputField {
    /**
     * Constructor for InputField class
     * 
     * @param {string} className - The identifier for CSS styling
     * @param {string} id - The identifier for the input field
     * @param {string} name - The name of the input field
     * @param {string} type - The type of the input field
     * @param {string} placeholder - The placeholder text for the input field
     */
    constructor(className, id, name, type, placeholder) {
        this.className = className;
        this.id = id;
        this.name = name;
        this.type = type;
        this.placeholder = placeholder;
    }

    /**
     * Method to create an input field
     * 
     * @returns {HTMLInputElement} The created input field element
     */
    createInputField() {
        const inputField = document.createElement('input');
        inputField.className = this.className;
        inputField.id = this.id;
        inputField.name = this.name;
        inputField.type = this.type;
        inputField.placeholder = this.placeholder;

        return inputField;
    }
}