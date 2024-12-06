import { createApp } from 'vue'
import App from './App.vue'
import { watch } from '@/utils/watch'

interface Person {
  firstName: string,
  lastName: string,
  age?: number
}

const Person: Person = {
  firstName: 'Pablo',
  lastName: 'Vega',
  age: 37
}

const Pablo = watch(
  Person,
  (key: any, value: any) => console.log('GET:', `${key}: ${value}`),
  (key: any, value: any) => console.log('SET:', `${key}: ${value}`)
);

// Setting a property
Pablo.language = 'en'
// Getting a property
Pablo.language
// Nothing is logged for a non-existent property
Pablo.hairColor

console.log(Pablo)

createApp(App).mount('#app')
