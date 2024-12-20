// const cardContainer = document.getElementById('cardContainer');

// export function updateCardInfo(card, cardInfoElement) {
//     if (!card || !cardInfoElement) {
//         return;
//     }
//     if (!card.image) {
//         return console.error('Card image not found:', card);
//     }
//     cardInfoElement.innerHTML = `
//         <h2>${card.name}</h2>
//         <img src="${card.image + "/low.png"}" alt="${card.name}">
//     `;
// }


// export function displayCardImages(cardList) {
//         cardContainer.innerHTML = ''; // Clear the container
//         cardList.forEach(cardId => {
//             const img = document.createElement('img');
//             img.src = `path/to/card/images/${cardId}/low.jpg`; // Update with the correct path to your card images
//             img.style.width = '100px';
//             img.style.height = '100px';
//             img.style.margin = '5px';
//             cardContainer.appendChild(img);
//         });
//     }