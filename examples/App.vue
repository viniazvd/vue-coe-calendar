<template>
  <main class="App">
    <h1 class="App__title">
      <code class="App__name">{{ name }}</code>
      Examples
    </h1>

    <section class="App__section Section">
      <h2 class="Section__title">1. DatePicker Example</h2>
      <DatePickerExample />
    </section>
  </main>
</template>

<script>
import { name } from '../package.json'
import DatePickerExample from './1. DatePickerExample.vue'

export default {
  components: {
    DatePickerExample
  },
  data () {
    return {
      name
    }
  }
}
</script>

<style lang="stylus">
.App
  &__title
    font-size 28px
</style>
