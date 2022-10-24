function createCarousel(id) {
    const prev = document.querySelector(`#prev${id}`);
    const next = document.querySelector(`#next${id}`);
    const track = document.querySelector(`#track${id}`);
    let carouselWidth = document.querySelector('.carousel-container').offsetWidth;

    window.addEventListener('resize', () => {
    carouselWidth = document.querySelector('.carousel-container').offsetWidth;
    })

    const cardWidth = document.querySelector('.card-container').offsetWidth;
    let index = 0;

    next.addEventListener('click', () => {
        index++;
        prev.classList.add('show');
        track.style.transform = `translateX(-${index * cardWidth}px)`;
            
        if (track.offsetWidth - (index * cardWidth) < carouselWidth) {
            next.classList.add('hide');
        }

    });

    prev.addEventListener('click', () => {
        index--;
        next.classList.remove('hide');
        if (index === 0) {
            prev.classList.remove('show');
        };
        track.style.transform = `translateX(-${index * cardWidth}px)`;
    })
}

createCarousel(1);
createCarousel(2);
createCarousel(3);
createCarousel(4);