export class DivContainer {
    /**
     * Constructor for DivContainer class
     * 
     * @param {string} className - The identifier for CSS
     * @param {string} id - The unique identifier for JS
     */
    constructor(className, id) {
        this.className = className;
        this.id = id;
    }

    /**
     * Method to create a div container
     * 
     * @returns {HTMLDivElement} The created div container element
     */
    createDivContainer() {
        const divContainer = document.createElement('div');
        divContainer.className = this.className;
        divContainer.id = this.id;

        return divContainer;
    }
}