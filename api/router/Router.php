<?php

namespace App\Router;

require_once __DIR__ . '/Route.php';
use App\Router\Route;

class Router {
    private $url;
    private $routes = [
        'GET' => [],
        'POST' => [],
        'PUT' => [],
        'DELETE' => []
    ];
    private $namedRoutes = [];
    private $middleware = [];

    public function __construct(string $url) {
        $this->url = $url;
    }

    /**
     * Add a GET route
     * 
     * @param string $url
     * @param callable|string $callback
     * @param array $middlewares
     * @param string|null $name
     * @return $this
     */
    public function get(string $url, $callback, array $middlewares = [], ?string $name = null): self {
        $this->addRoute($url, $callback, $middlewares, $name, 'GET');
        return $this;
    }

    /**
     * Add a POST route
     * 
     * @param string $url
     * @param callable|string $callback
     * @param array $middlewares
     * @param string|null $name
     * @return $this
     */
    public function post(string $url, $callback, array $middlewares = [], ?string $name = null): self {
        $this->addRoute($url, $callback, $middlewares, $name, 'POST');
        return $this;
    }

    /**
     * Add a PUT route
     * 
     * @param string $url
     * @param callable|string $callback
     * @param array $middlewares
     * @param string|null $name
     * @return $this
     */
    public function put(string $url, $callback, array $middlewares = [], ?string $name = null): self {
        $this->addRoute($url, $callback, $middlewares, $name, 'PUT');
        return $this;
    }

    /**
     * Add a DELETE route
     * 
     * @param string $url
     * @param callable|string $callback
     * @param array $middlewares
     * @param string|null $name
     * @return $this
     */
    public function delete(string $url, $callback, array $middlewares = [], ?string $name = null): self {
        $this->addRoute($url, $callback, $middlewares, $name, 'DELETE');
        return $this;
    }

    /**
     * Add a path with the method, the url and the callable in the routes adding
     * 
     * @param string $url
     * @param callable|string $callback
     * @param array $middlewares
     * @param string $method
     * @param string|null $name
     * @return void
     */
    public function addRoute(string $url, $callback,  array $middlewares = [], ?string $name = null, string $method): void {
        $route = new Route($url, $callback);
        foreach ($middlewares as $middleware) {
            $route->addMiddleware($middleware);
        }
        $this->routes[$method][] = $route;
        if (is_string($callback) && $name === null) {
            $name = $callback;
        } 
        if ($name) {
            $this->namedRoutes[$name] = $route;
        }
    }

    public function run() {
        if (!isset($this->routes[$_SERVER['REQUEST_METHOD']])) {
            http_response_code(405);
            echo 'Méthode non autorisée !';
            return;
        }
        foreach ($this->routes[$_SERVER['REQUEST_METHOD']] as $route) {
            if ($route->match($this->url)) {
                return $route->call();
            }
        }
        http_response_code(404);
        echo 'Route non trouvée !';
    }
}