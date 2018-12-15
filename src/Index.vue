<template>
  <div id="app" v-if="show" v-click-outside="close" class="vue-coe-datepicker">
    <div v-if="!showMonths && !showYears" class="container-calendar">
      <coe-reset @reset-date="resetDate" />

      <coe-header
        :month="getMonthName(month)"
        :year="year"
        @show-months="showMonths = !showMonths"
        @show-years="showYears = !showYears"
        @date-handler="dateHandler"
      />

      <coe-week />

      <coe-day v-bind="$attrs" :calendar="calendar" @pick-day="pickDay" />

      <button class="apply" @click="apply">APLICAR</button>
    </div>

    <coe-selections
      v-else
      :show-months="showMonths"
      :show-years="showYears"
      :month="month"
      :year="year"
      @set-month="month = $event; showMonths = false"
      @set-year="year = $event; showYears = false"
    />
  </div>
</template>

<script>
// directive
import clickOutside from './support/directives/outside'

// services
import { getDay, getMonth, getYear, getDate, getFormattedDate, getCalendar, months } from './support/services'
// import { rangeOption } from './support/services/pickDay'

// components
import CoeReset from './components/CoeReset'
import CoeHeader from './components/CoeHeader'
import CoeWeek from './components/CoeWeek'
import CoeDay from './components/CoeDay'
import CoeSelections from './components/CoeSelections'

export default {
  name: 'vue-coe-datepicker',

  components: { CoeReset, CoeHeader, CoeWeek, CoeDay, CoeSelections },

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
      year: null,
      showMonths: false,
      showYears: false
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

    // pickDay ({ selectable, day }) {
    //   if (!selectable) return false

    //   if (this.isRange) return rangeOption.call(this, day)

    //   this.day = day
    //   this.internalDate = getFormattedDate(this.day, this.month, this.year)
    // },

    pickDay ({ selectable, day }) {
      if (!selectable) return false

      if (this.isRange) {
        if (this.internalDate && this.internalDate.start && this.internalDate.end) {
          this.internalDate = null
          this.day = day
          this.finalDay = null

          this.internalDate = {
            start: getFormattedDate(this.day, this.month, this.year),
            end: null
          }
        } else if (!this.day) {
          this.day = day

          this.internalDate = {
            start: getFormattedDate(this.day, this.month, this.year),
            end: null
          }
        } else {
          this.finalDay = day

          this.internalDate = {
            start: this.internalDate.start,
            end: getFormattedDate(day, this.month, this.year)
          }
        }
      } else {
        this.day = day
        this.internalDate = getDate(this.day, this.month, this.year)
      }
    },

    apply () {
      if (this.internalDate.length || Object.keys(this.internalDate).length) {
        this.$emit('date-handler', this.internalDate)
      }
    },

    getMonthName (index) {
      return months[index]
    },

    resetDate () {
      this.day = null
      this.finalDay = null
      this.internalDate = {}

      this.$emit('date-handler', '')
    },

    close () {
      this.showMonths = false
      this.showYears = false

      this.$emit('show', false)
    }
  }
}
</script>

<style lang="scss">
.vue-coe-datepicker {
  width: 250px;
  height: auto;
  margin-top: 10px;
  position: relative;
  border: 1px solid gray;

  & > .container-calendar > .apply {
    right: -1px;
    width: 252px;
    position: absolute;
  }
}
</style>
