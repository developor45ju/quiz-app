export class ArticleContainer {

    /**
     * Constructor for the ArticleContainer class
     * 
     * @param {string} className 
     * @param {string} id 
     */
    constructor(className, id) {
        this.className = className;
        this.id = id;
    }

    /**
     * Method to create an article container
     * 
     * @returns {HTMLArticleElement} The created article container element
     */

    createArticleContainer() {
        const articleContainer = document.createElement('article');
        articleContainer.className = this.className;
        articleContainer.id = this.id;

        return articleContainer;
    }
}