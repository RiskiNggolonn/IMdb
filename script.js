// ini adalah api key
const APIKEY = 'api_key=96c05c6f53c2f9b20b3e42af4887dc76';
// ini adalah home url 
const HOMEURL = `https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`;
// ini adalah url gambar 
const IMAGEURL = 'https://image.tmdb.org/t/p/w500';

// mengambil elemen dari indexedDB.html 
var container = document.getElementById('movie-container');
var search = document.getElementById('searchMovie');
var wrapperDiv = document.querySelector('.search-conten');
var resultsDiv = document.querySelector('.results');

// ini adalah tombol sebelumnya
var pBtn = document.getElementById('prev-page');
// ini adalah tombol berikutnya
var nBtn = document.getElementById('next-page');
// jumlah halaman 
let pageNumber = 1;

// memanggil fungsi untuk request api 
apiCall(HOMEURL);

// ini adalah fungsi untuk mendapatkan data api 
function apiCall(url) {
    const x = new XMLHttpRequest();
    x.open('get', url);
    x.send();
    x.onload = function () {
        container.innerHTML = "";
        var res = x.response;
        // respons ke data JSON 
        var conJson = JSON.parse(res);
        // array dari film 
        var moviesArray = conJson.results;
        // membuat kartu film di sini 
        moviesArray.forEach(movie => moviesElement(movie));
        addMovieToListButtonArray = document.getElementsByClassName('.add-movie-to-list');
    }
}

// membuat elemen halaman utama 
function moviesElement(movie) {
    var movieElement = document.createElement('div');
    movieElement.classList.add('movie-element');
    movieElement.innerHTML = `
        <div class="movie-poster">
            <a href="moviePage.html?id=${movie.id}"><img src= ${IMAGEURL + movie.poster_path} alt="Movie Poster"></a>
        </div>
        <div class="movie-title">${movie.title}</div>
        <div class="movie-element-tags">
            <div class="movie-rating">
            <i class="fas fa-star"></i> ${movie.vote_average} 
            </div>
            <div class="add-movie-to-list" id="${movie.id}" onclick="addMovie(${movie.id})">
                <i class="fas fa-plus"></i>
            </div>
        </div>
    `;
    container.appendChild(movieElement);
}

// array untuk menyimpan film favorit 
var favMovies = [];
var oldMovies = [];

// fungsi untuk menambahkan film ke daftar favorit 
function addMovie(btnId) {
    document.getElementById(btnId).innerHTML = '<i class="fas fa-check"></i>';
    // untuk menghindari film duplikat 
    if (!favMovies.includes(btnId.toString())) {
        favMovies.push(btnId.toString());
    }

    // mengambil array dari local storage  
    oldMovies = JSON.parse(localStorage.getItem('MovieArray'));
    if (oldMovies == null) {
        // jika kosong 
        localStorage.setItem('MovieArray', JSON.stringify(favMovies));
    } else {
        // jika tidak kosong 
        favMovies.forEach(item => {
            if (!oldMovies.includes(item)) {
                oldMovies.push(item);
            }
        })
        // menambahkan film ke local storage 
        localStorage.setItem('MovieArray', JSON.stringify(oldMovies));
    }
}

// ini adalah fungsi pencarian 
search.addEventListener('keyup', function () {
    // input karakter di kotak pencarian
    var input = search.value;
    // mendapatkan semua film yang terkait dengan input di opsi pencarian 
    var inputUrl = `https://api.themoviedb.org/3/search/movie?query=${input}&${APIKEY}`;
    if (input.length != 0) {
        apiCall(inputUrl);
    } else {
        window.location.reload();
    }
})

// menonaktifkan tombol prev ketika halaman adalah 1
pBtn.disabled = true;
function disablePBtn() {
    if (pageNumber == 1) pBtn.disabled = true;
    else pBtn.disabled = false;
}

// pergi ke halaman berikutnya 
nBtn.addEventListener('click', () => {
    pageNumber++;
    let tempURL = `https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate`;
    apiCall(tempURL);
    disablePBtn();
});

// pergi ke halaman sebelumnya 
pBtn.addEventListener('click', () => {
    if (pageNumber == 1) return;

    pageNumber--;
    let tempURL = `https://api.themoviedb.org/3/discover/movie?${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNumber}&with_watch_monetization_types=flatrate`;
    apiCall(tempURL);
    disablePBtn();
})
