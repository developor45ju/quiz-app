<?php
namespace App\Router;

class Router {
    private array $routes = [];

    public function __construct() {}

    /**
     * Add a path with th method, the url and the callable in the routes adding
     * 
     * @param string $method
     * @param string $url
     * @param callable|string $callback
     * @return void
     */
    public function addRoute(string $method, string $url, $callback): void {
        $this->routes[] = [
            'method' => $method,
            'url' => $url,
            'callable' => $callback
        ];
    }

    private function getParams(array $route, string $uri): array {
        $regex = preg_replace('#:([\w]+)#', '([^/]+)', trim($route['url'], '/'));
        if (preg_match("#^$regex$#", trim($uri, '/'), $matches)) {
            return array_slice($matches, 1);
        }
        return [];
    }

    private function callableByController(array $route) {
        $string = explode('#', $route['callable']);
        $controller = $string[0];
        $method = $string[1];
        if (class_exists($controller)) {
            $controllerInstance = new $controller;
            if (method_exists($controllerInstance, $method)) {
                $params = $this->getParams($route, $_SERVER['REQUEST_URI']);
                call_user_func_array([$controllerInstance, $method], $params);
                return;
            }
        }

        throw new \Exception('The controller doesn\'t exist !');
    }

    public function run() {
        foreach ($this->routes as $route) {
            if ($route['method'] === $_SERVER['REQUEST_METHOD']) {
                $regex = preg_replace('#:([\w]+)#', '([^/]+)', trim($route['url'], '/'));
                if (preg_match("#^$regex$#", trim($_SERVER['REQUEST_URI'], '/'))) {
                    if (gettype($route['callable']) === 'string') {
                        return $this->callableByController($route);
                    } else if (is_callable($route['callable'])) {
                        $params = $this->getParams($route, $_SERVER['REQUEST_URI']);
                        return call_user_func_array($route['callable'], $params);
                    }
                }
            }
        }

        http_response_code(404);
        json_encode(['status' => 404, 'message' => 'Page not found']);
    }
}
