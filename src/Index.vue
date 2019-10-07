<template>
  <div id="app" class="vue-coe-calendar">
    <div
      v-if="!showMonths && !showYears"
      class="container-calendar"
      tabindex="0"
      ref="container"
      @click="setDateHandler"
    >
      <coe-reset @reset-date="resetDate" />

      <coe-header
        :month="month"
        :year="year"
        @show-months="showMonths = !showMonths"
        @show-years="showYears = !showYears"
        @date-handler="dateHandler"
      />

      <coe-week />

      <coe-day
        :date="date"
        :month="month"
        :year="year"
        :calendar="calendar"
        v-bind="$attrs"
        @pick-day="pickDay"
        @set:over-day="setOverDay"
      />

      <button class="apply" @click="apply">
        <span class="text">APLICAR</span>
      </button>
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
// mixins
import calendar from './support/mixins/calendar'
import pickDay from './support/mixins/pickDay'

// components
import CoeReset from './components/CoeReset.vue'
import CoeHeader from './components/CoeHeader.vue'
import CoeWeek from './components/CoeWeek.vue'
import CoeDay from './components/CoeDay.vue'
import CoeSelections from './components/CoeSelections.vue'

// services
import { getDay, getMonth, getYear, getDate } from './support/services'
import isValid from './support/services/isValid'

export default {
  name: 'vue-coe-calendar',

  mixins: [ calendar, pickDay ],

  components: { CoeReset, CoeHeader, CoeWeek, CoeDay, CoeSelections },

  props: {
    isRange: Boolean,
    inputDate: {
      type: [String, Object],
      default: ''
    }
  },

  data () {
    return {
      date: {},
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
    const inputDate = isValid(this.inputDate) && this.inputDate

    const day = +getDay(inputDate || currentDate)
    const month = +getMonth(inputDate || currentDate)
    const year = +getYear(inputDate || currentDate)

    this.month = month
    this.year = year

    if (this.isRange) {
      this.date = {
        start: { day, month, year },
        end: null,
        over: null
      }
    }
    else {
      this.date = { day, month, year }
    }
  },

  watch: {
    inputDate (d) {
      if (!isValid(d)) return

      const date = {
        day: +getDay(d),
        month: +getMonth(d),
        year: +getYear(d)
      }

      this.month = date.month
      this.year = date.year

      this.date = this.isRange ? { start: date } : date
    },

    date: {
      handler ({ start, end }) {
        if (start && end && (getDate(start) > getDate(end))) {
          this.date = {
            start: end,
            end: start,
            over: null //end
          }
        }
      }
    }
  },

  methods: {
    dateHandler ({ key } = {}, handler) {
      // to prevent unnecessarily entering in datehandler
      if (key && !handler && !['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(key)) return

      if (handler === '<' || key === 'ArrowLeft') this.month--
      if ((handler === '<' || key === 'ArrowLeft') && !this.month) {
        this.month = 12
        this.year--
      }

      if (handler === '>' || key === 'ArrowRight') this.month++
      if ((handler === '>' || key === 'ArrowRight') && this.month === 13) {
        this.month = 1
        this.year++
      }

      if (key === 'ArrowUp') this.year++
      if (key === 'ArrowDown') this.year--
    },

    setDateHandler () {
      window.addEventListener('keyup', this.dateHandler)
      this.$refs.container && this.$refs.container.focus()

      this.$on('hook:beforeDestroy', () => window.removeEventListener('keyup', this.dateHandler))
    },

    setOverDay (day) {
      if (this.isRange)
        this.date.over = { day, month: this.month, year: this.year }
    },

    apply () {
      const hasDate = Object.values(this.date).filter(Boolean).length

      if (hasDate) {
        this.$emit('date-handler', this.date)
        this.$emit('apply')
      }
    },

    resetDate () {
      this.date = {}

      this.$emit('date-handler', '')
    }
  }
}
</script>

<style lang="scss">
.vue-coe-calendar {
  width: 330px;
  height: 400px;
  margin-top: 10px;
  position: relative;
  border: 1px solid gray;

  & > .container-calendar {
    outline: none;

    & > .apply {
      bottom: 0;
      position: absolute;

      width: 100%;
      display: flex;
      justify-content: center;

      height: 40px;
      border-radius: 3px;
      background: linear-gradient(135deg, #BC4CF7 0%, #7873EE 100%);

      & > .text {
        color: #FFFFFF;
        font-family: Ubuntu;
        font-size: 11px;
        font-weight: 500;
        line-height: 14px;
        text-align: center;
        text-shadow: 0 1px 2px 0 rgba(0,0,0,0.2);
      }
    }
  }
}
</style>
