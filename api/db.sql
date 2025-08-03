CREATE DATABASE quizapp;

USE quizapp;

CREATE TABLE Quiz (
    ID varchar(38) NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content_desc TEXT NOT NULL,
    nb_question int NOT NULL,
    category ENUM('Géneral', 'Mathématique', 'Informatique'),
    difficulty ENUM('Facile', 'Moyen', 'Difficile')
);

CREATE TABLE Question (
    ID VARCHAR(38) NOT NULL UNIQUE,
    id_quiz VARCHAR(38) NOT NULL,
    question TEXT NOT NULL,
    FOREIGN KEY (id_quiz)
    REFERENCES Quiz(ID)
);

CREATE TABLE Answer (
    ID VARCHAR(38) NOT NULL UNIQUE,
    id_question VARCHAR(38) NOT NULL,
    answer TEXT NOT NULL,
    is_correct INT NOT NULL,
    FOREIGN KEY (id_question)
    REFERENCES Question(ID)
);