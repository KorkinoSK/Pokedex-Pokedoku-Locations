<script setup>
import { ref } from "vue";
const pokedokuIsDone = ref(false)
const url = ref("https://pokeapi.co/api/v2/type")
const pokemonUrl = ref("https://pokeapi.co/api/v2/pokemon-form/")
const types = ref(getTypes())
const chosenTypes = ref(["","","","","",""])
const attemptsLeft = ref(0)
const grid = ref(
    ['unknown', 'unknown', 'unknown',
    'unknown', 'unknown', 'unknown',
    'unknown', 'unknown', 'unknown']
)

const pokemon = ref('')
const placeholder = ref("Skús napr. bulbasaurus.")
function getTypes() {
    const localStorageApi = localStorage.getItem('types')
    if (localStorageApi) {
        console.log("From local storage")
        return JSON.parse(localStorageApi)
        
    }
    fetch(url.value)
    .then((res)=>(res.json()))
    .then((json) => {
        json.results.splice(18, 2)
        console.log(json.results)
        console.log("From API")
        localStorage.setItem('types',JSON.stringify(json.results))
        return json.results
        }
    )
}
function generateNewPokedoku() {
    pokedokuIsDone.value = false
    attemptsLeft.value = 9
    for (let i = 0; i < chosenTypes.value.length; i++) {
        chosenTypes.value[i] = types.value[Math.floor(Math.random() * types.value.length)];
    }
}
function checkTheAnswer() {
    try {
    fetch(pokemonUrl.value + pokemon.value.toLowerCase())
    .then((res)=>(res.json()))
    .then((json) => {
        console.log("WIP")
        }
    )
} catch(error) {
    thisPokemonDoesNotExist()
}
}
function thisPokemonDoesNotExist() {
    pokemon.value = ''
    placeholder = 'Tento pokémon neexistuje. Možno si ho zle napísal?'
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
function startSearching(index) {
    for (let i = 0; i < grid.value.length; i++) {
        if (grid.value[i] == 'searching') {
            grid.value[i] = 'unknown';
        }
    }
    grid.value[index] = 'searching'
    pokemon.value = ''
}
function stopSearching(index) {
    grid.value[index] = 'unknown'
    
}

generateNewPokedoku()
</script>
<template>
    <p>Toto je pokedoku</p>
    <div id="board">
        <div class="columnOfText">
            <div>TYPY</div>
            <div>{{ chosenTypes[0].name }}</div>
            <div>{{ chosenTypes[1].name }}</div>
            <div>{{ chosenTypes[2].name }}</div>
        </div>
        <div class="column">
            <div>{{ chosenTypes[3].name }}</div>
            <div class="tile">
                <img @click="startSearching(0)" v-if="grid[0] == 'unknown'" 
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fquestion_mark%2Fquestion_mark_PNG70.png&f=1&nofb=1&ipt=707fd30ce8f04457c290fe6a553bd687998a973f8add407247101e8b3299166e" width="100px" height="100px">
                <div class="searching" v-else-if="grid[0] == 'searching'">
                    <input type="text" v-model="pokemon" :placeholder="placeholder">
                    <button @click="checkTheAnswer(0, 3)">Vyhľadaj</button>
                    <button @click="stopSearching(0)">Odskoč si</button>
                </div>
            </div>
            <div class="tile">
                <img @click="startSearching(3)" v-if="grid[3] == 'unknown'" 
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fquestion_mark%2Fquestion_mark_PNG70.png&f=1&nofb=1&ipt=707fd30ce8f04457c290fe6a553bd687998a973f8add407247101e8b3299166e" width="100px" height="100px">
                <div class="searching" v-else-if="grid[3] == 'searching'">
                    <input type="text" v-model="pokemon" :placeholder="placeholder">
                    <button @click="checkTheAnswer(1,3)">Vyhľadaj</button>
                    <button @click="stopSearching(3)">Odskoč si</button>
                </div>
            </div>
            <div class="tile">
                <img @click="startSearching(6)" v-if="grid[6] == 'unknown'" 
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fquestion_mark%2Fquestion_mark_PNG70.png&f=1&nofb=1&ipt=707fd30ce8f04457c290fe6a553bd687998a973f8add407247101e8b3299166e" width="100px" height="100px">
                <div class="searching" v-else-if="grid[6] == 'searching'">
                    <input type="text" v-model="pokemon" :placeholder="placeholder">
                    <button @click="checkTheAnswer(2,3)">Vyhľadaj</button>
                    <button @click="stopSearching(6)">Odskoč si</button>
                </div>
            </div>
        </div>
        <div class="column">
            <div>{{ chosenTypes[4].name }}</div>
            <div class="tile">
                <img @click="startSearching(1)" v-if="grid[1] == 'unknown'" 
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fquestion_mark%2Fquestion_mark_PNG70.png&f=1&nofb=1&ipt=707fd30ce8f04457c290fe6a553bd687998a973f8add407247101e8b3299166e" width="100px" height="100px">
                <div class="searching" v-else-if="grid[1] == 'searching'">
                    <input type="text" v-model="pokemon" :placeholder="placeholder">
                    <button @click="checkTheAnswer(0,4)">Vyhľadaj</button>
                    <button @click="stopSearching(1)">Odskoč si</button>
                </div>
            </div>
            <div class="tile">
                <img @click="startSearching(4)" v-if="grid[4] == 'unknown'" 
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fquestion_mark%2Fquestion_mark_PNG70.png&f=1&nofb=1&ipt=707fd30ce8f04457c290fe6a553bd687998a973f8add407247101e8b3299166e" width="100px" height="100px">
                <div class="searching" v-else-if="grid[4] == 'searching'">
                    <input type="text" v-model="pokemon" :placeholder="placeholder">
                    <button @click="checkTheAnswer(1,4)">Vyhľadaj</button>
                    <button @click="stopSearching(4)">Odskoč si</button>
                </div>
            </div>
            <div class="tile">
                <img @click="startSearching(7)" v-if="grid[7] == 'unknown'" 
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fquestion_mark%2Fquestion_mark_PNG70.png&f=1&nofb=1&ipt=707fd30ce8f04457c290fe6a553bd687998a973f8add407247101e8b3299166e" width="100px" height="100px">
                <div class="searching" v-else-if="grid[7] == 'searching'">
                    <input type="text" v-model="pokemon" :placeholder="placeholder">
                    <button @click="checkTheAnswer(2,4)">Vyhľadaj</button>
                    <button @click="stopSearching(7)">Odskoč si</button>
                </div>
            </div>
        </div>
        <div class="column">
            <div>{{ chosenTypes[5].name }}</div>
            <div class="tile">
                <img @click="startSearching(2)" v-if="grid[2] == 'unknown'" 
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fquestion_mark%2Fquestion_mark_PNG70.png&f=1&nofb=1&ipt=707fd30ce8f04457c290fe6a553bd687998a973f8add407247101e8b3299166e" width="100px" height="100px">
                <div class="searching" v-else-if="grid[2] == 'searching'">
                    <input type="text" v-model="pokemon" :placeholder="placeholder">
                    <button @click="checkTheAnswer(0,5)">Vyhľadaj</button>
                    <button @click="stopSearching(2)">Odskoč si</button>
                </div>
            </div>
            <div class="tile">
                <img @click="startSearching(5)" v-if="grid[5] == 'unknown'" 
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fquestion_mark%2Fquestion_mark_PNG70.png&f=1&nofb=1&ipt=707fd30ce8f04457c290fe6a553bd687998a973f8add407247101e8b3299166e" width="100px" height="100px">
                <div class="searching" v-else-if="grid[5] == 'searching'">
                    <input type="text" v-model="pokemon" :placeholder="placeholder">
                    <button @click="checkTheAnswer(1,5)">Vyhľadaj</button>
                    <button @click="stopSearching(5)">Odskoč si</button>
                </div>
            </div>
            <div class="tile">
                <img @click="startSearching(8)" v-if="grid[8] == 'unknown'" 
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fquestion_mark%2Fquestion_mark_PNG70.png&f=1&nofb=1&ipt=707fd30ce8f04457c290fe6a553bd687998a973f8add407247101e8b3299166e" width="100px" height="100px">
                    <div class="searching" v-else-if="grid[8] == 'searching'">
                        <input type="text" v-model="pokemon" :placeholder="placeholder">
                        <button @click="checkTheAnswer(2,5)">Vyhľadaj</button>
                        <button @click="stopSearching(8)">Odskoč si</button>
                    </div>
                </div>
        </div> 
    </div>
    <h3>{{ attemptsLeft }}/9 PP</h3>
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