<script setup>
import { ref, computed } from "vue";

const pokemons = ref([])

const data = localStorage.getItem('data')

const clicksOnPack = ref(0)

const textIsShown = ref(false)

const results = ref([])

const pity = ref(0)

const openedPack = ref(false)

const inventory = ref([])

const imgResults = ref([])

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

function openPack() {
    if (clicksOnPack.value < 3) {
        if (!textIsShown.value) {
            textIsShown.value = true
        }
        clicksOnPack.value++
    } else {
        for (let i = 0; i < 3; i++) {
            letsGoGambling(i)
            textIsShown.value = false
            clicksOnPack.value = 0
        }
    }
}

function letsGoGambling(i) {
    const randomNumber = Math.round(Math.random() * 4)
    if (randomNumber !== 3) {
        OhDangIt(i)
        pity.value++
    } else {
        iCanNotStopWinning(i)
    }
    openedPack.value = true
}

function OhDangIt(i) {
    results.value[i] = "Garbage"
    imgResults
}

function iCanNotStopWinning(i) {
    const idOfRandomPokemon = Math.round(Math.random() * pokemons.value.length)
    results.value[i] = pokemons.value[idOfRandomPokemon].map((pokemon) => {
            return {
                name: pokemon.name,
                id: pokemon.id
            }
    })
}

function returnToGambling() {
    openedPack.value = false
    results.value.forEach(result => {
        if (result != 'Garbage') {
            
        }
    });
    results.value = []
}

getAllPokemons()
</script>
<template>
<div v-if="!openedPack">
    <h1>GAMBA!!!</h1>
    <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftotalcards.net%2Fcdn%2Fshop%2Ffiles%2Fjourney-together-booster-pack-1.jpg%3Fv%3D1736500108&f=1&nofb=1&ipt=afb69c8e55cf1ebf1fcf8f60783aca0a66417b2efba5340622f0ffa1b8089e3a" alt="Balíček">
    <button @click="openPack">Otvoriť balíček</button>
    <p v-if="textIsShown">Kliknite na tlačidlo ešte {{ 4 - clicksOnPack }}, aby ste si zákupili pack za 19,99€</p>
</div>
<div v-else>
    <div v-for="result in results" class="result" :key="result" :class="result">
        <p class="result" >{{ result }}</p>
        <img v-if="result == 'Garbage'" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fphotos%2Fgarbage-can-full-picture-id483882112%3Fk%3D6%26m%3D483882112%26s%3D612x612%26w%3D0%26h%3DDxVMMZ61nsigIgI1ERnsHKCD9WCzRf77GnyfBiMynNU%3D&f=1&nofb=1&ipt=fd53c47b5baadf982823f054e94def7d0ceeedaf99c8271fb687f2e5da6c8725">
        <img v-else src='"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/"+  +".png"'>
    </div>
    <button @click="returnToGambling">Vrátiť sa na €€€GAMBU€€€</button>
</div>
</template>
<style scoped>
    .result {
        display: inline-block;   
    }
    .result p {
        margin-right: 20px;
    }
    .result .Garbage {
        border: 3px, solid, black;
        font-size: 50px;
    }
</style>