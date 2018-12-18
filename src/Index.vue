<template>
  <div id="app" v-if="show" v-click-outside="close" class="vue-coe-calendar">
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

// mixins
import calendar from './support/mixins/calendar'

// components
import CoeReset from './components/CoeReset.vue'
import CoeHeader from './components/CoeHeader.vue'
import CoeWeek from './components/CoeWeek.vue'
import CoeDay from './components/CoeDay.vue'
import CoeSelections from './components/CoeSelections.vue'

// services
import { getDay, getMonth, getYear, getDate, getFormattedDate, months } from './support/services'
import isValid from './support/services/isValid'
// import { rangeOption } from './support/services/pickDay'

export default {
  name: 'vue-coe-calendar',

  mixins: [ calendar ],

  components: { CoeReset, CoeHeader, CoeWeek, CoeDay, CoeSelections },

  props: {
    show: Boolean,
    isRange: Boolean,
    date: {
      type: [String, Object],
      required: true
    }
  },

  directives: { clickOutside },

  data () {
    return {
      internalDate: '',
      day: null,
      finalDay: null,
      month: null,
      year: null,
      showMonths: false,
      showYears: false
    }
  },

  mounted () {
    const date = new Date()
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' }

    const currentDate = date.toLocaleDateString('pt-BR', options)

    this.day = +getDay(this.date || currentDate)
    this.month = +getMonth(this.date || currentDate)
    this.year = +getYear(this.date || currentDate)

    if (this.isRange) {
      this.internalDate = {
        start: this.date || currentDate,
        end: null
      }
    }
  },

  watch: {
    date (d) {
      if (isValid(d)) {
        this.day = +getDay(d)
        this.month = +getMonth(d)
        this.year = +getYear(d)

        if (this.isRange) {
          this.internalDate.start = d
        } else {
          this.internalDate = d
        }
      } else {
        this.day = null
      }
    },

    internalDate: {
      handler ({ start, end }) {
        if (start && end && (getDate(start) > getDate(end))) {
          this.internalDate = { start: end, end: start }
        }
      }
    }
  },

  computed: {
    initMonth () {
      if (!this.day || !this.internalDate) return null

      return +getMonth(this.isRange ? this.internalDate.start : this.internalDate)
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

      const date = (day = this.day) => getFormattedDate(day, this.month, this.year)

      if (this.isRange) {
        // case 1:
        // - initial date already selected
        // - end date already selected
        // - reset dates
        // - set initial date
        if (this.internalDate && this.internalDate.start && this.internalDate.end) {
          this.internalDate = null
          this.day = day
          this.finalDay = null

          this.internalDate = { start: date(), end: null }

          // case 2:
          // - no date selected yet
          // - set the initial date
        } else if (!this.day) {
          this.day = day

          this.internalDate = { start: date(), end: null }

        // case 3:
        // - initial date already selected
        // - set the end date
        } else {
          this.finalDay = day

          this.internalDate = { start: this.internalDate.start, end: date(day) }
        }
      } else {
        this.day = day
        this.internalDate = date()
      }
    },

    apply () {
      const hasDate__STRING = typeof this.internalDate === 'string' && this.internalDate.length
      const hasDate__OBJECT = typeof this.internalDate === 'object' && Object.values(this.internalDate).filter(Boolean).length

      if (hasDate__STRING || hasDate__OBJECT) {
        this.$emit('date-handler', this.internalDate)
        this.$emit('show', false)
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
      if (this.showMonths) {
        this.showMonths = false

        return
      }

      if (this.showYears) {
        this.showYears = false

        return
      }

      this.$emit('show', false)
    }
  }
}
</script>

<style lang="scss">
.vue-coe-calendar {
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
