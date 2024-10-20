const API_KEY = 'cf099e1443bc9a2df637136e1cb405d8';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const seriesContainer = document.getElementById('series-container');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('serie-detail');
const closeModal = document.querySelector('.close');
const filterSelect = document.getElementById('filter'); // Selector del filtro

// **Obtener series populares al cargar la página**
async function getPopularSeries() {
  const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=es-ES&page=1`);
  const data = await response.json();
  displaySeries(data.results);
}

// **Mostrar series en la pantalla**
function displaySeries(series) {
  seriesContainer.innerHTML = '';
  series.forEach(serie => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${IMG_URL + serie.poster_path}" alt="${serie.name}">
      <h3>${serie.name}</h3>
    `;
    card.addEventListener('click', () => getSerieDetails(serie.id));
    seriesContainer.appendChild(card);
  });
}

// **Obtener detalles de una serie**
async function getSerieDetails(id) {
  const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=es-ES`);
  const data = await response.json();
  showModal(data);
}

// **Mostrar modal con los detalles de la serie**
function showModal(serie) {
  const genres = serie.genres.map(g => `
    <button class="category-button" onclick="getSeriesByCategory(${g.id})">${g.name}</button>
  `).join('');

  modalContent.innerHTML = `
    <h2>${serie.name}</h2>
    <p><strong>Sinopsis:</strong> ${serie.overview}</p>
    <p><strong>Puntuación:</strong> ${serie.vote_average}</p>
    <div id="category-buttons">${genres}</div>
    <img src="${IMG_URL + serie.poster_path}" alt="${serie.name}">
  `;

  modal.style.display = 'block';
}

// **Cerrar el modal**
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

// **Buscar series**
document.getElementById('search').addEventListener('input', async (e) => {
  const query = e.target.value;
  if (query) {
    const response = await fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${query}&language=es-ES`);
    const data = await response.json();
    displaySeries(data.results);
  } else {
    getPopularSeries(); // Vuelve a mostrar las series populares si no hay búsqueda
  }
});

// **Filtrar series por criterio seleccionado**
filterSelect.addEventListener('change', async () => {
  const filterValue = filterSelect.value;
  const response = await fetch(`${BASE_URL}/tv/${filterValue}?api_key=${API_KEY}&language=es-ES&page=1`);
  const data = await response.json();
  displaySeries(data.results);
});

// **Cargar series populares al inicio**
getPopularSeries();
