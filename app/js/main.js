import router from './router/Router.js';

function loadScript(src) {
    const existingScript = document.getElementById('dynamic-script');
    if (existingScript) {
        existingScript.remove();
    }

    if (src === 'home') {
        if (existingScript) {
            existingScript.remove();
        }
        return;
    }
    
    const script = document.createElement('script');
    script.id = 'dynamic-script';
    script.src = `./js/scripts/${src}.js?v=${Date.now()}`;
    script.type = 'module';
    script.onload = () => {
        console.log(`${src} script loaded successfully.`);
    };
    script.onerror = () => {
        console.error(`Error loading script: ${src}`);
    };
    document.body.appendChild(script);
}

async function loadPage(pageName) {
    try {
        const mainElem = document.querySelector('main');

        const data = await fetch(`./pages/${pageName}.html`);
        if (!data.ok) {
            throw new Error(`Page ${pageName} not found`);
        }
        const content = await data.text();
        if (mainElem) {
            mainElem.innerHTML = content;
        } else {
            console.error('No <main> element found in the DOM.');
        }
    } catch (error) {
        console.error('Error loading page:', error);
        const mainElem = document.querySelector('main');
        if (mainElem) {
            mainElem.innerHTML = `
                <div class="error">
                    <h2>Erreur de chargement</h2>
                    <p>Impossible de charger la page "${pageName}".</p>
                </div>
            `;
            mainElem.dataset.page = '';
        }
    }
}

router
    .addRoute('/', async () => {
        await loadPage('home');
        loadScript('home');
    })
    .addRoute('/addQuiz', async () => {
        await loadPage('addQuiz');
        loadScript('addQuiz');
    })
    .addRoute('/allQuiz', async () => {
        await loadPage('allQuiz');
        loadScript('allQuiz');
    })
    .addRoute('/quiz/:id', async () => {
        await loadPage('quiz');
        loadScript('quiz');
        
    })
    .addNotFound(async () => {
        await loadPage('404');
    })
    .start();

const currentYearElem = document.getElementById('current-year');
if (currentYearElem) {
    currentYearElem.textContent = new Date().getFullYear();
}
