export default class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this._history = window.history;
    }
    
    route(path, callback) {
        const param = /:([\w]+)/g
        if (path.match(param)) {
            const replaceString = `^${path.replace(param, '([^/]+)')}$`;
            
            this.routes[replaceString] = {regex: new RegExp(replaceString), callback};
            
        } else {
            this.routes[path] = callback;
        }
    }
    
    initialize() {
        window.addEventListener('popstate', () => {
            this.changeRoute(window.location.pathname);
        });
        
        this.changeRoute(window.location.pathname);
    }
    
    changeRoute(path) {
        let handledRoute = this.routes[path];
        
        if (!handledRoute) {
            for (const routePath in this.routes) {
                const route = this.routes[routePath];
                
                if (route.regex && route.regex.test(path)) {
                    const params = path.match(route.regex).slice(1);
                    handledRoute = () => route.callback(...params);
                    break;
                }
            }
        }
        if (!handledRoute) {
            handledRoute = this.routes['*'];
        }
        
        handledRoute && handledRoute();

        const event = new CustomEvent('routeChanged', { detail: { path: path } });
        window.dispatchEvent(event);
    }
    
    navigateTo(path) {
        if (path === window.location.pathname) {
            // Si la nouvelle route est la même que la route actuelle, ne rien faire
            return;
        }
        this._history.pushState({}, '', `${path}`);  
        this.changeRoute(`${path}`);
    }
}