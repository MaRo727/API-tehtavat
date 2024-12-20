const url = "https://api.tcgdex.net/v2/en/cards";
import jorgosImage from './assets/jorgos.png';

document.addEventListener('DOMContentLoaded', () => {
    // napit sunmuut
    const openCard = document.getElementById('unboxButton');
    const saveJSON = document.getElementById('saveJSON');
    const cardInfo = document.getElementById('cardInfo');

    // array johon kaikki avatut kortit tallennetaan
    let cardList = JSON.parse(localStorage.getItem('cardList')) || [];
    console.log(cardList);

    // Hakee random kortin
    async function fetchRandomCardId() {
        try {
            const response = await fetch(url);
            const data = await response.json();
            const randomIndex = Math.floor(Math.random() * data.length);
            console.log(data[randomIndex].image);
            return data[randomIndex].id;
        } catch (error) {
            console.error('Error fetching card IDs:', error);
            throw error;
        }
    }
    
    // avaa kortin
    async function UnboxCard(cardList) {
        try {
            const random = await fetchRandomCardId();
            const card = await fetchCardData(random);
            cardList.push(random);
            console.log(cardList);
            localStorage.setItem('cardList', JSON.stringify(cardList));
            updateCardInfo(card, cardInfo);
            displayCardImages(cardList);
        } catch (error) {
            console.error('Error unboxing card:', error);
        }
    }

    // tyhjentää local storagen
    function deleteLocalStorageData() {
        localStorage.removeItem('cardList');
        cardList = [];
        console.log('Local storage data deleted');
        displayCardImages(cardList);
    }

    async function SaveCardToPokedex(cardList, cardInfoElement) {
        try {
            console.log(cardInfoElement);
            console.log(cardList);     
            localStorage.setItem('cardList', JSON.stringify(cardList));
            cardList = JSON.parse(localStorage.getItem('cardList'));
            console.log("File successfully created as 'saveFile.json'");
        } catch (error) {
            console.error('Error saving card to Pokedex:', error);
        }
    }

    // hakee kortin tiedot
    async function fetchCardData(cardId) {
        try {
            const response = await fetch(url + '/' + cardId);
            return await response.json();
        } catch (error) {
            console.error('Error fetching card data:', error);
            throw error;
        }
    }

    // hakee  ja näyttää kortin kuvan ja nimen kun unboksaat kortin
    function updateCardInfo(card, cardInfoElement) {
        if (!card || !cardInfoElement) {
            return;
        }
        if (!card.image) {
            return console.error('Card image not found:', card);
        }
        cardInfoElement.innerHTML = `
            <h2>${card.name}</h2>
            <img src="${card.image + "/low.png"}" alt="${card.name}">
        `;
    }

    // näkyy koko korttikokoelma
    function displayCardImages(cardList) {
        const cardContainer = document.getElementById('cardContainer');
        cardContainer.innerHTML = '';
        const uniqueCardList = [...new Set(cardList)];
        uniqueCardList.forEach(async cardId => {
            const card = await fetchCardData(cardId);
            const img = document.createElement('img');
            img.src = `${card.image}/low.png`;
            img.style.width = '100px';
            img.style.height = '150px';
            img.style.margin = '5px';
            img.addEventListener('click', () => {
                openBattlePopup(card);
            });
            cardContainer.appendChild(img);
        });
    }

    // avaa taistelun korttien välillä kun klikkaat korttia
    function openBattlePopup(card) {
        let jorgosHealth = 200;
        let playerCardHealth = card.hp;
        console.log(playerCardHealth);

        const modal = document.createElement('div');
        modal.classList.add('modal');
        
        modal.innerHTML = `
        <h2>Battle with ${card.name}</h2>
        <img src="${card.image}/low.png" alt="${card.name}">
        <p id="playerCardHealth">Your Card's Health: ${playerCardHealth}</p>
        <img src="${jorgosImage}" id="jorgosImage" alt="Jorgos">
        <p id="jorgosHealth">Jorgos' Health: ${jorgosHealth}</p>
        ${card.attacks.filter(attack => attack.damage).map(attack => `
            <button class="attack-button" data-attack-name="${attack.name}" data-attack-damage="${attack.damage}">
                ${attack.name} (${attack.damage} damage)
            </button>
        `).join('')}
        <button id="closeModal">Escape</button>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('closeModal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // hyökkäykset
        document.querySelectorAll('.attack-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const attackName = event.target.getAttribute('data-attack-name');
                const attackDamage = parseInt(event.target.getAttribute('data-attack-damage'), 10);
                console.log(`Attack: ${attackName}, Damage: ${attackDamage}`);
                
                // Pelaaja hyökkää
                jorgosHealth -= attackDamage;
                console.log(`Jorgos Health: ${jorgosHealth}`);
                document.getElementById('jorgosHealth').innerText = `Jorgos' Health: ${jorgosHealth}`;

                // Onko jorgos kuollut
                if (jorgosHealth <= 0) {
                    console.log("win");
                    showPopup("You Won");
                    document.body.removeChild(modal);
                    return;
                }
                
                // Jorgos hyökkää
                playerCardHealth -= 100;
                console.log(`Player Card Health: ${playerCardHealth}`);
                document.getElementById('playerCardHealth').innerText = `Your Card's Health: ${playerCardHealth}`;

                // Onko pelaaja kuollut
                if (playerCardHealth <= 0) {
                    console.log("lose");
                    showPopup("You Lost");
                    document.body.removeChild(modal);
                    return;
                }
            });
        });
    }

    // voitto / häviö ilmoitus taistuelun jälkeen
    function showPopup(message) {
        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.innerText = message;
        document.body.appendChild(popup);

        popup.style.display = 'block';

        setTimeout(() => {
            popup.style.display = 'none';
            document.body.removeChild(popup);
        }, 3000);
    }

    // eventlistenerit
    openCard.addEventListener('click', () => UnboxCard(cardList));
    saveJSON.addEventListener('click', () => SaveCardToPokedex(cardList));
    deleteData.addEventListener('click', deleteLocalStorageData);
    displayCardImages(cardList);
});