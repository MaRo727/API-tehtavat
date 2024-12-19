async function getAnimeByName(name = '', genre, status, ageRating, rating, limit = 6) {
    let url = `https://api.jikan.moe/v4/anime?limit=${limit}`; // Use the limit parameter
    if (name) url += `&q=${name}`;
    if (genre) url += `&type=${genre}`;
    if (status) url += `&status=${status}`;
    if (ageRating) url += `&rating=${ageRating}`;
    if (rating) url += `&score=${rating}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data.data; // Return all results from the search
    } catch (error) {
        console.error('Error fetching anime:', error);
    }
}

async function getAnimeRecommendations(animeId) {
    const url = `https://api.jikan.moe/v4/anime/${animeId}/recommendations`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data.data.slice(0, 4); // Return the first 4 recommendations
    } catch (error) {
        console.error('Error fetching recommendations:', error);
    }
}

document.getElementById('animeForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const animeName = document.getElementById('animeName').value;
    const genre = document.getElementById('genre').value;
    const status = document.getElementById('status').value;
    const ageRating = document.getElementById('ageRating').value;
    const rating = document.getElementById('rating').value;
    const animeData = await getAnimeByName(animeName, genre, status, ageRating, rating, 6); // Limit to 6 results for search
    displayAnimeData(animeData);
    console.log(animeData);
});

async function displayHighestRatedAnime() {
    const animeData = await getAnimeByName('', '', '', '', '', 8); // Limit to 8 results for highest-rated anime
    displayAnimeData(animeData);
}

function displayAnimeData(animeList) {
    const animeDataDiv = document.getElementById('animeData');
    animeDataDiv.innerHTML = ''; // Clear previous results

    animeList.forEach(anime => {
        const imageUrl = anime.images?.jpg?.image_url || 'images/default_image.jpg'; // Provide a valid default image URL

        // Extract English and Japanese titles
        const englishTitle = anime.titles.find(title => title.type === 'English')?.title || 'N/A';
        const japaneseTitle = anime.titles.find(title => title.type === 'Japanese')?.title || 'N/A';

        const animeDiv = document.createElement('div');
        animeDiv.classList.add('anime-item');
        animeDiv.innerHTML = `
            <h2>${anime.title}</h2>
            <p><strong>English Title:</strong> ${englishTitle}</p>
            <p><strong>Japanese Title:</strong> ${japaneseTitle}</p>
            <img src="${imageUrl}" alt="${anime.title}">
        `;
        animeDiv.addEventListener('click', () => showModal(anime));
        animeDataDiv.appendChild(animeDiv);
    });
}

async function showModal(anime) {
    const modal = document.getElementById('animeModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const imageUrl = anime.images?.jpg?.image_url || 'images/default_image.jpg'; // Provide a valid default image URL

    // Extract English and Japanese titles
    const englishTitle = anime.titles.find(title => title.type === 'English')?.title || 'N/A';
    const japaneseTitle = anime.titles.find(title => title.type === 'Japanese')?.title || 'N/A';

    modalTitle.textContent = anime.title;
    modalDescription.innerHTML = `
        <p><strong>English Title:</strong> ${englishTitle}</p>
        <p><strong>Japanese Title:</strong> ${japaneseTitle}</p>
        <p><strong>Synopsis:</strong> ${anime.synopsis}</p>
        <img src="${imageUrl}" alt="${anime.title}" style="max-width: 100%; height: auto; border-radius: 4px; margin-bottom: 10px;">
        <p><strong>Type:</strong> ${anime.type}</p>
        <p><strong>Episodes:</strong> ${anime.episodes}</p>
        <p><strong>Status:</strong> ${anime.status}</p>
        <p><strong>Aired:</strong> ${anime.aired.string}</p>
        <p><strong>Score:</strong> ${anime.score}</p>
        <h3>Recommendations:</h3>
        <div id="recommendations"></div>
    `;
    modal.style.display = 'block';

    const recommendations = await getAnimeRecommendations(anime.mal_id);
    displayRecommendations(recommendations);
}

function displayRecommendations(recommendations) {
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = ''; // Clear previous recommendations

    recommendations.forEach(rec => {
        const recDiv = document.createElement('div');
        recDiv.classList.add('recommendation-item');
        recDiv.innerHTML = `
            <div class="recommendation-content" data-id="${rec.entry.mal_id}">
                <p><strong>${rec.entry.title}</strong></p>
                <img src="${rec.entry.images.jpg.image_url}" alt="${rec.entry.title}" style="max-width: 100%; height: auto; border-radius: 4px; margin-bottom: 10px;">
            </div>
        `;
        recDiv.addEventListener('click', () => redirectToAnime(rec.entry.mal_id));
        recommendationsDiv.appendChild(recDiv);
    });
}

async function redirectToAnime(animeId) {
    const animeData = await getAnimeById(animeId);
    showModal(animeData);
}

async function getAnimeById(animeId) {
    const url = `https://api.jikan.moe/v4/anime/${animeId}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data.data;
    } catch (error) {
        console.error('Error fetching anime:', error);
    }
}

async function getRandomAnime() {
    const url = `https://api.jikan.moe/v4/random/anime`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        showModal(data.data);
    } catch (error) {
        console.error('Error fetching random anime:', error);
    }
}

document.getElementById('randomAnimeButton').addEventListener('click', getRandomAnime);

const modal = document.getElementById('animeModal');
const closeModal = document.getElementsByClassName('close')[0];

closeModal.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Fetch and display the highest-rated anime on page load
window.addEventListener('load', displayHighestRatedAnime);
