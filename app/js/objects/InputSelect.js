export class InputSelect {
    /**
     * Constructor for InputSelect class
     * 
     * @param {string} id - The id of the select element
     * @param {string} name - The name of the select element
     * @param {Array} options - An array of options for the select element
     */
    constructor(id, name, options) {
        this.id = id;
        this.name = name;
        this.options = options;
    }
    /**
     * Method to create a select element
     * 
     * @returns {HTMLSelectElement} The created select element
     */
    createSelect() {
        const select = document.createElement('select');
        select.id = this.id;
        select.name = this.name;

        this.options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.text;
            select.appendChild(opt);
        });

        return select;
    }
}