document.getElementById('fetchButton').addEventListener('click', fetchWaifuImage);

function fetchWaifuImage() {
    const type = document.getElementById('toggleSwitch').checked ? 'nsfw' : 'sfw';
    const url = `https://api.waifu.pics/${type}/waifu`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('waifuImage').src = data.url;
        })
        .catch(error => console.error('Error fetching the image:', error));
}