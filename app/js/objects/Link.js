export class LinkContainer {

    /**
     * Constructor for the LinkContainer class
     * 
     * @param {string} className 
     * @param {string} id 
     * @param {string} href 
     * @param {string} text 
     */
    constructor(className, id, href, text) {
        this.className = className;
        this.id = id;
        this.href = href;
        this.text = text;
    }

    /**
     * Method to create a link container
     * 
     * @returns {HTMLAnchorElement} The created link container element
     */

    createLinkContainer() {
        const linkContainer = document.createElement('a');
        linkContainer.className = this.className;
        linkContainer.id = this.id;
        linkContainer.href = this.href;
        linkContainer.textContent = this.text;

        return linkContainer;
    }
}