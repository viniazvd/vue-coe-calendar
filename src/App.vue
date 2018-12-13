<template>
  <div id="app">
    <vue-coe-datepicker :current-date="date" />
  </div>
</template>

<script>
import VueCoeDatepicker from './VueCoeDatepicker'

export default {
  components: { VueCoeDatepicker },

  data () {
    return {
      date: '12/02/2018'
    }
  }
}
</script>
