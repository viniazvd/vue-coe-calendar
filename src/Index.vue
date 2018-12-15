<template>
  <div id="app" class="vue-coe-datepicker">
    <div v-if="show" v-click-outside="() => $emit('show', false)" class="container">
      <coe-reset @reset-date="resetDate" />

      <coe-header @date-handler="dateHandler" :month="getMonthName(month)" :year="year" />

      <coe-week />

      <coe-day :calendar="calendar" @pick-day="pickDay" />
    </div>

    <button v-if="show" class="apply" @click="$emit('date-handler', internalDate)">APLICAR</button>
  </div>
</template>

<script>
// directive
import clickOutside from './support/directives/outside'

// services
import { getDay, getMonth, getYear, getFormattedDate, getCalendar, months } from './support/services'
import { rangeOption } from './support/services/pickDay'

// components
import CoeReset from './components/CoeReset'
import CoeHeader from './components/CoeHeader'
import CoeWeek from './components/CoeWeek'
import CoeDay from './components/CoeDay'

// mixins
// import pickDay from './support/mixins/pickDay'

export default {
  name: 'vue-coe-datepicker',

  components: { CoeReset, CoeHeader, CoeWeek, CoeDay },

  // mixins: [ pickDay ],

  props: {
    show: Boolean,
    isRange: Boolean,
    date: {
      type: [String, Object, InputEvent],
      required: true
    }
  },

  directives: { clickOutside },

  data () {
    return {
      internalDate: Object.create(null),
      day: null,
      finalDay: null,
      month: null,
      year: null
    }
  },

  mounted () {
    if (!this.date) {
      const date = new Date()
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' }

      const currentDate = date.toLocaleDateString('pt-BR', options)

      this.month = +getMonth(currentDate)
      this.year = +getYear(currentDate)
    } else {
      if (this.isRange) {
        this.day = +getDay(this.date.start)
        this.month = +getMonth(this.date.start)
        this.year = +getYear(this.date.start)
      } else {
        this.day = +getDay(this.date)
        this.month = +getMonth(this.date)
        this.year = +getYear(this.date)
      }
    }
  },

  watch: {
    date (d) {
      // if (isValid(d)) {
      if (d.length === 10) {
        this.day = +getDay(d)
        this.month = +getMonth(d)
        this.year = +getYear(d)

        this.internalDate.start = d
      } else {
        this.day = null
      }
    }
  },

  computed: {
    initMonth () {
      if (!this.day || !this.internalDate) return null

      return +getMonth(this.isRange ? this.internalDate.start : this.internalDate)
    },

    calendar () {
      return getCalendar.call(this, this.year, this.month - 1)
    }
  },

  methods: {
    dateHandler (handler) {
      if (handler === '<') this.month--
      if (handler === '<' && !this.month) {
        this.month = 12
        this.year--
      }

      if (handler === '>') this.month++
      if (handler === '>' && this.month === 13) {
        this.month = 1
        this.year++
      }
    },

    pickDay ({ selectable, day }) {
      if (!selectable) return false

      if (this.isRange) return rangeOption.call(this, day)

      this.day = day
      this.internalDate = getFormattedDate(this.day, this.month, this.year)
    },

    resetDate () {
      this.day = null
      this.finalDay = null
      this.internalDate = {}

      this.$emit('date-handler', '')
    },

    getMonthName (index) {
      return months[index]
    }
  }
}
</script>

<style lang="scss">
.vue-coe-datepicker {
  & > .container {
    width: 250px;
    height: auto;
    margin-top: 10px;
    border: 1px solid gray;
  }
}
</style>
