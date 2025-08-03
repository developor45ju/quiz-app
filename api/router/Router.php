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

    public function __construct(string $url) {
        $this->url = $url;
    }

    /**
     * Add a GET route
     * 
     * @param string $url
     * @param callable|string $callback
     */
    
    /**
     * Add a GET route
     * 
     * @param string $url
     * @param callable|string $callback
     * @param string|null $name
     * @return $this
     */
    public function get(string $url, $callback, ?string $name = null) {
        $this->addRoute($url, $callback, $name, 'GET');
        return $this;
    }
    /**
     * Add a POST route
     * 
     * @param string $url
     * @param callable|string $callback
     * @param string|null $name
     * @return $this
     */
    public function post(string $url, $callback, ?string $name = null) {
        $this->addRoute($url, $callback, $name, 'POST');
        return $this;
    }
    /**
     * Add a PUT route
     * 
     * @param string $url
     * @param callable|string $callback
     * @param string|null $name
     * @return $this
     */
    public function put(string $url, $callback, ?string $name = null) {
        $this->addRoute($url, $callback, $name, 'PUT');
        return $this;
    }
    /**
     * Add a DELETE route
     * 
     * @param string $url
     * @param callable|string $callback
     * @param string|null $name
     * @return $this
     */
    public function delete(string $url, $callback, ?string $name = null) {
        $this->addRoute($url, $callback, $name, 'DELETE');
        return $this;
    }

    /**
     * Add a path with th method, the url and the callable in the routes adding
     * 
     * @param string $method
     * @param string $url
     * @param callable|string $callback
     * @return void
     */
    public function addRoute(string $url, $callable, ?string $name, string $method): void {
        $route = new Route($url, $callable);
        $this->routes[$method][] = $route;
        if (is_string($callable) && $name === null) {
            $name = $callable;
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
        echo 'Route non trouvé !';
    }
}
