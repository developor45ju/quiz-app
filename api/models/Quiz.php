<?php

namespace App\Models;

require_once __DIR__ . '/../helpers/generateId.php';
require_once __DIR__ . '/../interfaces/IQuiz.php';

use App\Helpers\IdGenerator;
use App\Interfaces\IQuiz;

class Quiz implements IQuiz {
    private string $quizId;
    private string $quizName;
    private int $nbQuestion;
    private array $listQuestion = [];

    /**
     * Use constructor to create a new quiz
     * 
     * @param string $quizName
     * @param int $nbQuestion
     * @param array $listQuestion
     */

    public function __construct(string $quizName, int $nbQuestion, array $listQuestion = []) {
        $idGenerator = new IdGenerator();
        $this->quizId = $idGenerator->guidv4();
        $this->quizName = $quizName;
        $this->nbQuestion = $nbQuestion;
        $this->listQuestion = $listQuestion;
    }

    /**
     * @ineritdoc
     */

    public function getQuizId(): string {
        return $this->quizId;
    }

    /**
     * @ineritdoc
     */

    public function getQuizName(): string {
        return $this->quizName;
    }

    /**
     * @ineritdoc
     */

    public function setQuizName(string $quizName): void {
        $this->quizName = $quizName;
    }

    /**
     * @ineritdoc
     */

    public function getNbQuestion(): int {
        return $this->nbQuestion;
    }

    /**
     * @ineritdoc
     */

    public function setNbQuestion(int $nbQuestion): void {
        $this->nbQuestion = $nbQuestion;
    }

    /**
     * @ineritdoc
     */

    public function getListQuestion(): array {
        return $this->listQuestion;
    }

    /**
     * @ineritdoc
     */

    public function setListQuestion(array $question): void {
        $this->listQuestion = $question;
    }
}