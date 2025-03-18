<?php

namespace App\Models;

require_once __DIR__ . '/../helpers/generateId.php';
require_once __DIR__ . '/../interfaces/IQuestion.php';

use App\Helpers\IdGenerator;
use App\Interfaces\IQuestion;

class Question implements IQuestion {
    private string $questionId;
    private string $question;
    private array $answers = [];

    /**
     * Use constructor to create a new question
     * 
     * @param string $question
     * @param array $answers
     */
    public function __construct(string $question, array $answers = []) {
        $idGenerator = new IdGenerator();
        $this->questionId = $idGenerator->guidv4();
        $this->question = $question;
        $this->answers = $answers;
    }

    /**
     * @ineritdoc
     */
    public function getQuestionId(): string {
        return $this->questionId;
    }

    /**
     * @ineritdoc
     */
    public function getQuestion(): string {
        return $this->question;
    }

    /**
     * @ineritdoc
     */
    public function setQuestion(string $question): void {
        $this->question = $question;
    }

    /**
     * @ineritdoc
     */
    public function getAnswers(): array {
        return $this->answers;
    }

    /**
     * @ineritdoc
     */
    public function setAnswer(array $answer): void {
        $this->answers = $answer;
    }
}