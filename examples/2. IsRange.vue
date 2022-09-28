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
      v-outside="closeCalendar"
      is-range
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
      date: '20/04/2018',
      showPicker: false
    }
  },

  methods: {
    closeCalendar () {
      console.log('coe')
      this.showPicker = false
    }
  }
}
</script>

<style src="../dist/vue-coe-calendar.css" />
