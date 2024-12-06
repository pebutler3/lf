<script setup lang="ts">
import { computed, ref } from 'vue'
import Home from '@/Home.vue'
import Products from '@/Products.vue'

// The routing is very basic from Vue documentation and not comprehensive.
const routes: Record<string, typeof Home | typeof Products> = {
  '/': Home,
  '/products': Products
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  // Default to Home (i.e. arbitrary path)
  return routes[currentPath.value.slice(1) || '/'] || Home
})

// Add code to this file to complete the task
</script>

<template>
  <ul>
    <li>
      <a href="#/">Home</a>
      <a href="#/products">Products</a>
    </li>
  </ul>
  <component :is="currentView" />
</template>

<style scoped>
</style>
