function createCarousel(id) {
    let prev = document.querySelector(`#p${id}`);
    let next = document.querySelector(`#n${id}`);
    let track = document.querySelector(`#t${id}`);
    let carouselWidth = document.querySelector('.carousel-container').offsetWidth;

    window.addEventListener('resize', () => {
    carouselWidth = document.querySelector('.carousel-container').offsetWidth;
    })

    let cardWidth = document.querySelector('.card-container').offsetWidth;
    let index = 0;

    next.addEventListener('click', () => {
        index++;
        prev.classList.add('show');
        track.style.transform = `translateX(-${index * cardWidth}px)`;
            
        if (track.offsetWidth - (index * cardWidth) < carouselWidth) {
            next.classList.add('hide');
        }
    })

    prev.addEventListener('click', () => {
        index--;
        next.classList.remove('hide');
        if (index === 0) {
            prev.classList.remove('show');
        }
        track.style.transform = `translateX(-${index * cardWidth}px)`;
    })
}

createCarousel(1)
createCarousel(2)
createCarousel(3)
createCarousel(4)