<h1 class="main__title">Create a quiz</h1>
    <section class="quiz">
        <form action="#" method="post" class="quiz__form" id="form-quiz">
            <label for="quizName" class="quiz__label">Quiz name</label>
            <input type="text" name="quizName" id="quizName" class="quiz__input" required />
            <label for="nbQuestions" class="quiz__label">Number of questions</label>
            <input type="number" name="nbQuestions" id="nbQuestions" class="quiz__input" min="1" value="1" required />
            <div class="questions__container" id="questions">

            </div>
            <button type="submit" class="quiz__button" id="btn-add-quiz">Create quiz</button>
        </form>
    </section>