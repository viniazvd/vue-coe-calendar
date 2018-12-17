<template>
  <div class="DatePicker">
    <input
      class="DatePicker__input"
      type="text"
      v-model="date"
      @click="showPicker = true"
    >

    <calendar
      is-range
      :date="date"
      :show="showPicker"
      @show="show => showPicker = show"
      @date-handler="v => date = v"
    />

  </div>
</template>

<script>
import Calendar from '../'

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

<style src="../dist/vue-coe-datepicker.css" />
