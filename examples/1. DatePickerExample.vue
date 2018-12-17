<template>
  <div class="DatePicker">
    <input
      class="DatePicker__input"
      type="text"
      v-model="date"
      @blur="isFocused = false"
      @focus="isFocused = true"
    >

    <calendar
      is-range
      :date="date"
      :show="isFocused"
      @date-handler="(value) => date = value"
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
      isFocused: false
    }
  }
}
</script>

<style src="../dist/vue-coe-datepicker.css" />
