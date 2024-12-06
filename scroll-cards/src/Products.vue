<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Product } from '@/types';
import { getProducts } from '@/utils/get';

const state = ref({
  products: [] as Product[],
  categoryCounts: {} as Record<string, number>,
  topCategory: ''
})

getProducts(state).then((products) => {
  products.forEach((product: Product) => {
    product.categories.forEach((category: string) => updateCategoryCounts(category));
  });

  const sortedCategories = Object.entries(state.value.categoryCounts).sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
  state.value.topCategory = sortedCategories[0][0];
})

// Update category count or create new entry
const updateCategoryCounts = (category: string) => {
  state.value.categoryCounts[category] = (state.value.categoryCounts[category] || 0) + 1;
}

const productsOnSale = computed(() => {
  return state.value.products.filter((product: Product) => product.on_sale);
})

const averagePriceForProductsOnSale = computed(() => {
  // Slice to remove the dollar sign
  const total = productsOnSale.value.reduce((total: number, product: Product) => total + Number(product.price.slice(1)), 0);
  return total / productsOnSale.value.length;
})

const womensProducts = computed(() => state.value.products.filter((product: Product) => product.gender === 'female'))
const womensProductsOutOfStock = computed(() => womensProducts.value.filter((product: Product) => !product.in_stock))
const womensProductsOutOfStockByColor = computed(() => {
  return womensProductsOutOfStock.value.reduce((acc: Record<string, number>, product: Product) => {
    acc[product.color] = (acc[product.color] || 0) + 1;
    return acc;
  }, {})
})

const productsOutOfStock = computed(() => state.value.products.filter((product: Product) => !product.in_stock))

const productsNotOnSaleOutOfStockAndUnder20 = computed(() => {
  return productsOutOfStock.value.filter((product: Product) => !product.on_sale && Number(product.price.slice(1)) < 20)
})
</script>

<template>
  <h1>Products</h1>
  <div :style="{ backgroundColor: '#daedf4', padding: '10px', marginBottom: '10px' }">
    <h2 :style="{margin: 0, borderBottom: '1px solid' }">Stats:</h2>
    <ul>
      <li>
        Products are out of stock, not on sale, and under $20
        <ul>
          <li v-for="product in productsNotOnSaleOutOfStockAndUnder20">
            {{ product.name }}
          </li>
        </ul>
      </li>
      <li>Most Common Category: <strong>{{state.topCategory}}</strong></li>
      <li>Average Price for Products on Sale: <strong>${{averagePriceForProductsOnSale.toFixed(2)}}</strong></li>
      <li>
        Women's Products Out of Stock
        <ul>
          <li v-for="(quantity, color) in womensProductsOutOfStockByColor">
            {{ color }} - <strong>{{ quantity }}</strong>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <div v-for="product in state.products" :key="product.id">
    <div>{{product.name}} - {{product.price}}</div>
  </div>
</template>