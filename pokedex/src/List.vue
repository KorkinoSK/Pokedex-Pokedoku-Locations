<script setup>
import { RouterLink } from 'vue-router';
import { ref } from "vue";


const url = ref("https://pokeapi.co/api/v2/pokemon/")

const pokemons = ref([])

const data = localStorage.getItem('data')

const maxIdForPokemon = ref(12)

const searchbar = ref("")

const searchingPrompt = ref("")
async function getAllPokemons() {
  if (!data) {
    let all = await fetchAllPokemons()
    all.forEach(pokemon => {
      delete pokemon["moves"]
      delete pokemon["cries"]
      delete pokemon["sprites"]
      delete pokemon["game_indices"]
      delete pokemon["species"]
    });
    pokemons.value = all
    localStorage.setItem('data', JSON.stringify(all))
  } else {
    takeOutAllPokemons()
  }
}

async function fetchAllPokemons() {
  const promises = []
  for (let i = 1; i <= 1025; i++) {
    promises.push(fetch(url.value + i).then(res => res.json()))
  }
  return Promise.all(promises)
}

function takeOutAllPokemons() {
  pokemons.value = JSON.parse(data)
}

function getFreshBatch() {
    maxIdForPokemon.value += 4
}

function searchForPokemon() {
  maxIdForPokemon.value = 1025
  searchingPrompt.value = searchbar.value
}
getAllPokemons()
</script>

<template>
  <p>Toto je pokedex</p>
  <input type="text" v-model="searchbar" placeholder="Id má vyzerať takto: 1">
  <button @click="searchForPokemon">Hľadať podľa mena či ID</button>
  <div v-if="pokemons" v-for="pokemon in pokemons" :key="pokemon" >
    <div v-if="pokemon.id <= maxIdForPokemon && pokemon.name.includes(searchingPrompt) || pokemon.id == searchingPrompt">
      <img width="150px" height="150px" :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/`+pokemon.id+`.png`" alt="obrázok pokémona">
      <p class="name">{{ pokemon.name }}</p>
      <div v-for="type in pokemon.types">
        <p class="type" :key="type" :class="type.type.name">{{ type.type.name }}</p>
      </div>
      <RouterLink :to="'/pokemon/' + pokemon.id">Prejdi na detaily.</RouterLink>      
    </div>
  </div>
  <button @click="getFreshBatch">Načítaj viac pokémonov</button>
</template>

<style scoped></style>