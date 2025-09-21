# Quizen - Une application web de quiz simple avec du Frontend pure (HTML, CSS et JS) et du Backend pure (PHP)

## Sommaire

- [Description](#description)
- [Fonctionnalités](#fonctionnalités)
- [Architecture technique](#architecture-technique)
  - [Front‑end](#front-end)
  - [Back‑end](#back-end)
- [Installation & configuration](#installation--configuration)
  - [Prérequis](#prérequis)
  - [Cloner le dépôt](#cloner-le-dépôt)
  - [Configurer la base de données](#configurer-la-base-de-données)
- [Utilisation](#utilisation)
  - [Lancer l’application](#lancer-lapplication)
  - [CRUD des quiz](#crud-des-quiz)
- [Plan futur](#plan-futur)
- [Contribution](#contribution)
- [Licence](#licence)

## Description

**Quizen** est une application web simple conçue pour la révision et l'apprentissage à travers la création et la gestion de quiz. Elle permet aux utilisateurs de créer, lire, modifier et supprimer des quiz (opérations CRUD) de manière dynamique, offrant une plateforme interactive pour tester ses connaissances.

## Fonctionnalités

* **Gestion des quiz (CRUD)**

  * **Créer** : Les utilisateurs peuvent concevoir de nouveaux quiz en définissant leur titre, leur description, ainsi que les questions et leurs réponses (y compris la bonne réponse).

  * **Lire** : L'application permet de consulter l'ensemble des quiz disponibles ou de visualiser les détails d'un quiz spécifique pour pouvoir y répondre.

  * **Modifier** : Les quiz existants peuvent être mis à jour, ce qui inclut le changement du titre, de la description, ou la modification des questions et des réponses.

  * **Supprimer** : Un utilisateur a la possibilité d'effacer définitivement un quiz de la base de données.

* **Gestion des routes**
  * **Navigation côté client** : L'application utilise un routeur JavaScript pour gérer la navigation sans recharger la page, offrant une expérience utilisateur fluide et dynamique.

  * **Routing côté serveur** : Un routeur PHP gère les requêtes API et les dirige vers les contrôleurs appropriés pour exécuter les opérations CRUD.

## Architecture technique

### Front-end

```bash
app/
|-css/
|   |_style.css # Styles globaux
|-js
|   |_ajax/
|   |    |_allQuiz.js # Gère la requête AJAX pour récupérer tous les quiz.
|   |    |_newQuiz.js # Gère la requête AJAX pour la création d'un quiz.
|   |    |_quiz.js # Gère la requête AJAX pour récupérer un quiz spécifique.
|   |_components/
|   |    |_popUp.js # Fonction utilitaire pour afficher des messages pop-up.
|   |_helpers/
|   |   |_decodeEntitiesHTML.js # Fonction pour décoder les entités HTML dans une chaîne de caractères.
|   |   |_slider.js # Classe pour gérer un composant de type slider.
|   |_objects/
|   |   |_DivContainer.js # Classe pour la création d'éléments DIV réutilisables.
|   |   |_InputField.js # Classe pour la création d'éléments INPUT de type texte réutilisables.
|   |   |_InputSelect.js # Classe pour la création d'éléments INPUT de type sélection réutilisables.
|   |   |_Label.js # Classe pour la création d'éléments LABEL réutilisables.
|   |   |_RadioButton.js # Classe pour la création d'éléments INPUT de type bouton à cocher réutilisables.
|   |_router/
|   |   |_Router.js # Classe qui gère le routage côté client en fonction de l'URL.
|   |_scripts/
|   |   |_addQuiz.js # Script qui gère la logique de la page d'ajout de quiz.
|   |   |_allQuiz.js # Script qui gère l'affichage de tous les quiz.
|   |   |_quiz.js # Script qui gère l'affichage et l'interaction avec un seul quiz.
|   |   |_resultQuiz.js # Script qui gère l'affichage du score après un quiz.
|_main.js # **Point d'entrée** de l'application front-end. Il initialise le routeur et charge dynamiquement le script et le modèle de page corrects en fonction de la route.
|-pages/
|   |_404.html # Page d'affichage en cas de route non trouvée.
|   |_addQuiz.html # Modèle HTML pour la page d'ajout d'un quiz.
|   |_allQuiz.html # Modèle HTML pour la page affichant tous les quiz.
|   |_home.html # Modèle HTML de la page d'accueil.
|   |_quiz.html # Modèle HTML pour la page d'un quiz.
|_index.html # Fichier principal qui charge le JavaScript et sert de conteneur pour toutes les pages dynamiques.
```

### Back-end

```bash
api/
|_controller/
|   |_quizController.php # Classe qui contient les méthodes pour les opérations CRUD sur les quiz.
|_router/
|   |_Route.php # Classe qui représente et gère une seule route.
|   |_Router.php # Classe qui gère la coordination et l'exécution des routes.
|_db_config.php # Fichier de configuration pour la connexion à la base de données.
|_index.php # Point d'entrée de l'API. C'est ici que les routes sont définies et associées à leurs contrôleurs.
```

## Installation et configuration

### Prérequis

| Outils | Version   |
| ------ | --------- |
| Apache | ^2.4.62.1 |
| PHP    | ^8.3.14   |
| MySQL  | ^9.1.0    |

### Cloner le dépôt

1. Clonez le repo le dans le dossier `www/` (ou équivalent) de votre serveur local (WAMP/XAMP/MAMP).

```bash
git clone git@github.com:developor45ju/quiz-app.git
cd ./quiz-app
```

2. Pour l'instant, pas de dépendances à installer.
3. Lancer votre serveur `Apache` via le panneau de contrôle ou lancer la commande suivante `php -S localhost:8800 -t public/`

### Configurez la base de données

1. Connectez-vous à votre à votre système de gestion de base de données (SGBD) MySQL.
2. Créez une nouvelle base de données.
3. Séléctionnez la base de données que vous venez de créer.
4. Exécutez le script SQL suivant pour créer les tables nécessaires:

```sql
CREATE TABLE Quiz (
    ID CHAR(32) NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    content_desc TEXT NOT NULL,
    nb_question INT NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    category ENUM('French', 'Math', 'English', 'Web development') NOT NULL,
    created_at DATE NOT NULL
);

CREATE TABLE Question (
    ID CHAR(32) NOT NULL PRIMARY KEY,
    question_text TEXT NOT NULL,
    quiz_id CHAR(32) NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES Quiz(ID)
);

CREATE TABLE Answer (
    ID CHAR(32) NOT NULL PRIMARY KEY,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    question_id CHAR(32) NOT NULL,
    FOREIGN KEY (question_id) REFERENCES Question(ID)
);
```

4. Modifiez le fichier `.env.dist` en remplaçant les valeurs par les vôtres, puis rennommez-le en `.env`.
valeurs

| Paramètre         | Description       | Exemple                                             |
| ----------------- | ----------------- | --------------------------------------------------- |
| DATABASE_DSN      | Chaîne DSN PDO    | mysql:host=localhost;dbname=quizapp;charset=utf8mb4 |
| DATABASE_USERNAME | Nom d'utilisateur | root                                                |
| DATABASE_PASSWORD | Mot de passe      | root                                                |

## Utilisation

### Lancer l'application

1. Assurez-vous que votre serveur Apache est en cours d'exécution.
2. Ouvrez votre navigateur et accédez à l'URL suivante : [http://127.0.0.1/quizen](http://127.0.0.1/quizen)

### CRUD des quiz

| Méthode | Url                    | Description                             |
| ------- | ---------------------- | --------------------------------------- |
| POST    | `/api/postQuiz`        | Permet de créer un quiz                 |
| GET     | `/api/getAllQuiz`      | Permet de récupérer tous les quiz créés |
| GET     | `/api/getQuiz/{id}`    | Permet de récupérer un seul quiz par son ID       |
| PUT     | `/api/updateQuiz/{id}` | Permet de modifier un quiz existant              |
| DELETE  | `/api/deleteQuiz/{id}` | Permet de supprimer un quiz             |

## Plan future

| Fonctionnalités            | Description                            |
| -------------------------- | -------------------------------------- |
| Système d'authentification | Permet à l'utilisateur de se connecter |
