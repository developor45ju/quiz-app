import { DivContainer } from "../objects/DivContainer.js";

/**
 * Create a notification after an action by user
 *
 * @return void
 */

export function popUp() {
    const popup = new DivContainer('popup__container', 'popup').createDivContainer();
    document.body.appendChild(popup);
    popup.innerHTML = `<p class="popup__message">Ton quiz a bien été créer !!!</p>`;
    popup.background = '#5bc62a';
    setTimeout(() => popup.remove(), 2000);
}