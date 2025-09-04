export default class Slider {
    /**
     * The current frame when the user land in the carrousel
     * @var {number}
     */
    currentFrame;

    /**
     * Collection of slider's frame
     * @var {HTMLCollection}
     */
    frameCollection;

    constructor(currentSlide, frameCollection) {
        this.currentFrame = currentSlide;
        this.frameCollection = frameCollection;
    }

    prev() {
        this.currentFrame--;
        if (this.currentFrame < 0) {
            this.currentFrame = this.frameCollection.length - 1;
        }
    }

    next() {
        this.currentFrame++;
        if (this.currentFrame >= this.frameCollection.length) {
            this.currentFrame = 0;
        }
    }

    navigateSlider(directionSlide) {
        for (let i = 0; i < this.frameCollection.length; i++) {
            this.frameCollection[i].classList.remove('active');
        }
        if (directionSlide == 'left') {
            this.prev();
        } else if (directionSlide == 'right') {
            this.next();
        }
        this.frameCollection[this.currentFrame].classList.add('active');
    }

    dotSlides() {
        const contentQuizDOM = document.getElementsByClassName('content__quiz')[0];
        const dotsContainerDOM = document.createElement('div');
        dotsContainerDOM.classList.add('container__slider-dots');
        contentQuizDOM.appendChild(dotsContainerDOM);
        
        for (let i = 0; i < this.frameCollection.length; i++) {
            let divDotDOM = document.createElement('div');
            divDotDOM.classList.add('dots-slider');
            dotsContainerDOM.appendChild(divDotDOM);
        }
    }
    
    dotsNavigation(dots) {        
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove('active');
        }
        dots[this.currentFrame].classList.add('active');
    } 
}