<template>
  <div id="app">
    <input
      class="input"
      type="text"
      v-model="date"
      @click="showPicker = true"
    >

    <!-- <input
      v-if="isRange"
      class="input"
      type="text"
      :value="date"
      @input="v => date = v"
      @click="showPicker = true"
    > -->

    <vue-coe-datepicker
      show-disabled-days
      is-range
      :date="date"
      :show="showPicker"
      @show="show => showPicker = show"
      @date-handler="v => date = v"
    />
  </div>
</template>

<script>
import VueCoeDatepicker from './Index'

export default {
  name: 'app',

  components: { VueCoeDatepicker },

  data () {
    return {
      date: '',
      showPicker: false
    }
  }
}
</script>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
