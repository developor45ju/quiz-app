export class ParagraphContainer {
    /**
     * Constructor for the ParagraphContainer class
     * 
     * @param {string} className - The identifier for CSS styling
     * @param {string} id - The unique identifier for the paragraph
     * @param {string} text - The text content of the paragraph
     */

    constructor(className, id, text) {
        this.className = className;
        this.id = id;
        this.text = text;
    }

    /**
     * Method to create a paragraph element
     * 
     * @returns {HTMLParagraphElement} The created paragraph element
     */

    createParagraph() {
        const paragraph = document.createElement('p');
        paragraph.className = this.className;
        paragraph.id = this.id;
        paragraph.textContent = this.text;

        return paragraph;
    }
}