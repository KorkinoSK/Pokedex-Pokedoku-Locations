<script setup>
import { router } from './main';


</script>

<template>
  <h1>Pokédex a Pokedoku v jednom</h1>
  <nav>
    <RouterLink class="link" to="/">↪Pokedex</RouterLink><br>
    <RouterLink class="link" to="/pokedoku">↪Pokedoku</RouterLink><br>
    <RouterLink class="link" to="/pack">↪Gamba</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style>
.type {
  padding: 4px 10px;
  border-radius: 12px;
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1;
  text-transform: capitalize;
  box-shadow: 0 1px 0 rgba(0,0,0,0.15) inset;
}

/* Type colors */
.normal  { background:#A8A77A; color:#222; }
.fire    { background:#EE8130; }
.water   { background:#6390F0; }
.grass   { background:#7AC74C; color:#222; }
.electric{ background:#F7D02C; color:#222; }
.ice     { background:#96D9D6; color:#222; }
.fighting{ background:#C22E28; }
.poison  { background:#A33EA1; }
.ground  { background:#E2BF65; color:#222; }
.flying  { background:#A98FF3; color:#222; }
.psychic { background:#F95587; }
.bug     { background:#A6B91A; color:#222; }
.rock    { background:#B6A136; color:#222; }
.ghost   { background:#735797; }
.dragon  { background:#6F35FC; }
.dark    { background:#705746; }
.steel   { background:#B7B7CE; color:#222; }
.fairy   { background:#D685AD; color:#222; }

.name {
  font-size: large;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  text-transform: uppercase;
}
</style>
