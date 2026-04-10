<script setup>
import { router } from './main';


</script>

<template>
  <h1>Pokédex a Pokedoku v jednom</h1>
  <nav>
    <RouterLink class="link" to="/">↪Naspäť na Pokedex</RouterLink>
    <RouterLink class="link" to="/pokedoku">↪Pokedoku</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
