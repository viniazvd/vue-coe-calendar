<template>
  <div class="DatePicker">
    <input
      class="DatePicker__input"
      type="text"
      v-model="date"
      @click.stop="showPicker = true"
    >

    <calendar
      v-if="showPicker"
      v-outside="() => showPicker = false"
      is-range
      show-disabled-days
      v-model="date"
      @apply="() => showPicker = false"
    />

  </div>
</template>

<script>
// import Calendar from '../'
import Calendar from '../src/Index.vue'

export default {
  components: { Calendar },

  data () {
    return {
      date: '',
      showPicker: false
    }
  }
}
</script>

<style src="../dist/vue-coe-calendar.css" />
