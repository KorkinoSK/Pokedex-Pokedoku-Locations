<script setup>
import { RouterLink } from 'vue-router';
import { ref } from "vue";
const idOfNextPokemon = ref(1) 
const url = ref("https://pokeapi.co/api/v2/pokemon/")
const pokemons = ref([])
const data = localStorage.getItem('data')
console.log(url.value + idOfNextPokemon.value)
function getNewPokemons() {
    if (data != null) {
        if (data[idOfNextPokemon.value] != null) {
            getFromLocalStoragePokemon()
            idOfNextPokemon.value++
        }
    } 
    else {
        getFromApiPokemon()
        idOfNextPokemon.value++
        localStorage.setItem("data", pokemons.value)
    }
}
function getFromApiPokemon() {
    fetch(url.value + idOfNextPokemon.value)
    .then((res)=>(res.json()))
    .then((json) => {
    pokemons.value[idOfNextPokemon.value-1] = json.sprites.official-artwork.front_default
    console.log(pokemons.value[idOfNextPokemon.value])
    console.log("From API")
})


}
function getFromLocalStoragePokemon() {
    pokemons.value[idOfNextPokemon.value] = data[idOfNextPokemon.value];
    console.log(pokemons.value)
    console.log("From Local Storage")
    

}
function getFreshBatch() {
    for (let i = 0; i < 4; i++) {
        getNewPokemons()
    }
}
getFreshBatch()
console.log(pokemons.value)
</script>

<template>
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png">
  <p>Toto je pokedex</p>
</template>

<style scoped></style>