<?php
namespace App\Controllers;

require_once __DIR__ . '/../models/Quiz.php';
require_once __DIR__ . '/../models/Question.php';

use App\Models\Quiz;
use App\Models\Question;

class QuizController
{
    public function createQuiz()
    {
        header('Content-Type: application/json');
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);

            $quizName = $data['quizName'];
            $nbQuestions = intval($data['nbQuestions']);

            $questions = [];

            for ($i = 1; $i <= $nbQuestions; $i++) {
                $questionName = $data['question' . $i . 'name'];
                $answers = [];

                foreach (['A', 'B', 'C', 'D'] as $letter) {
                    $correctKey = 'question' . $i . 'answer' . $letter . 'correct';
                    $wrongKey = 'question' . $i . 'answer' . $letter . 'wrong';

                    if (isset($data[$correctKey])) {
                        $answers[] = [
                            'response' => $data[$correctKey],
                            'correct' => true
                        ];
                    } elseif (isset($data[$wrongKey])) {
                        $answers[] = [
                            'response' => $data[$wrongKey],
                            'correct' => false
                        ];
                    }
                }

                $newQuestion = new Question($questionName, $answers);
                $questions[] = [
                    'questionId' => $newQuestion->getQuestionId(),
                    'question' => $newQuestion->getQuestion(),
                    'answers' => $newQuestion->getAnswers()
                ];
            }

            $newQuiz = new Quiz($quizName, $nbQuestions, $questions);

            $quiz = [
                'quizId' => $newQuiz->getQuizId(),
                'quizName' => $newQuiz->getQuizName(),
                'nbQuestion' => $newQuiz->getNbQuestion(),
                'questions' => $newQuiz->getListQuestion()
            ];

            $filePath = __DIR__ . '/../../data/db.json';
            $fileContent = file_get_contents($filePath);
            $quizzes = json_decode($fileContent, true);

            if (!is_array($quizzes)) {
                $quizzes = [];
            }

            $quizzes[] = $quiz;

            file_put_contents($filePath, json_encode($quizzes, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

            $response = ['status' => 'success', 'message' => 'Données reçues et traitées.'];
            echo json_encode($response);
            exit;

        } else {
            $response = ['status' => 'error', 'message' => 'Méthode non autorisée'];
            echo json_encode($response);
            exit;
        }
    }

    public function showAllQuiz() {
        header('Content-Type: application/json');
        try {
            $filePath = __DIR__ . '/../../data/db.json';
            $fileContent = file_get_contents($filePath);
            $readQuizFileJson = json_decode($fileContent, true);
            $response = ['status' => 'success', 'message' => $readQuizFileJson];
            echo json_encode($response);
            exit;
        } catch (\Exception $e) {
            $response = ['status' => 'error', 'message' => 'Le fichier n\'a pas pu être récupéré' . $e->getMessage()];
            echo json_encode($response);
            exit;
        }
    }
}