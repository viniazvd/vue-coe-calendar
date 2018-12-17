<template>
  <main class="App">
    <h1 class="App__title">
      <code class="App__name">{{ name }}</code>
      Examples
    </h1>

    <section class="App__section Section">
      <h2 class="Section__title">1. Simple</h2>
      <simple />
    </section>

    <section class="App__section Section">
      <h2 class="Section__title">2. IsRange</h2>
      <is-range />
    </section>

    <section class="App__section Section">
      <h2 class="Section__title">3. showDisabledDays</h2>
      <show-disabled-days />
    </section>
  </main>
</template>

<script>
import { name } from '../package.json'
import Simple from './1. Simple.vue'
import IsRange from './2. IsRange.vue'
import showDisabledDays from './3. showDisabledDays.vue'

export default {
  components: { Simple, IsRange, showDisabledDays },

  data () {
    return {
      name
    }
  }
}
</script>

<style lang="scss">
.App {
  &__title {
    font-size: 28px;
  }
}
</style>
