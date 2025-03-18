export default function listenerLinks() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const path = event.target.getAttribute('href');
            window.router.navigateTo(path);
        });
    });
}