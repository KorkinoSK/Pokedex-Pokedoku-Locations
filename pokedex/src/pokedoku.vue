<script setup>
import { ref } from "vue";
const pokedokuIsDone = ref(false)
const types = ref([])
const url = ref("https://pokeapi.co/api/v2/type")
const localStorageApi = localStorage.getItem('types')
function getTypes() {
    if (localStorageApi) {
        getTypesFromLocalStorage()
    } else {
        getTypesFromApi()
        localStorage.setItem('types',types)
    }
}
function generateNewPokedoku() {
    
}
function checkTheAnswer() {
    
}
function thisPokemonDoesNotExist() {
    
}
function thisPokemonIsNotCorrect() {
    
}
function thisPokemonIsCorrect() {
    
}
function attemptsOut() {
    
}
function youWon() {
    
}
function youLost() {
    
}
function getTypesFromApi() {
    fetch(url.value)
    .then((res)=>(res.json()))
    .then((json) => {
        types.value = json.results
        types.value.splice(18, 2)
        console.log(types.value)
        console.log("From API")
        }
    )
}
function getTypesFromLocalStorage() {
    types.value = localStorageApi
}
getTypes()
generateNewPokedoku()
</script>
<template>
    <p>Toto je pokedoku</p>
    <div id="board">
        <div class="columnOfText">
            <div>Type</div>
            <div>Type</div>
            <div>Type</div>
        </div>
        <div class="column">
            <div>Type</div>
            <div class="tile">A</div>
            <div class="tile">B</div>
            <div class="tile">C</div>
        </div>
        <div class="column">
            <div>Type</div>
            <div class="tile">D</div>
            <div class="tile">E</div>
            <div class="tile">F</div>
        </div>
        <div class="column">
            <div>Type</div>
            <div class="tile">G</div>
            <div class="tile">H</div>
            <div class="tile">I</div>
        </div> 
    </div>
    <button @click="generateNewPokedoku" v-if="pokedokuIsDone == true">Skús znova!</button>
</template>
<style scoped>
#board {
    display: flex;
}
.tile {
    border: 3px solid darkgray;
}
</style>