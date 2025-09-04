<?php
namespace App\Controllers;

header('Content-Type: application/json, charset=UTF-8');

require_once __DIR__ . '/../db_config.php';

use App\Config\DbConfig;

class QuizController
{

    private $pdo;
    private $date;
    
    public function __construct()
    {
        $dbConfig = new DbConfig();
        $this->pdo = $dbConfig->getPdo();
        $this->date = date('Y-m-d');
    }
    public function createQuiz()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') { 
            $data = json_decode(file_get_contents('php://input'), true);

            $quizName = htmlspecialchars($data['quizName']);
            $quizDescription = htmlspecialchars($data['quizDescription']);
            $nbQuestions = intval($data['nbQuestions']);
            $quizCategory = $data['quizCategory'];
            $quizDifficulty = $data['quizDifficulty'];

            if (empty($quizName) || $nbQuestions <= 0) {
                $response = ['status' => 'error', 'message' => 'Nom du quiz ou nombre de questions invalide.'];
                echo json_encode($response);
                exit;
            }
            try {
                $this->pdo->beginTransaction();
                $stmt = $this->pdo->prepare("INSERT INTO Quiz (ID, title, content_desc, nb_question, category, difficulty, created_at) VALUES (:ID, :title, :content_desc, :nb_question, :category, :difficulty, :created_at)");
                $quizId = md5(uniqid());
                $stmt->bindParam(':ID', $quizId);
                $stmt->bindParam(':title', $quizName);
                $stmt->bindParam(':content_desc', $quizDescription);
                $stmt->bindParam(':nb_question', $nbQuestions);
                $stmt->bindParam(':category', $quizCategory);
                $stmt->bindParam(':difficulty', $quizDifficulty);
                $stmt->bindParam(':created_at', $this->date);
                $stmt->execute();

                for ($i = 1; $i <= $nbQuestions; $i++) {
                    $questionName = htmlspecialchars($data['question' . $i . 'name']);
                    $stmt = $this->pdo->prepare("INSERT INTO Question (ID, question_text, quiz_id) VALUES (:ID, :question_text, :quiz_id)");
                    $questionId = md5(uniqid());
                    $stmt->bindParam(':ID', $questionId);
                    $stmt->bindParam(':question_text', $questionName);
                    $stmt->bindParam(':quiz_id', $quizId);
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
                        $stmt = $this->pdo->prepare("INSERT INTO Answer (ID, answer_text, is_correct, question_id) VALUES (:ID, :answer_text, :is_correct, :question_id)");
                        $answerId = md5(uniqid());
                        $stmt->bindParam(':ID', $answerId);
                        $stmt->bindParam(':answer_text', $answerText);
                        $stmt->bindParam(':is_correct', $isCorrect);
                        $stmt->bindParam(':question_id', $questionId);
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
            $stmt = $this->pdo->prepare("SELECT * FROM Quiz");
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
            $stmt = $this->pdo->prepare("SELECT * FROM Quiz WHERE ID = :ID");
            $stmt->bindParam(':ID', $id);
            $stmt->execute();
            $quiz = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$quiz) {
                $response = ['status' => 'error', 'message' => 'Quiz non trouvé'];
                echo json_encode($response);
                exit;
            }

            $stmt = $this->pdo->prepare("SELECT * FROM Question WHERE quiz_id = :ID");
            $stmt->bindParam(':ID', $id);
            $stmt->execute();
            $questions = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            foreach ($questions as &$question) {
                $stmt = $this->pdo->prepare("SELECT * FROM Answer WHERE question_id = :question_id");
                $stmt->bindParam(':question_id', $question['ID']);
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
            $stmt = $this->pdo->prepare("DELETE FROM Answer WHERE question_id IN (SELECT ID FROM Question WHERE quiz_id = :quiz_id)");
            $stmt->bindParam(':quiz_id', $id);
            $stmt->execute();

            $stmt = $this->pdo->prepare("DELETE FROM Question WHERE quiz_id = :quiz_id");
            $stmt->bindParam(':quiz_id', $id);
            $stmt->execute();

            $stmt = $this->pdo->prepare("DELETE FROM Quiz WHERE ID = :ID");
            $stmt->bindParam(':ID', $id);
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
            $nbQuestions = intval($data['nbQuestions']);
            $quizCategory = htmlspecialchars($data['quizCategory']);
            $quizDifficulty = htmlspecialchars($data['quizDifficulty']);

            if (empty($quizName) || $nbQuestions <= 0) {
                $response = ['status' => 'error', 'message' => 'Nom du quiz ou nombre de questions invalide.'];
                echo json_encode($response);
                exit;
            }

            try {
                $this->pdo->beginTransaction();
                $stmt = $this->pdo->prepare("UPDATE Quiz SET title = :title, content_desc = :content_desc, nb_question = :nb_question, category = :category, difficulty = :difficulty WHERE ID = :ID");
                $stmt->bindParam(':title', $quizName);
                $stmt->bindParam(':content_desc', $quizDescription);
                $stmt->bindParam(':nb_question', $nbQuestions);
                $stmt->bindParam(':category', $quizCategory);
                $stmt->bindParam(':difficulty', $quizDifficulty);
                $stmt->bindParam(':ID', $id);
                $stmt->execute();

                $stmt = $this->pdo->prepare("SELECT ID, question_text FROM Question WHERE quiz_id = :quiz_id");
                $stmt->bindParam(':quiz_id', $id);
                $stmt->execute();
                $result = $stmt->fetchAll(\PDO::FETCH_ASSOC);

                if ($nbQuestions < count($result)) {
                    for ($j = $nbQuestions; $j < count($result); $j++) {
                        $stmt = $this->pdo->prepare("DELETE FROM Answer WHERE question_id = :question_id");
                        $stmt->bindParam(':question_id', $result[$j]['ID']);
                        $stmt->execute();
                        $stmt = $this->pdo->prepare("DELETE FROM Question WHERE ID = :question_id");
                        $stmt->bindParam(':question_id', $result[$j]['ID']);
                        $stmt->execute();
                    }
                }
                for ($i = 1; $i <= $nbQuestions; $i++) {
                    $questionName = htmlspecialchars($data['question' . $i . 'name']);
                    if (isset($result[$i - 1])) {
                        $questionId = $result[$i - 1]['ID'];
                        $stmt = $this->pdo->prepare("UPDATE Question SET question_text = :question_text WHERE quiz_id = :quiz_id AND ID = :question_id");
                        $stmt->bindParam(':question_text', $questionName);
                        $stmt->bindParam(':quiz_id', $id);
                        $stmt->bindParam(':question_id', $questionId);
                        $stmt->execute();

                        $stmt = $this->pdo->prepare("SELECT ID FROM Answer WHERE question_id = :question_id");
                        $stmt->bindParam(':question_id', $questionId);
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
                                $stmt = $this->pdo->prepare("UPDATE Answer SET answer_text = :answer_text, is_correct = :is_correct WHERE ID = :answer_id");
                                $stmt->bindParam(':answer_text', $answerText);
                                $stmt->bindParam(':is_correct', $isCorrect);
                                $stmt->bindParam(':answer_id', $answerIds[$answerIndex]);
                                $stmt->execute();
                            }
                            $answerIndex++;
                        }
                    } else {
                        $questionId = md5(uniqid());
                        $stmt = $this->pdo->prepare("INSERT INTO Question (ID, question_text, quiz_id) VALUES (:ID, :question_text, :quiz_id)");
                        $stmt->bindParam(':ID', $questionId);
                        $stmt->bindParam(':question_text', $questionName);
                        $stmt->bindParam(':quiz_id', $id);
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
                            $stmt = $this->pdo->prepare("INSERT INTO Answer (ID, answer_text, is_correct, question_id) VALUES (:ID, :answer_text, :is_correct, question_id)");
                            $stmt->bindParam(':ID', $answerId);
                            $stmt->bindParam(':answer_text', $answerText);
                            $stmt->bindParam(':is_correct', $isCorrect);
                            $stmt->bindParam(':question_id', $questionId);
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