<script setup>
import { router } from './main';


</script>

<template>
  <h1>Pokédex 2.0</h1>
  <nav>
    <RouterLink class="link" to="/">↪Naspäť na list↩</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
