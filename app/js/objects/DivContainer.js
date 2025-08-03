export class DivContainer {
    /**
     * Constructor for DivContainer class
     * 
     * @param {string} className - The identifier for CSS
     */
    constructor(className) {
        this.className = className;
    }

    /**
     * Method to create a div container
     * 
     * @returns {HTMLDivElement} The created div container element
     */
    createDivContainer() {
        const divContainer = document.createElement('div');
        divContainer.className = this.className;

        return divContainer;
    }
}