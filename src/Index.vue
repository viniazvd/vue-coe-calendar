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
        :days-before-month="lastDayLastMonth - firstDayBeforeMonth + 1"
        :date="internalDate"
        :month="month"
        :calendar="calendar"
        v-bind="$attrs"
        @pick-day="pickDay"
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
    date: {
      type: [String, Object],
      required: true
    }
  },

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
    const inputDate = isValid(this.date) && this.date

    this.day = +getDay(inputDate || currentDate)
    this.month = +getMonth(inputDate || currentDate)
    this.year = +getYear(inputDate || currentDate)

    if (this.isRange) {
      this.internalDate = {
        start: inputDate || currentDate,
        end: null
      }
    }
  },

  watch: {
    date (d) {
      if (!isValid(d)) return

      this.day = +getDay(d)
      this.month = +getMonth(d)
      this.year = +getYear(d)

      this.internalDate = this.isRange ? { start: d } : d
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

    apply () {
      const hasDate__STRING = typeof this.internalDate === 'string' && this.internalDate.length
      const hasDate__OBJECT = typeof this.internalDate === 'object' && Object.values(this.internalDate).filter(Boolean).length

      if (hasDate__STRING || hasDate__OBJECT) {
        this.$emit('date-handler', this.internalDate)
        this.$emit('apply')
      }
    },

    resetDate () {
      this.day = null
      this.finalDay = null
      this.internalDate = (this.isRange && {}) || ''

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
