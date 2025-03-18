<?php

namespace App\Interfaces;

interface IQuiz {

    /**
     * @return string
     */
    public function getQuizId(): string;

    /**
     * @return string
     */
    public function getQuizName(): string;

    /**
     * @param string $quizName
     * 
     * @return void
     */
    public function setQuizName(string $quizName): void;

    /** 
     * @return int
     */
    public function getNbQuestion(): int;

    /**
     * @param int $nbQuestion
     * 
     * @return void
     */
    public function setNbQuestion(int $nbQuestion): void;

    /**
     * @return array<string>
     */
    public function getListQuestion(): array;

    /**
     * @param array<string> $listQuestion
     * 
     * @return void
     */
    public function setListQuestion(array $question): void;
}