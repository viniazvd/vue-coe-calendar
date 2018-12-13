<template>
  <div id="app" class="vue-coe-datepicker">
    <div
      v-if="show"
      v-click-outside="() => $emit('show', false)"
      class="container"
    >
      <div class="header-container">
        <span class="monthHandler" @click="dateHandler('<')">‹</span>
        <span>{{ getMonthName(internalDate.date.month) }} {{ internalDate.date.year }}</span>
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
      type: String,
      default: () => {
        const date = new Date(2018, 1, 12)
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' }

        return date.toLocaleDateString('pt-BR', options)
      }
    }
  },

  directives: { clickOutside },

  watch: {
    'internalDate.date.day': {
      handler (d) {
        this.internalDate.date.day = d || +getDay(this.date)
      },
      immediate: true
    }
  },

  data () {
    return {
      internalDate: {
        date: {
          day: null,
          month: null,
          year: null
        },
        finalDate: {
          day: null,
          month: null,
          year: null
        }
      }
    }
  },

  mounted () {
    this.internalDate.date.month = +getMonth(this.date)
    this.internalDate.date.year = +getYear(this.date)
  },

  computed: {
    calendar () {
      return getCalendar(this.internalDate.date.year, this.internalDate.date.month - 1)
    }
  },

  methods: {
    dateHandler (handler) {
      if (handler === '<') this.internalDate.date.month--
      if (handler === '<' && !this.internalDate.date.month) {
        this.internalDate.date.month = 12
        this.internalDate.date.year--
      }

      if (handler === '>') this.internalDate.date.month++
      if (handler === '>' && this.internalDate.date.month === 13) {
        this.internalDate.date.month = 1
        this.internalDate.date.year++
      }
    },

    pickDay ({ selectable, day }) {
      if (this.isRange && !this.internalDate.finalDate.day) {
        if (selectable) this.internalDate.date.day = day
        this.$emit('date-handler', getDate(this.internalDate.date))

        return
      } else {

      }

      // isRange = false
      if (selectable) this.internalDate.date.day = day
      this.$emit('date-handler', getDate(this.internalDate.date))
    },

    dayClasses ({ selectable, day }) {
      return [
        'value',
        {
          '-selectable': selectable,
          '-current-day': day === this.internalDate.date.day
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
