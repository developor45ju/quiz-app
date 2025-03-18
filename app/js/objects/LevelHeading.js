export class LevelHeadingContainer {

    /**
     * Constructor to create a level heading container
     * 
     * @param {string} levelHeading
     * @param {string} title
     * @param {string} className 
     * @param {string} id 
     */
    constructor(levelHeading, title, className, id) {
        this.levelHeading = levelHeading;
        this.title = title;
        this.className = className;
        this.id = id;
    }

    /**
     * Method to create a level heading container
     * 
     * @returns {HTMLHeadingElement} The created level heading container element
     */

    createLevelHeadingContainer() {
        const levelHeadingContainer = document.createElement(this.levelHeading);
        levelHeadingContainer.textContent = this.title;
        levelHeadingContainer.className = this.className;
        levelHeadingContainer.id = this.id;

        return levelHeadingContainer;
    }
}