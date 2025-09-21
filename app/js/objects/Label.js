export class Label {
    /**
     * Constructor for Label class
     * 
     * @param {string} forId - The id of the element this label is for
     * @param {string} className - The classof the elements Label
     * @param {string} text - The text content of the label
     */
    constructor(forId, className, text) {
        this.forId = forId;
        this.className = className;
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
        label.classList = this.className;
        label.textContent = this.text;

        return label;
    }
}