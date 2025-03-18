<?php include_once __DIR__ . '/partials/header.php'; ?>

<main class="main__container" id="main-container">
    <script type="module">
        import listernerLinks from '/app/js/helpers/listernerLinks.js';
        import Router from '/app/js/router/Router.js';
        const router = new Router();
        
        router.route('/',() => {
            document.getElementById('main-container').innerHTML = '<h1>Bienvenue sur mon app de quiz</h1>';
        });
        router.route('/createdQuiz', async () => {
            const response = await fetch('/app/views/quizForm.php');
            const content = await response.text();
            document.getElementById('main-container').innerHTML = content;
            // Charger le script pour gérer le formulaire de quiz
            loadScript('/app/js/scripts/handledFormQuiz.js');
        });
        router.route('/playedQuiz', async () => {
            const response = await fetch('/app/views/quizList.php');
            const content = await response.text();
            document.getElementById('main-container').innerHTML = content;
            // Charger le script pour afficher les quiz
            loadScript('/app/js/scripts/handledDisplayQuizes.js');
        });

        router.route('/quiz/:id', async (params) => {
            const response = await fetch(`/app/views/quiz.php?id=${params.id}`);
            const content = await response.text();
            document.getElementById('main-container').innerHTML = content;
            // Charger le script pour gérer le quiz
            loadScript('/app/js/scripts/handledQuiz.js');
        });

        router.route('*', () => {
            document.getElementById('main-container').innerHTML = `
            <h1>Page 404</h1>
            ` 
        });
        router.initialize();
        listernerLinks();
        window.router = router;

        // Fonction pour charger dynamiquement les scripts
        let currentScript = null;

        function loadScript(src) {
            if (currentScript) {
                try {
                    currentScript.remove();
                } catch (error) {
                    console.error('Error removing script:', error);
                } finally {
                    currentScript = null;
                }
            }

            const newScript = document.createElement('script');
            newScript.src = `${src}?${Date.now()}`;
            newScript.type = 'module';
            newScript.onload = () => {
                currentScript = newScript;
            };
            newScript.onerror = (error) => {
                console.error(`Erreur lors du chargement de ${src}:`, error);
                currentScript = null;
            };
            document.body.appendChild(newScript);
        }
    </script>
</main>

<?php include_once __DIR__ . '/partials/footer.php'; ?>