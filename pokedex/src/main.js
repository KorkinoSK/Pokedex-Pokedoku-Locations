import { createApp } from 'vue'
import App from './App.vue'
import List from './List.vue'
import Pokemon from './Pokemon.vue'
import Pokedoku from "./pokedoku.vue";
import { createMemoryHistory, createRouter} from "vue-router";
import Pack from './pack.vue'
import path from 'node:path';

// https://router.vuejs.org/guide/

const routes = [
    { path: '/', component: List },
    { path: '/pokemon/:id', component: Pokemon },
    { path: '/pokedoku', component: Pokedoku},
    { path:'/pack', component: Pack}
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

createApp(App).use(router).mount('#app')

