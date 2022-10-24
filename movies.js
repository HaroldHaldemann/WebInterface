listAttributes = [
    'title',
    'genres',
    'date_published',
    'rated',
    'imdb_score',
    'directors',
    'actors',
    'duration',
    'countries',
    'worldwide_gross_income',
    'long_description',
]

function formatAttribute(attribute) {
    const formatedAttribute = attribute.replaceAll("_", " ");
    return formatedAttribute.toUpperCase();
}

async function getBestMovie() {
    const urlRequest = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
    const request = new Request(urlRequest);
    const response = await fetch(request);

    if (response.status == 200) {
        const data = await response.json();
        return data.results[0];
    };
};

async function getBestMovies(genre) {
    let urlRequest = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
    if (genre !== "best") {
        urlRequest += `&genre=${genre}`;
    };
    const request1 = new Request(urlRequest);
    const request2 = new Request(urlRequest + "&page=2");

    const response1 = await fetch(request1);
    const response2 = await fetch(request2);
    
    if (response1.status === 200 && response2.status === 200) {
        const data1 = await response1.json();
        const data2 = await response2.json();

        return data1.results.concat(data2.results);
    };
};

async function getMovieId(listMovies) {
    const listIdMovie = [];
    
    for (const movie of listMovies) {
        listIdMovie.push(movie.id);
    };

    return listIdMovie;
};

async function getMovieInfo(idMovie) {
    const request = new Request(`http://localhost:8000/api/v1/titles/${idMovie}`);

    const response = await fetch(request);

    if (response.status === 200) {
        const data = await response.json();
        return data;
    };
}


async function getMovieAttributeInfo(attribute, movie) {
    let response = "";

    if (typeof(attribute) !== 'string') {
        for (const element of movie[attribute]) {
            if (response == "") {
                response = `${element}`;
            } else {
                response += `, ${element}`;
            }
        };
    } else {
        response = movie[attribute];
    };
    return [response, formatAttribute(attribute)];
}

async function renderHtmlMoviesCarousel() {

    for (const genre of ['best', 'sci-fi', 'history', 'thriller']) {
        const listMovies = await getBestMovies(genre);

        let id = 1;
        if (genre === 'best') {
            id ++;
        }

        while (id < 9) {
            const idMovies = await getMovieId(listMovies);
            const movieInfo = await getMovieInfo(idMovies[id - 1]);

            // card container

            const card = document.querySelector(`#${genre}${id}`);

            const image = document.createElement("img");
            image.setAttribute("src", movieInfo.image_url);
            image.setAttribute("id", `img${genre}${id}`);

            const modal = document.createElement("div");
            modal.setAttribute("class", "modal");
            modal.setAttribute("id", `modal${genre}${id}`);

            card.appendChild(image);

            // modal content

            const detailsMovie = document.createElement("div");
            detailsMovie.setAttribute("class", "modal-content");

            const imageContainer = document.createElement("div");
            imageContainer.setAttribute("class", "img-container");
            const imageModal = document.createElement("img");
            imageModal.setAttribute("src", movieInfo.image_url);
            imageContainer.appendChild(imageModal);

            const detailsContainer = document.createElement("div");
            detailsContainer.setAttribute("class", "details-container");
            const listDetails = document.createElement("ul");
            listDetails.setAttribute("class", "list-details");

            for (const attribute of listAttributes) {
                let detail = await getMovieAttributeInfo(attribute, movieInfo)

                let detailNode = document.createElement("li");
                let detailContent = document.createTextNode(`${detail[1]}: ${detail[0]}`);

                detailNode.appendChild(detailContent);
                listDetails.appendChild(detailNode);
            };

            const close = document.createElement("span");
            close.setAttribute("class", "close");
            close.setAttribute("id", `close${genre}${id}`)
            const closeContent = document.createTextNode("X")
            close.appendChild(closeContent)

            detailsContainer.appendChild(listDetails);

            detailsMovie.appendChild(detailsContainer);
            detailsMovie.appendChild(imageContainer);
            detailsMovie.appendChild(close);

            modal.appendChild(detailsMovie);
            card.appendChild(modal);

            displayModal(genre, id);
            id++;
            if (id == 8 && genre !== 'best') {
                id++;
            };
        };
    };
};

async function renderHtmlMainContainer() {
    const movie = await getBestMovie();
    const movieId = await getMovieId([movie]);
    const movieInfo = await getMovieInfo(movieId[0]);

    const card = document.querySelector(`#imagebest1`);
    const image = document.createElement("img");
    image.setAttribute("src", movieInfo.image_url);
    image.setAttribute("id", "imgbest1")

    const modal = document.createElement("div");
    modal.setAttribute("class", "modal");
    modal.setAttribute("id", `modalbest1`);

    const detailsMovie = document.createElement("div");
    detailsMovie.setAttribute("class", "modal-content");

    const imageContainer = document.createElement("div");
    imageContainer.setAttribute("class", "img-container");
    const imageModal = document.createElement("img");
    imageModal.setAttribute("src", movieInfo.image_url);
    imageContainer.appendChild(imageModal);

    const detailsContainer = document.createElement("div");
    detailsContainer.setAttribute("class", "details-container");
    const listDetails = document.createElement("ul");
    listDetails.setAttribute("class", "list-details");

    for (const attribute of listAttributes) {
        let detail = await getMovieAttributeInfo(attribute, movieInfo)

        let detailNode = document.createElement("li");
        let detailContent = document.createTextNode(`${detail[1]}: ${detail[0]}`);

        detailNode.appendChild(detailContent);
        listDetails.appendChild(detailNode);
    };

    const close = document.createElement("span");
    close.setAttribute("class", "close");
    close.setAttribute("id", `closebest1`)
    const closeContent = document.createTextNode("X")
    close.appendChild(closeContent)

    detailsContainer.appendChild(listDetails);

    detailsMovie.appendChild(detailsContainer);
    detailsMovie.appendChild(imageContainer);
    detailsMovie.appendChild(close);

    modal.appendChild(detailsMovie);

    card.appendChild(modal);
    card.appendChild(image);

    const titleDiv = document.querySelector(`#titlebest1`);
    const title = document.createTextNode(movieInfo.title);
    titleDiv.appendChild(title);

    const synopsisDiv = document.querySelector(`#synopsisbest1`);
    const synopsis = document.createTextNode(movieInfo.description);
    synopsisDiv.appendChild(synopsis);

    displayModal('best', 1);
};

function displayModal(genre, id) {
    const modal = document.getElementById(`modal${genre}${id}`);
    const imgBtn = document.getElementById(`img${genre}${id}`);
    const span = document.getElementById(`close${genre}${id}`);

    listGenre = ['best', 'sci-fi', 'history', 'thriller'];
    const track = document.querySelector(`#track${listGenre.indexOf(genre) + 1}`);
    let transform = track.style.transform;

    imgBtn.addEventListener("click", () => {
        track.style.transition = "transform 0s";
        transform = track.style.transform;
        track.style.transform = "";
        modal.style.display = "block";
    });

    span.addEventListener("click", () => {
        modal.style.display = "none";
        track.style.transform = transform;
        setTimeout(() => {track.style.transition = "transform 0.5s"}, 100);
    });

    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
            track.style.transform = transform;
            setTimeout(() => {track.style.transition = "transform 0.5s"}, 100);
        };
    });
};

renderHtmlMainContainer();
renderHtmlMoviesCarousel();
