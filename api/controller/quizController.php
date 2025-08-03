<?php
namespace App\Controllers;

header('Content-Type: application/json, charset=UTF-8');

require_once __DIR__ . '/../db_config.php';

use App\Config\DbConfig;

class QuizController
{

    private $pdo;
    
    public function __construct()
    {
        $dbConfig = new DbConfig();
        $this->pdo = $dbConfig->getPdo();
    }
    public function createQuiz()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') { 
            $data = json_decode(file_get_contents('php://input'), true);

            $quizName = htmlspecialchars($data['quizName']);
            $quizDescription = htmlspecialchars($data['quizDescription']);
            $quizCategory = $data['quizCategory'];
            $quizDifficulty = $data['quizDifficulty'];
            $nbQuestions = intval($data['nbQuestions']);

            if (empty($quizName) || $nbQuestions <= 0) {
                $response = ['status' => 'error', 'message' => 'Nom du quiz ou nombre de questions invalide.'];
                echo json_encode($response);
                exit;
            }
            try {
                $this->pdo->beginTransaction();
                $stmt = $this->pdo->prepare("INSERT INTO quiz (id, title, content_desc, nb_question, category, difficulty) VALUES (:id, :title, :content_desc, :nb_question, :category, :difficulty)");
                $quizId = md5(uniqid());
                $stmt->bindParam(':id', $quizId);
                $stmt->bindParam(':title', $quizName);
                $stmt->bindParam(':content_desc', $quizDescription);
                $stmt->bindParam(':nb_question', $nbQuestions);
                $stmt->bindParam(':category', $quizCategory);
                $stmt->bindParam(':difficulty', $quizDifficulty);
                $stmt->execute();

                for ($i = 1; $i <= $nbQuestions; $i++) {
                    $questionName = htmlspecialchars($data['question' . $i . 'name']);
                    $stmt = $this->pdo->prepare("INSERT INTO question (id, id_quiz, question) VALUES (:id, :id_quiz, :question)");
                    $questionId = md5(uniqid());
                    $stmt->bindParam(':id', $questionId);
                    $stmt->bindParam(':id_quiz', $quizId);
                    $stmt->bindParam(':question', $questionName);
                    $stmt->execute();
                
                    foreach (['A', 'B', 'C', 'D'] as $letter) {
                        $correctKey = 'question' . $i . 'answer' . $letter . 'correct';
                        $wrongKey = 'question' . $i . 'answer' . $letter . 'wrong';
                
                        if (isset($data[$correctKey])) {
                                $answerText = htmlspecialchars($data[$correctKey]);
                                $isCorrect = 1;
                        } elseif (isset($data[$wrongKey])) {
                                $answerText = htmlspecialchars($data[$wrongKey]);
                                $isCorrect = 0;
                        } else {
                            continue;
                        }
                        $stmt = $this->pdo->prepare("INSERT INTO answer (id, id_question, answer, is_correct) VALUES (:id, :id_question, :answer, :is_correct)");
                        $answerId = md5(uniqid());
                        $stmt->bindParam(':id', $answerId);
                        $stmt->bindParam(':id_question', $questionId);
                        $stmt->bindParam(':answer', $answerText);
                        $stmt->bindParam(':is_correct', $isCorrect);
                        $stmt->execute();
                    }
                }
                $this->pdo->commit();


                $response = ['status' => 'success', 'message' => 'Données reçues et traitées.'];
                echo json_encode($response);
                exit;
            } catch (\PDOException $e) {
                $this->pdo->rollBack();
                $response = ['status' => 'error', 'message' => 'Erreur lors de l\'insertion dans la base de données : ' . $e->getMessage()];
                echo json_encode($response);
                exit;
            }
        } else {
            $response = ['status' => 'error', 'message' => 'Méthode non autorisée'];
            echo json_encode($response);
            exit;
        }
    }

    public function showAllQuiz() {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM quiz");
            $stmt->execute();
            $quizzes = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            if (!$quizzes) {
                $response = ['status' => 'error', 'message' => 'Aucun quiz trouvé'];
                echo json_encode($response);
                exit;
            }
            $response = ['status' => 'success', 'message' => $quizzes];
            echo json_encode($response);
            exit;
        } catch (\Exception $e) {
            $response = ['status' => 'error', 'message' => 'Le quiz n\'a pas pu être récupéré ' . $e];
            echo json_encode($response);
            exit;
        }
    }

    public function showQuiz($id) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM quiz WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $quiz = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$quiz) {
                $response = ['status' => 'error', 'message' => 'Quiz non trouvé'];
                echo json_encode($response);
                exit;
            }

            $stmt = $this->pdo->prepare("SELECT * FROM question WHERE id_quiz = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $questions = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            foreach ($questions as &$question) {
                $stmt = $this->pdo->prepare("SELECT * FROM answer WHERE id_question = :id_question");
                $stmt->bindParam(':id_question', $question['ID']);
                $stmt->execute();
                $question['answer'] = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            }

            $quiz['questions'] = $questions;

            $response = ['status' => 'success', 'message' => $quiz];
            echo json_encode($response);
            exit;
        } catch (\Exception $e) {
            $response = ['status' => 'error', 'message' => 'Le quiz n\'a pas pu être récupéré: ' . $e];
            echo json_encode($response);
            exit;
        }
    }

    public function deleteQuiz($id) {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM answer WHERE id_question IN (SELECT id FROM question WHERE id_quiz = :id_quiz)");
            $stmt->bindParam(':id_quiz', $id);
            $stmt->execute();

            $stmt = $this->pdo->prepare("DELETE FROM question WHERE id_quiz = :id_quiz");
            $stmt->bindParam(':id_quiz', $id);
            $stmt->execute();

            $stmt = $this->pdo->prepare("DELETE FROM quiz WHERE id = :id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $response = ['status' => 'success', 'message' => 'Quiz supprimé avec succès'];
            } else {
                $response = ['status' => 'error', 'message' => 'Quiz non trouvé ou déjà supprimé'];
            }
            echo json_encode($response);
            exit;
        } catch (\Exception $e) {
            $response = ['status' => 'error', 'message' => 'Le quiz n\'a pas pu être supprimé: ' . $e];
            echo json_encode($response);
            exit;
        }
    }

    public function updateQuiz($id) {
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $data = json_decode(file_get_contents('php://input'), true);

            $quizName = htmlspecialchars($data['quizName']);
            $quizDescription = htmlspecialchars($data['quizDescription']);
            $quizCategory = htmlspecialchars($data['quizCategory']);
            $nbQuestions = intval($data['nbQuestions']);

            if (empty($quizName) || $nbQuestions <= 0) {
                $response = ['status' => 'error', 'message' => 'Nom du quiz ou nombre de questions invalide.'];
                echo json_encode($response);
                exit;
            }

            try {
                $this->pdo->beginTransaction();
                $stmt = $this->pdo->prepare("UPDATE quiz SET title = :title, content_desc = :content_desc, nb_question = :nb_question WHERE id = :id");
                $stmt->bindParam(':title', $quizName);
                $stmt->bindParam(':content_desc', $quizDescription);
                $stmt->bindParam(':nb_question', $nbQuestions);
                $stmt->bindParam(':id', $id);
                $stmt->execute();

                $stmt = $this->pdo->prepare("SELECT id, question FROM question WHERE id_quiz = :id_quiz");
                $stmt->bindParam(':id_quiz', $id);
                $stmt->execute();
                $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);

                if ($nbQuestions < count($result)) {
                    for ($j = $nbQuestions; $j < count($result); $j++) {
                        $stmt = $this->pdo->prepare("DELETE FROM answer WHERE id_question = :id_question");
                        $stmt->bindParam(':id_question', $result[$j]['id']);
                        $stmt->execute();
                        $stmt = $this->pdo->prepare("DELETE FROM question WHERE id = :id_question");
                        $stmt->bindParam(':id_question', $result[$j]['id']);
                        $stmt->execute();
                    }
                }
                for ($i = 1; $i <= $nbQuestions; $i++) {
                    $questionName = htmlspecialchars($data['question' . $i . 'name']);
                    if (isset($result[$i - 1])) {
                        $questionId = $result[$i - 1]['id'];
                        $stmt = $this->pdo->prepare("UPDATE question SET question = :question WHERE id_quiz = :id_quiz AND id = :id_question");
                        $stmt->bindParam(':question', $questionName);
                        $stmt->bindParam(':id_quiz', $id);
                        $stmt->bindParam(':id_question', $questionId);
                        $stmt->execute();

                        $stmt = $this->pdo->prepare("SELECT id FROM answer WHERE id_question = :id_question");
                        $stmt->bindParam(':id_question', $questionId);
                        $stmt->execute();
                        $answerIds = $stmt->fetchAll(\PDO::FETCH_COLUMN);

                        $answerIndex = 0;
                        foreach (['A', 'B', 'C', 'D'] as $letter) {
                            $correctKey = 'question' . $i . 'answer' . $letter . 'correct';
                            $wrongKey = 'question' . $i . 'answer' . $letter . 'wrong';

                            if (isset($data[$correctKey])) {
                                $answerText = htmlspecialchars($data[$correctKey]);
                                $isCorrect = 1;
                            } elseif (isset($data[$wrongKey])) {
                                $answerText = htmlspecialchars($data[$wrongKey]);
                                $isCorrect = 0;
                            } else {
                                continue;
                            }

                            if (isset($answerIds[$answerIndex])) {
                                $stmt = $this->pdo->prepare("UPDATE answer SET answer = :answer, is_correct = :is_correct WHERE id = :id_answer");
                                $stmt->bindParam(':answer', $answerText);
                                $stmt->bindParam(':is_correct', $isCorrect);
                                $stmt->bindParam(':id_answer', $answerIds[$answerIndex]);
                                $stmt->execute();
                            }
                            $answerIndex++;
                        }
                    } else {
                        $questionId = md5(uniqid());
                        $stmt = $this->pdo->prepare("INSERT INTO question (id, id_quiz, question) VALUES (:id, :id_quiz, :question)");
                        $stmt->bindParam(':id', $questionId);
                        $stmt->bindParam(':id_quiz', $id);
                        $stmt->bindParam(':question', $questionName);
                        $stmt->execute();

                        foreach (['A', 'B', 'C', 'D'] as $letter) {
                            $correctKey = 'question' . $i . 'answer' . $letter . 'correct';
                            $wrongKey = 'question' . $i . 'answer' . $letter . 'wrong';

                            if (isset($data[$correctKey])) {
                                $answerText = htmlspecialchars($data[$correctKey]);
                                $isCorrect = 1;
                            } elseif (isset($data[$wrongKey])) {
                                $answerText = htmlspecialchars($data[$wrongKey]);
                                $isCorrect = 0;
                            } else {
                                continue;
                            }

                            $answerId = md5(uniqid());
                            $stmt = $this->pdo->prepare("INSERT INTO answer (id, id_question, answer, is_correct) VALUES (:id, :id_question, :answer, :is_correct)");
                            $stmt->bindParam(':id', $answerId);
                            $stmt->bindParam(':id_question', $questionId);
                            $stmt->bindParam(':answer', $answerText);
                            $stmt->bindParam(':is_correct', $isCorrect);
                            $stmt->execute();
                        }
                    }
                }

                $this->pdo->commit();
                
                $response = ['status' => 'success', 'message' => 'Quiz mis à jour avec succès.'];
                echo json_encode($response);
                exit;
            } catch (\PDOException $e) {
                $this->pdo->rollBack();
                $response = ['status' => 'error', 'message' => 'Erreur lors de la mise à jour du quiz: ' . $e->getMessage()];
                echo json_encode($response);
                exit;
            }
        } else {
            http_response_code(405);
            echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée']);
            exit;
        }
    }
}