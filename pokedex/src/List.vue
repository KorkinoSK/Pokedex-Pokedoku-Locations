<script setup>
import { RouterLink } from 'vue-router';
import { ref } from "vue";


const url = ref("https://pokeapi.co/api/v2/pokemon/")

const urlType = ref("https://pokeapi.co/api/v2/type")

const types = ref([getTypes()])

const pokemons = ref([])

const data = localStorage.getItem('data')

const maxIdForPokemon = ref(12)

const searchbar = ref("")

const searchingPrompt = ref("")

const advancedSearch = ref(false)

const selectedTypes = ref([])

const searchedTypes = ref([])

const minWeight = ref()

const maxWeight = ref()

const minHeight = ref()

const maxHeight = ref()

const minWeightSearched = ref(0)

const maxWeightSearched = ref(10000)

const minHeightSearched = ref(0)

const maxHeightSearched = ref(10000)



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
    console.log(types.value[0])
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
function getTypes() {
    const localStorageApi = localStorage.getItem('types')
    if (localStorageApi) {
        console.log("From local storage")
       
        return JSON.parse(localStorageApi)
        
    }
    fetch(urlType.value)
    .then((res)=>(res.json()))
    .then((json) => {
        json.results.splice(18, 2)
        localStorage.setItem('types',JSON.stringify(json.results))
        return json.results
        }
    )
}
function resetSearch() {
  maxIdForPokemon.value = 12
  searchingPrompt.value = ""
  searchbar.value = ""
  minHeightSearched.value = 0
  maxHeightSearched.value = 10000
  minWeightSearched.value = 0
  maxWeightSearched.value = 10000
  minHeight.value = ""
  maxHeight.value = ""
  minWeight.value = ""
  maxWeight.value = ""
}
function toggleAdvancedSearch() {
  if (advancedSearch.value) {
    advancedSearch.value = false
  } else {
    advancedSearch.value = true
  }
}
function advancedSearching() {
  if (minHeight.value >= maxHeight.value || minWeight.value >= maxWeight.value || minHeight.value < 0 || maxHeight.value < 0 || minWeight.value < 0 || maxWeight.value < 0) {
    alert("Zlé nastavenia, skús znova po úprave! Filtre sa neuložili")
    return
  }
  if (minHeight.value) {
    minHeightSearched.value = minHeight.value
  } else {
    minHeightSearched.value = 0
  }
  if (maxHeight.value) {
    maxHeightSearched.value = maxHeight.value
  } else {
    maxHeightSearched.value = 10000
  }
  if (minWeight.value) {
    minWeightSearched.value = minWeight.value
  } else {
    minWeightSearched.value = 0
  }
  if (maxWeight.value) {
    maxWeightSearched.value = maxWeight.value
  } else {
    maxWeightSearched.value = 10000
  }
  maxIdForPokemon.value = 1025
}
getAllPokemons()
</script>

<template>
  <p>Toto je pokedex</p>
  <input type="text" v-model="searchbar" placeholder="Id má vyzerať takto: 1">
  
  <button @click="searchForPokemon">Hľadať podľa mena či ID</button>
  <button @click="resetSearch">Resetovať search</button>
  <button @click="toggleAdvancedSearch">Pokročilé hľadanie</button>
  <div v-if="advancedSearch">
    <div v-for="PokemonType in types[0]" class="advanced_search">
      <label class="type" :key="PokemonType" :class="PokemonType.name" :for="PokemonType.name">{{ PokemonType.name }}</label><input type="checkbox" :value="PokemonType.name" v-model.trim="selectedTypes">
    </div>
    <div class="advanced_search_weight">
      <input v-model.number="minWeight" name="weight" type="number"><p for="weight">< Pokémonová hmotnosť (v hektogramoch) <</p><input v-model.number="maxWeight" name="weight" type="number">
    </div>
    <div class="advanced_search_height">
      <input v-model.number="minHeight" name="height" type="number"><p for="height">< Pokémonová výška (v decimetroch) <</p><input v-model.number="maxHeight" name="height" type="number" >
    </div>
    <button @click="advancedSearching">Pokročilo hľadať</button>
  </div>
  <div v-if="pokemons" v-for="pokemon in pokemons" :key="pokemon">
    <div v-if="pokemon.id <= maxIdForPokemon &&minWeightSearched < pokemon.weight && pokemon.weight < maxWeightSearched&& minHeightSearched < pokemon.height && pokemon.height < maxHeightSearched && pokemon.name.includes(searchingPrompt) || pokemon.id == searchingPrompt">
      
        <img width="150px" height="150px" :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/`+pokemon.id+`.png`" alt="obrázok pokémona">
        <RouterLink :to="'/pokemon/' + pokemon.id"><p class="name">{{ pokemon.name }}</p></RouterLink>     
        <div v-for="type in pokemon.types">
          <p class="type" :key="type" :class="type.type.name">{{ type.type.name }}</p>
        </div>
      
    </div>
  </div>
  <button @click="getFreshBatch">Načítaj viac pokémonov</button>
</template>

<style scoped>
.type{
  display: inline-block;
}
.advanced_search .type {
  margin-bottom: 20px;
  display:inline; 
  width: 45px;
  align-items: bottom;
}
.advanced_search_weight, .advanced_search_height {
  display: flex;
}
.advanced_search_weight input, .advanced_search_height input {
  height: 25px;
  width: 40px;
}
.advanced_search_weight p, .advanced_search_height p {
  font-size: 15px;
}
</style>