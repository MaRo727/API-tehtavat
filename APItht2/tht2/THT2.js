document.addEventListener('DOMContentLoaded', async () => {
  await populateBreedDropdown(); // Populate dropdown when page loads
});

// Function to populate the breed dropdown
async function populateBreedDropdown() {
  const breedSelect = document.getElementById('breedSelect');
  const url = "https://dog.ceo/api/breeds/list/all";

  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Failed to fetch breeds: ${response.status}`);
      }
      const data = await response.json();
      const breeds = data.message;

      // Populate the dropdown with breed names
      for (const breed in breeds) {
          const option = document.createElement('option');
          option.value = breed;
          option.textContent = capitalizeFirstLetter(breed);
          breedSelect.appendChild(option);
      }
  } catch (error) {
      console.error(`Error: ${error.message}`);
  }
}

// Function to fetch and display image based on selected breed
async function getBreedImage() {
  const breedSelect = document.getElementById('breedSelect');
  const breed = breedSelect.value;
  if (!breed) return;  // Exit if no breed selected

  const url = `https://dog.ceo/api/breed/${breed}/images/random`;

  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
      }
      const data = await response.json();
      displayImage(data.message);
  } catch (error) {
      console.error(`Error: ${error.message}`);
  }
}

// Function to fetch and display a random dog image
async function getRandomDogImage() {
  const url = "https://dog.ceo/api/breeds/image/random";

  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Failed to fetch random image: ${response.status}`);
      }
      const data = await response.json();
      displayImage(data.message);
  } catch (error) {
      console.error(`Error: ${error.message}`);
  }
}

// Function to set image source and display it
function displayImage(imageUrl) {
  const dogImageElement = document.getElementById('dogImage');
  dogImageElement.src = imageUrl;
  dogImageElement.style.display = 'block';  // Show the image
}

// Utility function to capitalize the first letter of each word
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
