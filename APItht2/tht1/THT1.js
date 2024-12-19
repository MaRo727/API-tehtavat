async function getCatFacts() {
    const url = "https://catfact.ninja/fact";
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const funnyFact = await response.json();
      document.getElementById('FactOutput').innerHTML = funnyFact.fact;
      console.log(funnyFact.fact);         
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }
  
  async function getCatBreeds() {
    const url = "https://catfact.ninja/breeds";
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const breedsData = await response.json();

      const randomBreed = breedsData.data[Math.floor(Math.random() * breedsData.data.length)];
      document.getElementById('BreedOutput').innerHTML = randomBreed.breed;
      console.log(randomBreed.breed)         
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }