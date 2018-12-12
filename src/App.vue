<template>
  <div id="app" class="vue-coe-datepicker">
    <input
      class="input"
      type="text"
      :value="date"
      @input="v => date = v"
      @click="showPicker = true"
    >

    <div
      v-if="showPicker"
      v-click-outside="() => showPicker = false"
      class="container"
    >
      <div class="week-container">
        <div v-for="(weekDay, index) in ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']" :key="index" class="week-day">
          <span class="value">{{ weekDay }}</span>
        </div>
      </div>

      <div class="day-container">
        <div v-for="(λ, index) in calendar" :key="index" class="day">
          <button class="value">{{ λ.day }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// directive
import clickOutside from './outside'

// services
import { getDay, getMonth, getYear, getCalendar } from './services'

export default {
  name: 'vue-coe-datepicker',

  props: {
    date: {
      type: String,
      default: ''
    },
    currentDate: {
      type: String,
      default: () => {
        const date = new Date(2018, 1, 12)
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' }

        return date.toLocaleDateString('pt-BR', options)
      }
    }
  },

  directives: { clickOutside },

  data () {
    return {
      showPicker: false
    }
  },

  computed: {
    day () { return +getDay(this.currentDate) },

    month () { return +getMonth(this.currentDate) },

    year () { return +getYear(this.currentDate) },

    calendar () {
      return getCalendar(this.year, this.month)
    }
  }
}
</script>

<style lang="scss">
.vue-coe-datepicker {
  display: flex;
  flex-direction: column;
  align-items: center;

  & > .input {}

  & > .container {
    width: 250px;
    height: auto;
    margin-top: 10px;
    border: 1px solid gray;

    & > .week-container {
      display: flex;

      & > .week-day {
        width: 100%;
        text-align: center;
        padding: 5px;

        & > .value {
          padding-bottom: 5px;
          display: block;
        }
      }
    }

    & > .day-container {
      width: 100%;
      display: flex;
      overflow: hidden;
      text-align: center;
      flex-flow: row wrap;

      & > .day {
        height: 0;
        position: relative;
        width: calc(100% / 7);
        flex: 0 calc(100% / 7);
        padding-bottom: calc(100% / 7);
      }
    }
  }
}
</style>
