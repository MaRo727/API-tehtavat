let currentPokemonId = 0;

const typeColors = {
  fire: 'red',
  water: 'blue',
  grass: 'green',
  electric: 'yellow',
  ice: 'lightblue',
  fighting: 'brown',
  poison: 'purple',
  ground: 'sandybrown',
  flying: 'skyblue',
  psychic: 'pink',
  bug: 'olive',
  rock: 'gray',
  ghost: 'indigo',
  dragon: 'orange',
  dark: 'black',
  steel: 'silver',
  fairy: 'magenta'
};

async function searchPokemon() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const url = `https://pokeapi.co/api/v2/pokemon/${query}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokémon: ${response.status}`);
    }
    const data = await response.json();
    currentPokemonId = data.id;
    displayPokemon(data);
    updateNavigationButtons();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    document.getElementById('pokemonName').innerText = "Failed to load Pokémon.";
    document.getElementById('pokemonStats').innerText = "";
  }
}

async function fetchPokemonById(id) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokémon: ${response.status}`);
    }
    const data = await response.json();
    displayPokemon(data);
    updateNavigationButtons();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    document.getElementById('pokemonName').innerText = "Failed to load Pokémon.";
    document.getElementById('pokemonStats').innerText = "";
  }
}

function previousPokemon() {
  if (currentPokemonId > 1) {
    currentPokemonId--;
    fetchPokemonById(currentPokemonId);
  }
}

function nextPokemon() {
  currentPokemonId++;
  fetchPokemonById(currentPokemonId);
}

async function updateNavigationButtons() {
  if (currentPokemonId > 1) {
    const prevPokemon = await fetchPokemonNameById(currentPokemonId - 1);
    document.querySelector('.left-button').innerText = `Previous: ${prevPokemon}`;
  } else {
    document.querySelector('.left-button').innerText = 'Previous';
  }

  const nextPokemon = await fetchPokemonNameById(currentPokemonId + 1);
  document.querySelector('.right-button').innerText = `Next: ${nextPokemon}`;
}

async function fetchPokemonNameById(id) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokémon: ${response.status}`);
    }
    const data = await response.json();
    return data.name;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return '';
  }
}

function displayPokemon(pokemon) {
  const types = pokemon.types.map(typeInfo => typeInfo.type.name).join(', ');
  const abilities = pokemon.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ');
  const primaryType = pokemon.types[0].type.name;
  const color = typeColors[primaryType] || 'black';

  document.getElementById('pokemonName').innerText = `Name: ${pokemon.name}`;
  document.getElementById('pokemonNumber').innerText = `Number: ${pokemon.id}`;
  document.getElementById('pokemonTypes').innerText = `Types: ${types}`;
  document.getElementById('pokemonWeight').innerText = `Weight: ${pokemon.weight}`;
  document.getElementById('pokemonHeight').innerText = `Height: ${pokemon.height}`;
  document.getElementById('pokemonAbilities').innerHTML = `Abilities: ${pokemon.abilities.map(abilityInfo => `<span class="ability" onclick="showAbilityDetails('${abilityInfo.ability.url}')">${abilityInfo.ability.name}</span>`).join(', ')}`;
  document.getElementById('pokemonImage').src = pokemon.sprites.front_default;
  document.getElementById('pokemonShinyImage').src = pokemon.sprites.front_shiny;

  document.getElementById('pokemonName').style.color = color;
  document.getElementById('pokemonNumber').style.color = color;
  document.getElementById('pokemonTypes').style.color = color;
  document.getElementById('pokemonWeight').style.color = color;
  document.getElementById('pokemonHeight').style.color = color;
  document.getElementById('pokemonAbilities').style.color = color;

  document.getElementById('playSoundButton').onclick = () => playPokemonSound(pokemon.id, pokemon.name);
}

async function playPokemonSound(id, name) {
  let url;
  if (name.toLowerCase() === 'vaporeon') {
    url = 'vaporeon.mp3';
  } else {
    url = `https://pokemoncries.com/cries/${id}.mp3`;
  }
  const audio = new Audio(url);
  audio.play();
}

async function showAbilityDetails(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ability details: ${response.status}`);
    }
    const data = await response.json();
    const effect = data.effect_entries.find(entry => entry.language.name === 'en').effect;
    const pokemonList = data.pokemon.map(p => p.pokemon.name).join(', ');

    const modalContent = `
      <h2>${data.name}</h2>
      <p><strong>Effect:</strong> ${effect}</p>
      <p><strong>Pokémon with this ability:</strong> ${pokemonList}</p>
      <button class="close" onclick="closeModal()">Close</button>
    `;

    const modal = document.getElementById('abilityModal');
    modal.innerHTML = modalContent;
    modal.style.display = 'block';
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

function closeModal() {
  document.getElementById('abilityModal').style.display = 'none';
}
