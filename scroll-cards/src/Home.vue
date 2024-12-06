<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import Card from '@/Card.vue'

const cards: string[] = Array.from(Array(100), (_,x) => `Card ${x+1}`);
const visibleCards = ref<Set<number>>(new Set());
const cardRefs = ref<Map<number, HTMLElement>>(new Map());
const lastScrollTop = ref(0);
const isScrollingDown = ref(true);
const containerRef = ref<HTMLElement | null>(null);

let observer: IntersectionObserver | null = null;

const focusedCardId = computed(() => {
  if (visibleCards.value.size === 0) return -1;
  
  const visibleIds = Array.from(visibleCards.value).sort((a, b) => a - b);
  return isScrollingDown.value ? visibleIds[0] : visibleIds[visibleIds.length - 1];
});

const handleScroll = (event: Event) => {
  const container = event.target as HTMLElement;
  const scrollTop = container.scrollTop;
  
  isScrollingDown.value = scrollTop > lastScrollTop.value;
  lastScrollTop.value = scrollTop;
};

// https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/isIntersecting
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const id = Number((entry.target as HTMLElement).dataset.cardId);
        if (entry.isIntersecting) {
          visibleCards.value.add(id);
        } else {
          visibleCards.value.delete(id);
        }
        visibleCards.value = new Set(visibleCards.value);
      });
    },
    {
      threshold: 1.0, // control how much visibility is required
      rootMargin: '0px' // bounding box of root element
    }
  );

  // Observe all card text elements
  cardRefs.value.forEach((element) => {
    observer?.observe(element);
  });
});

onUnmounted(() => {
  observer?.disconnect();
});

const setCardRef = (el: HTMLElement | null, id: number) => {
  if (el) {
    cardRefs.value.set(id, el);
    observer?.observe(el);
  }
};
</script>

<template>
  <h1>Home</h1>
  <div 
    ref="containerRef"
    class="cards-container"
    @scroll="handleScroll"
  >
    <Card
      v-for="(card, id) in cards"
      :cardText="card"
      :key="id"
      :isInFocus="id === focusedCardId"
    >
      <p :ref="el => setCardRef(el as HTMLElement, id)" :data-card-id="id">
        {{ card + id }}
      </p>
    </Card>
  </div>
</template>

<style>
.cards-container {
  height: 80vh;
  overflow-y: auto;
  padding: 20px;
}
</style>