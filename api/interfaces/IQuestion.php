<?php

namespace App\Interfaces;

interface IQuestion {
    /**
     * @return string
     */
    public function getQuestionId(): string;

    /**
     * @return string
     */
    public function getQuestion(): string;

    /**
     * @param string $question
     * 
     * @return void
     */
    public function setQuestion(string $question): void;

    /**
     * @return array<string, string>
     */
    public function getAnswers(): array;

    /**
     * @param array<string, string> $answer
     * 
     * @return void
     */
    public function setAnswer(array $anwser): void;
}