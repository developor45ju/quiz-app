<?php
require_once __DIR__ . '/controller/quizController.php';
require_once __DIR__ . '/router/Router.php';

use App\Router\Router;

$newRouter = new Router($_GET['q']);
$newRouter->get('/getAllQuiz', 'Quiz#showAllQuiz')
          ->get('/getQuiz/:id', 'Quiz#showQuiz')
          ->post('/postQuiz', 'Quiz#createQuiz')
          ->delete('/deleteQuiz/:id', 'Quiz#deleteQuiz')
          ->put('/updateQuiz/:id', 'Quiz#updateQuiz')
          ->run();