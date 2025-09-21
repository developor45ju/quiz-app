class Router {
    constructor() {
        this.routes = [];
        this. groupName = [];
        this.notFoundCallback = null;
        this.lastVisitedPath = null;
        this.firstVisited = true;
        window.addEventListener('popstate', () => this.handleLocation());

        document.addEventListener('click', e => {
            const link = e.target.closest('a[data-link]');
            if (link) {
                e.preventDefault();
                this.navigate(link.getAttribute('href'));
            }
        });
    }

    /**
     * Add a group function at Router
     * @param {String} prefix 
     * @param {Function} callback
     * @returns {Router}
     */
    group(prefix, callback) {
        this.groupName.push(prefix);
        callback(this);
        this.groupName.pop();
        return this;
    }

    /**
     * Add a route with support for dynamic params (e.g. /quiz/:id)
     * @param {string} path 
     * @param {Function} callback
     * @return {Router}
     */
    addRoute(path, callback) {
        const fullPath = this.groupName.join('') + path;
        const paramNames = [];
        const regexPath = fullPath.replace(/:[^/]+/g, (match) => {
            paramNames.push(match.substring(1));
            return '([^/]+)';
        });
        const regex = new RegExp('^' + regexPath + '$');
        this.routes.push({ path: fullPath, regex, paramNames, callback });
        return this;
    }

    /**
     * Add a route for 404 Not Found
     * @param {Function} callback 
     * @returns {Router}
     */
    addNotFound(callback) {
        this.notFoundCallback = callback;
        return this;
    }

    updateActiveLink(location = window.location.pathname) {
    const links = document.querySelectorAll('.nav__link');
    links.forEach(link => {
        // On compare le href du lien à l'URL courante
        if (link.getAttribute('href') === location) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

    /**
     * Navigate to a specific path
     * @param {string} path 
     */
    navigate(path) {
        if (window.location.pathname !== path) {
            history.pushState({}, '', path);
            this.handleLocation();
        }
    }

    /**
     * Match the current path to a route and extract params
     * @param {string} path
     * @returns {{callback: Function, params: Object}|null}
     */
    matchRoute(path) {
        for (const route of this.routes) {
            const match = path.match(route.regex);
            if (match) {
                const params = {};
                route.paramNames.forEach((name, i) => {
                    params[name] = match[i + 1];
                });
                return { callback: route.callback, params };
            }
        }
        return null;
    }

    /**
     * Handle the current location and execute the corresponding route callback
     */
    handleLocation() {
        const path = window.location.pathname;
        if (path === this.lastVisitedPath && !this.firstVisited) {
            return;
        }
        this.lastVisitedPath = path;
        const match = this.matchRoute(path);
        if (match) {
            match.callback(match.params);
        } else if (this.notFoundCallback) {
            this.notFoundCallback();
        }
        this.updateActiveLink();
    }

    /**
     * Initialize the router and handle the initial location
     */
    start() {
        this.lastVisitedPath = window.location.pathname;
        this.handleLocation();
        this.firstVisited = false;
    }
}

export default new Router();
