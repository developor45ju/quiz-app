export class Label {
    /**
     * Constructor for Label class
     * 
     * @param {string} forId - The id of the element this label is for
     * @param {string} text - The text content of the label
     */
    constructor(forId, text) {
        this.forId = forId;
        this.text = text;
    }

    /**
     * Method to create a label
     * 
     * @returns {HTMLLabelElement} The created label element
     */
    createLabel() {
        const label = document.createElement('label');
        label.htmlFor = this.forId;
        label.textContent = this.text;

        return label;
    }
}