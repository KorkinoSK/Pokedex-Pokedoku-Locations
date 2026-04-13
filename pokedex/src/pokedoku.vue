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

const win = ref(false)

const pokemon = ref('')

const placeholder = ref("Skús napr. bulbasaur.")

const data = JSON.parse(localStorage.getItem('data'))

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
    win.value = false
    attemptsLeft.value = 9
    for (let i = 0; i < grid.value.length; i++) {
        grid.value[i] = 'unknown';
        
    }
    for (let i = 0; i < chosenTypes.value.length; i++) {
        chosenTypes.value[i] = randomlyChooseType()
        console.log(chosenTypes.value[i])
        checkTheType(i)
    }
    console.log(chosenTypes.value)
    checkIfThePokedokuIsPossible()
}

function checkTheType(i) {
    //Kontroluje, v akej polovici sa ten typ nachádza 
    if (i < chosenTypes.value.length/2) {
            for (let j = 0; j < chosenTypes.value.length/2; j++) {
                if (i != j) {
                    if (chosenTypes.value[i] == chosenTypes.value[j]) {
                        chosenTypes.value[i] = randomlyChooseType()
                        //checkTheType(i)
                        break
                    }
                }
            }
        } else {
            for (let j = chosenTypes.value.length/2; j < chosenTypes.value.length; j++) {
                if (i != j) {
                    if (chosenTypes.value[i] == chosenTypes.value[j]) {
                        chosenTypes.value[i] = randomlyChooseType()
                        //checkTheType(i)
                        break
                    }
                }
            }
        }
}

function randomlyChooseType() {
    return types.value[Math.floor(Math.random() * types.value.length)]
}

function checkTheAnswer(type1, type2, position) {
    fetch(pokemonUrl.value + pokemon.value.toLowerCase())
    .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
        }
    )
    .then(json => {
        if (json.types.length == 2) {
            let isTypeRelevant = 0
            json.types.forEach(type => {
                if (type.type.name == chosenTypes.value[type1].name) {
                    isTypeRelevant++
                }
                if (type.type.name == chosenTypes.value[type2].name) {
                    isTypeRelevant++
                }
            })
            if (isTypeRelevant < 2) {
                thisPokemonIsNotCorrect()
            } else {
                thisPokemonIsCorrect(json.id, position)
            }    
        } else {
            if (json.types[0].type.name == chosenTypes.value[type1].name && json.types[0].type.name == chosenTypes.value[type2].name){
                thisPokemonIsCorrect(json.id, position)
            } else {
                thisPokemonIsNotCorrect()
            }
        }
    }
    )
    .catch(error => {
        console.log(error)
        thisPokemonDoesNotExist()
        }
    )
}
function checkIfThePokedokuIsPossible() {
    for (let i = 0; i < 3; i++) {
        console.log(chosenTypes.value[i].name)
        for (let j = 3; j < 6; j++) {
            console.log(chosenTypes.value[j].name)
            for (let p = 0; p < 1025; p++) {
                if (data[p].types.length == 2) {
                    let isTypeRelevant = 0
                    data[p].types.forEach(type => {
                    
                    if (type.type.name == chosenTypes.value[i].name) {
                        isTypeRelevant++
                    }
                    
                    if (type.type.name == chosenTypes.value[j].name) {
                        isTypeRelevant++
                    }
                    })
                    if (isTypeRelevant > 2) {
                        break
                    }
                } else {
                    if (data[p].types[0].type.name == chosenTypes.value[i].name && data[p].types[0].type.name == chosenTypes.value[j].name){
                        break
                    }
                }
                if (p == 1024) {
                    generateNewPokedoku()
                }
            }
        }
    }
}
function thisPokemonDoesNotExist() {
    pokemon.value = ''
    placeholder.value = 'Tento pokémon neexistuje'
}
function thisPokemonIsNotCorrect() {
    pokemon.value = ''
    placeholder.value = 'Tento pokémon nepatrí sem!'
    attemptsLeft.value--
     if (attemptsLeft.value == 0) {
        attemptsOut()
    }
}
function thisPokemonIsCorrect(idOfPokemon, position) {
    const isPokemonAlreadyThere = ref(false)
    for (let i = 0; i < grid.value.length; i++) {
        if (grid.value[i] == idOfPokemon) { 
            placeholder.value = 'Tento pokémon už bol zadaný.'
            isPokemonAlreadyThere.value = true
            pokemon.value = ''
            break
        }
    }
    if (!isPokemonAlreadyThere.value) {
        grid.value[position] = idOfPokemon
    }
    attemptsLeft.value--
    if (attemptsLeft.value == 0) {
        attemptsOut()
    }
}
function attemptsOut() {
    pokedokuIsDone.value = true
    win.value = true
    for (let i = 0; i < grid.value.length; i++) {
        if (grid.value[i] == 'unknown' || grid.value[i] == 'searching') {
            win.value = false
        }
    }
}
function startSearching(index) {
    for (let i = 0; i < grid.value.length; i++) {
        if (grid.value[i] == 'searching') {
            grid.value[i] = 'unknown';
        }
    }
    placeholder.value = 'Skús napr. Bulbasaur.'
    grid.value[index] = 'searching'
    pokemon.value = ''
}
function stopSearching(index) {
    grid.value[index] = 'unknown'   
}
generateNewPokedoku()
</script>
<template>
<main>
    <p>Toto je pokedoku</p>
    <!--Celý board baby-->
    <div id="board">
        <div class="columnOfText">
            <div class="headline">TYPY</div>
            <div class="type">{{ chosenTypes[0].name }}</div>
            <div class="type">{{ chosenTypes[1].name }}</div>
            <div class="type">{{ chosenTypes[2].name }}</div>
        </div>
        <div class="column">
            <div class="type">{{ chosenTypes[3].name }}</div>
            <div class="tile">
                <img @click="startSearching(0)" v-if="grid[0] == 'unknown'" 
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fquestion_mark%2Fquestion_mark_PNG70.png&f=1&nofb=1&ipt=707fd30ce8f04457c290fe6a553bd687998a973f8add407247101e8b3299166e">
                <div class="searching" v-else-if="grid[0] == 'searching'">
                    <input type="text" v-model="pokemon" :placeholder="placeholder">
                    <button @click="checkTheAnswer(0, 3, 0)">Vyhľadaj</button>
                    <button @click="stopSearching(0)">Odskoč si</button>
                </div>
                <div v-else>
                    <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${grid[0]}.png`">
                </div>
            </div>
            <div class="tile">
                <img @click="startSearching(3)" v-if="grid[3] == 'unknown'" 
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fquestion_mark%2Fquestion_mark_PNG70.png&f=1&nofb=1&ipt=707fd30ce8f04457c290fe6a553bd687998a973f8add407247101e8b3299166e">
                <div class="searching" v-else-if="grid[3] == 'searching'">
                    <input type="text" v-model="pokemon" :placeholder="placeholder">
                    <button @click="checkTheAnswer(1, 3, 3)">Vyhľadaj</button>
                    <button @click="stopSearching(3)">Odskoč si</button>
                </div>
                <div v-else>
                    <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${grid[3]}.png`">
                </div>
            </div>
            <div class="tile">
                <img @click="startSearching(6)" v-if="grid[6] == 'unknown'" 
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fquestion_mark%2Fquestion_mark_PNG70.png&f=1&nofb=1&ipt=707fd30ce8f04457c290fe6a553bd687998a973f8add407247101e8b3299166e">
                <div class="searching" v-else-if="grid[6] == 'searching'">
                    <input type="text" v-model="pokemon" :placeholder="placeholder">
                    <button @click="checkTheAnswer(2, 3, 6)">Vyhľadaj</button>
                    <button @click="stopSearching(6)">Odskoč si</button>
                </div>
                <div v-else>
                    <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${grid[6]}.png`">
                </div>
            </div>
        </div>
        <div class="column">
            <div class="type">{{ chosenTypes[4].name }}</div>
            <div class="tile">
                <img @click="startSearching(1)" v-if="grid[1] == 'unknown'" 
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fquestion_mark%2Fquestion_mark_PNG70.png&f=1&nofb=1&ipt=707fd30ce8f04457c290fe6a553bd687998a973f8add407247101e8b3299166e">
                <div class="searching" v-else-if="grid[1] == 'searching'">
                    <input type="text" v-model="pokemon" :placeholder="placeholder">
                    <button @click="checkTheAnswer(0, 4, 1)">Vyhľadaj</button>
                    <button @click="stopSearching(1)">Odskoč si</button>
                </div>
                <div v-else>
                    <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${grid[1]}.png`">
                </div>
            </div>
            <div class="tile">
                <img @click="startSearching(4)" v-if="grid[4] == 'unknown'" 
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fquestion_mark%2Fquestion_mark_PNG70.png&f=1&nofb=1&ipt=707fd30ce8f04457c290fe6a553bd687998a973f8add407247101e8b3299166e">
                <div class="searching" v-else-if="grid[4] == 'searching'">
                    <input type="text" v-model="pokemon" :placeholder="placeholder">
                    <button @click="checkTheAnswer(1, 4, 4)">Vyhľadaj</button>
                    <button @click="stopSearching(4)">Odskoč si</button>
                </div>
                <div v-else>
                    <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${grid[4]}.png`">
                </div>
            </div>
            <div class="tile">
                <img @click="startSearching(7)" v-if="grid[7] == 'unknown'" 
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fquestion_mark%2Fquestion_mark_PNG70.png&f=1&nofb=1&ipt=707fd30ce8f04457c290fe6a553bd687998a973f8add407247101e8b3299166e">
                <div class="searching" v-else-if="grid[7] == 'searching'">
                    <input type="text" v-model="pokemon" :placeholder="placeholder">
                    <button @click="checkTheAnswer(2, 4, 7)">Vyhľadaj</button>
                    <button @click="stopSearching(7)">Odskoč si</button>
                </div>
                <div v-else>
                    <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${grid[7]}.png`">
                </div>
            </div>
        </div>
        <div class="column">
            <div class="type">{{ chosenTypes[5].name }}</div>
            <div class="tile">
                <img @click="startSearching(2)" v-if="grid[2] == 'unknown'" 
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fquestion_mark%2Fquestion_mark_PNG70.png&f=1&nofb=1&ipt=707fd30ce8f04457c290fe6a553bd687998a973f8add407247101e8b3299166e">
                <div class="searching" v-else-if="grid[2] == 'searching'">
                    <input type="text" v-model="pokemon" :placeholder="placeholder">
                    <button @click="checkTheAnswer(0 , 5, 2)">Vyhľadaj</button>
                    <button @click="stopSearching(2)">Odskoč si</button>
                </div>
                <div v-else>
                    <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${grid[2]}.png`">
                </div>
            </div>
            <div class="tile">
                <img @click="startSearching(5)" v-if="grid[5] == 'unknown'" 
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fquestion_mark%2Fquestion_mark_PNG70.png&f=1&nofb=1&ipt=707fd30ce8f04457c290fe6a553bd687998a973f8add407247101e8b3299166e">
                <div class="searching" v-else-if="grid[5] == 'searching'">
                    <input type="text" v-model="pokemon" :placeholder="placeholder">
                    <button @click="checkTheAnswer(1, 5, 5)">Vyhľadaj</button>
                    <button @click="stopSearching(5)">Odskoč si</button>
                </div>
                <div v-else>
                    <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${grid[5]}.png`">
                </div>
            </div>
            <div class="tile">
                <img @click="startSearching(8)" v-if="grid[8] == 'unknown'" 
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fquestion_mark%2Fquestion_mark_PNG70.png&f=1&nofb=1&ipt=707fd30ce8f04457c290fe6a553bd687998a973f8add407247101e8b3299166e">
                    <div class="searching" v-else-if="grid[8] == 'searching'">
                        <input type="text" v-model="pokemon" :placeholder="placeholder">
                        <button @click="checkTheAnswer(2, 5, 8)">Vyhľadaj</button>
                        <button @click="stopSearching(8)">Odskoč si</button>
                    </div>
                    <div v-else>
                        <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${grid[8]}.png`">
                    </div>
                </div>
        </div> 
    </div>
    <div class="results">
        <h3 class="attempts">{{ attemptsLeft }}/9 PP</h3>
        <h3 v-if="win == true" class="win_message">GRATULUJEM VYHRAL SI!!! SI PRAVÝ POKEMÓN MAJSTER.</h3><h3 class="lose_message" v-else-if="win == false && pokedokuIsDone == true">Womp womp.</h3><br>
        <button class="tryAgain" @click="generateNewPokedoku" v-if="pokedokuIsDone == true">Skús znova!</button>
    </div>
</main>
</template>
<style scoped>

main {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
#board {
    display: flex;
    justify-content: center;
    align-items: center;
}
.tile {
    border: 3px solid darkgray;
    height: 200px;
    width: 200px;
}
img {
    height: 200px;
    width: 200px;
}
.columnOfText {
    text-align: center;
}
.type {
    font-size: 40px;
    text-transform: uppercase;
}
.columnOfText div {
    margin-bottom: 160px;
    margin-top: 160px;
}
.columnOfText .headline {
    font-size: 30px;
    margin-bottom: 30px;
}
.results {
    text-align: center;
    font-size: 25px;
}
</style>