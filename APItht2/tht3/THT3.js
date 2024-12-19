async function getRandomQuote() {
  const url = "https://programming-quotesapi.vercel.app/api/random";  

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch random quote: ${response.status}`);
    }
    const data = await response.json();
    
    displayQuote(data.quote, data.author);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    document.getElementById('quoteOutput').innerText = "Failed to load quote.";
    document.getElementById('authorOutput').innerText = "";
  }
}

function displayQuote(quote, author) {
  const quoteElement = document.getElementById('quoteOutput');
  const authorElement = document.getElementById('authorOutput');

  quoteElement.innerText = `"${quote}"`;
  authorElement.innerText = `— ${author}`;
}
