<script setup>
import { router } from './main';
import { RouterLink } from 'vue-router';
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'


const data = localStorage.getItem('data')

const pokemon = ref([])

const route = useRoute()

const idOfThisPokemon = computed(() => route.params.id)

getAllPokemons()

const idOfPreviousPokemon = ref(getPreviousId())

const idOfNextPokemon = ref(getNextId())
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
    pokemon.value = all[idOfThisPokemon.value - 1]
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
  const temp = JSON.parse(data)
  console.log(temp[idOfThisPokemon.value - 1])
  pokemon.value = temp[idOfThisPokemon.value - 1]
}

function getPreviousId() {
  if (idOfThisPokemon.value != 1) {
    return idOfThisPokemon.value--
  } else {
    return 1025
  }
}

function getNextId() {
  if (idOfThisPokemon.value != 1025) {
    
    return idOfThisPokemon.value++
  } else {
    return 1
  }
}
</script>

<template>
  <p>{{ pokemon.name }}</p>
  <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/`+pokemon.id+`.png`" alt="obrázok pokémona">
  <div v-for="ability in pokemon.abilities">
    <p>{{ ability.ability.name }}</p>
    <p>Je skrytá? {{ ability.is_hidden }}</p>
  </div>
  <div v-for="stat in pokemon.stats">
    <p>{{ stat.stat.name }}: {{ stat.base_stat }}</p>
  </div>
  <div v-for="type in pokemon.types">
          <p class="type" :key="type" :class="type.type.name">{{ type.type.name }}</p>
  </div>
  <RouterLink :to="{ name: 'pokemon', params: {idOfPreviousPokemon}}">Choď na predchádzajúceho pokémona</RouterLink>
  <RouterLink :to="{ name: 'pokemon', params: {idOfNextPokemon}}">Choď na ďalšieho pokémona</RouterLink>
</template>

<style scoped>
.type{
  display: inline-block;
}
</style>
