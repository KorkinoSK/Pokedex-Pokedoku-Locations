<script setup>
import { RouterLink } from 'vue-router';
import { ref } from "vue";


const url = ref("https://pokeapi.co/api/v2/pokemon/")

const pokemons = ref([])

const data = localStorage.getItem('data')

const maxIdForPokemon = ref(12)

async function getAllPokemons() {
  if (!data) {
    const all = await fetchAllPokemons()
    pokemons.value = all
    localStorage.setItem('data', JSON.stringify(all))
  } else {
    takeOutAllPokemons()
  }
}

async function fetchAllPokemons() {
  const promises = []
  for (let i = 1; i <= 20; i++) {
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
getAllPokemons()
</script>

<template>
  <p>Toto je pokedex</p>
  <div v-for="pokemon in pokemons" :key="pokemon" >
  <p  v-if="pokemon.id <= maxIdForPokemon">{{ pokemon.name }}</p>
  </div>
  <button @click="getFreshBatch">Načítaj viac pokémonov</button>
</template>

<style scoped></style>