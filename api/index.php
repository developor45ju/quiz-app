<?php
require_once __DIR__ . '/controllers/quizController.php';
require_once __DIR__ . '/router/Router.php';

use App\Router\Router;

$newRouteur = new Router();
$newRouteur->addRoute('GET', '/api', function() {
    echo 'Hello World';
});
$newRouteur->addRoute('GET', '/api/getAllQuiz', 'App\Controllers\QuizController#showAllQuiz');
$newRouteur->addRoute('POST', '/api/postQuiz', 'App\Controllers\QuizController#createQuiz');
$newRouteur->addRoute('GET', '/api/helloWorld', 'App\Controllers\QuizController#helloWorld');

$newRouteur->run();