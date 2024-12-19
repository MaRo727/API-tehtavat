let stores = [];

fetch('https://www.cheapshark.com/api/1.0/stores')
  .then(response => response.json())
  .then(data => {
    stores = data;
  });

async function search() {
  const title = document.getElementById('searchBar');
  const titleValue = title.value;
  const url = `https://www.cheapshark.com/api/1.0/deals?title=${titleValue}`;
  const resultsOnSaleContainer = document.getElementById('results-on-sale');
  const resultsNotOnSaleContainer = document.getElementById('results-not-on-sale');

  // Clear previous results but keep the titles
  resultsOnSaleContainer.innerHTML = '<h2>Games on Sale</h2>';
  resultsNotOnSaleContainer.innerHTML = '<h2>Games Not On Sale</h2>';

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    data.forEach(game => {
      const gameElement = document.createElement('div');
      gameElement.className = 'game-box';

      gameElement.innerHTML = `
        <img src="${game.thumb}" alt="${game.title}" class="game-image">
        <p class="game-title"><strong>${game.title}</strong></p>
        <p class="popup-sale-price">Sale Price: $${game.salePrice}</p>
      `;

      if (game.isOnSale === 0 || game.salePrice === game.normalPrice) {
        resultsNotOnSaleContainer.appendChild(gameElement);
      } else {
        resultsOnSaleContainer.appendChild(gameElement);

        // Add event listener to open popup
        gameElement.addEventListener('click', () => {
          openPopup(game);
        });
      }
    });

    async function openPopup(game) {
      const store = stores.find(store => store.storeID === game.storeID);
      const storeName = store ? store.storeName : 'Unknown Store';
      const storeLogo = store ? `https://www.cheapshark.com${store.images.logo}` : '';

      // Fetch game details to get the lowest price ever
      const gameDetailsResponse = await fetch(`https://www.cheapshark.com/api/1.0/games?id=${game.gameID}`);
      const gameDetails = await gameDetailsResponse.json();
      const lowestPrice = gameDetails.cheapestPriceEver.price;

      const popup = document.createElement('div');
      popup.className = 'popup';

      popup.innerHTML = `
        <div class="popup-content">
          <span class="close-btn">&times;</span>
          <img src="${game.thumb}" alt="${game.title}" class="popup-image">
          <p class="popup-title"><strong>${game.title}</strong></p>
          <p class="popup-price">Normal Price: $${game.normalPrice}</p>
          <p class="popup-sale-price">Sale Price: $${game.salePrice}</p>
          <p class="popup-lowest-price">Lowest Price Ever: $${lowestPrice}</p>
          <p class="company-name">${storeName}</p>
          <img src="${storeLogo}" alt="Company Logo" class="company-logo">
        </div>
      `;

      document.body.appendChild(popup);

      // Close popup when clicking the close button
      popup.querySelector('.close-btn').addEventListener('click', () => {
        document.body.removeChild(popup);
      });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Add event listener to search button
document.getElementById('searchButton').addEventListener('click', search);
