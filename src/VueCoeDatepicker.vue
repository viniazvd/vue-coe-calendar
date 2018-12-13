<template>
  <div id="app" class="vue-coe-datepicker">
    <div v-if="show" v-click-outside="close" class="container">
      <div class="reset-container">
        <button @click="resetDate">REDEFINIR</button>
      </div>

      <div class="header-container">
        <span class="monthHandler" @click="dateHandler('<')">‹</span>
        <span>{{ getMonthName(month) }} {{ year }}</span>
        <span class="monthHandler" @click="dateHandler('>')">›</span>
      </div>

      <div class="week-container">
        <div v-for="(weekDay, index) in ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']" :key="index" class="week">
          <span class="value">{{ weekDay }}</span>
        </div>
      </div>

      <div class="day-container">
        <div v-for="(λ, index) in calendar" :key="index" class="day">
          <span :class="dayClasses(λ)" @click="pickDay(λ)">
            {{ λ.day }}
          </span>
        </div>
      </div>
    </div>

    <button v-if="show" class="apply" @click="$emit('date-handler', internalDate)">APLICAR</button>
  </div>
</template>

<script>
// directive
import clickOutside from './outside'

// services
import { getDay, getMonth, getYear, getDate, getCalendar, getMonthName } from './services'

export default {
  name: 'vue-coe-datepicker',

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
      internalDate: null,
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

  computed: {
    initMonth () {
      if (!this.day || !this.internalDate) return null

      return +getMonth(this.isRange ? this.internalDate.start : this.date)
    },

    calendar () {
      return getCalendar(this.year, this.month - 1)
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

      if (this.isRange) {
        if (this.day && this.finalDay) {
          this.finalDay = day

          this.internalDate = {
            start: this.internalDate.start,
            end: getDate(day, this.month, this.year)
          }
        } else if (!this.day) {
          this.day = day

          this.internalDate = {
            start: getDate(this.day, this.month, this.year),
            end: null
          }
        } else {
          this.finalDay = day

          this.internalDate = {
            start: this.internalDate.start,
            end: getDate(day, this.month, this.year)
          }
        }
      } else {
        this.day = day
        this.internalDate = getDate(this.day, this.month, this.year)
      }
    },

    resetDate () {
      this.day = null
      this.finalDay = null
      this.internalDate = null

      this.$emit('date-handler', '')
    },

    close () {
      Object.assign(this.$data, this.$options.data())

      this.$emit('show', false)
    },

    getCurrentDay (day, month) {
      if (!this.internalDate) return false
      if (!this.isRange) return day === this.day && (month + 1) === this.initMonth
      if (!this.internalDate.start || !this.internalDate.end) return false

      const startDate = new Date(getYear(this.internalDate.start), (getMonth(this.internalDate.start) - 1), getDay(this.internalDate.start)).getTime()
      const finalDate = new Date(getYear(this.internalDate.end), (getMonth(this.internalDate.end) - 1), getDay(this.internalDate.end)).getTime()

      return startDate > finalDate
    },

    dayClasses ({ selectable, day, month }) {
      return [
        'value',
        {
          '-selectable': selectable,
          '-current-day': this.getCurrentDay(day, month)
        }
      ]
    },

    getMonthName
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

    & > .reset-container {
      padding: 5px;
      display: flex;
      justify-content: center;
    }

    & > .header-container {
      padding: 10px;
      display: flex;
      justify-content: space-between;

      & > .monthHandler {
        cursor: pointer;
      }
    }

    & > .week-container {
      display: flex;

      & > .week {
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
      margin-top: 5px;
      text-align: center;
      flex-flow: row wrap;

      & > .day {
        height: 0;
        position: relative;
        width: calc(100% / 7);
        flex: 0 calc(100% / 7);
        margin-bottom: calc(100% / 7);

        & > .value { color: gray; }

        & > .-selectable {
          color: red;

          &:hover {
            padding: 5px;
            border: 1px solid black;
          }
        }

        & > .-current-day {
          padding: 5px;
          color: red;
          background-color: black;
        }

        & > .-current-day:not(.-selectable) {
          padding: unset;
          color: unset;
          background-color: unset;
        }
      }
    }
  }
}
</style>
