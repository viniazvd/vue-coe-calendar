<template>
  <div class="coe-day">
    <div class="row-container">
      <div
        v-for="row in 6"
        :key="row"
        :style="getStyles(row)"
        :class="{
          '-selected': over,
          '-pre-selected': !over,
          '-start-day': hasStartDate(row),
          '-end-day': hasEndDate(row)
        }"
      >
        &nbsp;
      </div>
    </div>

    <div class="day-container">
      <div
        v-for="(day, index) in calendar"
        :key="index"
        :class="[
          'day', {
            '-selectable': day.selectable,
            '-in-range': (day.isRange || day.clicked) && day.selectable,
            '-hide': showDisabledDays && !day.selectable,
          }
        ]"
        @click="$emit('pick-day', Object.assign(day, over))"
        @mouseover="e => day.selectable && setEndDate(e)"
      >
        <span class="value">{{ day.day }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getDay, getMonth, getYear, getDate, getDatePerRow, getSelectedsPerRow, isBetween } from '../support/services'

export default {
  name: 'CoeDay',

  props: {
    date: {
      type: [String, Object]
    },
    month: Number,
    year: Number,
    calendar: {
      type: Array,
      required: true,
      validator: c => c.length === 42
    },
    daysBeforeMonth: Number,
    showDisabledDays: Boolean
  },

  data () {
    return {
      over: null
    }
  },

  computed: {
    // style settings for each line
    style () {
      if (!this.date.end && !this.date.over) {
        return Array
          .from({ length: 6 })
          .reduce((acc, item, index) => {
            acc[index + 1] = { 'width': '0px', 'left': '0px' }

            return acc
          }, {})
      }

      return Array
        .from({ length: 6 })
        .reduce((acc, item, index) => {
          acc[index + 1] = this.getPosition(index + 1)

          return acc
        }, {})
    },

    startDay () {
      return +getDay(this.date.start)
    },

    endDay () {
      return this.date.end ? +getDay(this.date.end) : this.over
    },

    startMonth () {
      return +getMonth(this.date.start)
    },

    endMonth () {
      return +getMonth(this.date.end)
    },

    startYear () {
      return +getYear(this.date.start)
    },

    minDate () {
      const startDate = getDate(this.date.start)
      const overDate = getDate(this.date.over || this.date.end)

      const date = Math.min(startDate, overDate)

      return {
        day: new Date(date).getDate(),
        month: new Date(date).getMonth() + 1,
        year: new Date(date).getFullYear()
      }
    }
  },

  methods: {
    isBetween,

    getStyles (row) {
      const sizes = this.style ? this.style[row] : { width: 0, left: 0 };
      const opacity = this.date.over ? { opacity: 0.5 } : {}

      return { ...sizes, ...opacity }
    },

    setEndDate (e) {
      if (this.date.end || !e.target.children.length) return false

      this.over = +(e.target.children[0].innerHTML)

      this.$emit('set:over-day', this.over)
    },

    getPosition (row) {
      // calendar data sliced per row
      const dataPerRow = this.getDatePerRow(row)

      // selected days per row
      const selectedPerRow = getSelectedsPerRow(dataPerRow)

      // pixel size
      const daySizePixel = 46

      return {
        'width': this.getWidth(row, selectedPerRow) + '%',
        'left': this.getLeft(row) * daySizePixel + 'px'
      }
    },

    getWidth (row, selectedPerRow) {
      const daySizePixel = 14
      const startDayEqualEnd = this.startDay === this.endDay
      const startMonthEqualEnd = this.startMonth === this.endMonth

      return startDayEqualEnd && startMonthEqualEnd
        ? 0
        : selectedPerRow * daySizePixel
    },

    getLeft (row) {
      const { day: startDay, month: startMonth, year: startYear } = this.minDate

      // se for um mês ou ano diferente e se for a primeira semana do mês
      if ((startMonth !== this.month || startYear !== this.year) && row === 1) {
        return this.getIndex(1, this.month, this.year) % 7
      }

      const index = this.getIndex(startDay, startMonth, startYear)

      // se não for a semana do dia inicial (startDay || over)
      if (Math.floor(index / 7) + 1 !== row) return 0

      // retorna a posição do dia na semana
      return index % 7
    },


    getIndex (day, month, year) {
      return this.calendar.findIndex(obj => obj.day === day && obj.month === month && obj.year === year)
    },

    getDatePerRow (row) {
      return getDatePerRow(this.calendar, row, this.month)
    },

    // if row contains start date
    hasStartDate (row) {
      const { day, month, year } = this.minDate
      const index = this.getIndex(day, month, year)

      return Math.floor(index / 7) + 1 === row
    },

    // if row contains end date
    hasEndDate (row) {

      return this.calendar.some(({ day, month, year }) => {
        return day === this.over // && month === this.endMonth
      })
    }
  }
}
</script>

<style lang="scss">
.coe-day {
  position: relative;

  & > .row-container {
    width: 100%;
    margin-top: 5px;
    position: absolute;

    & > .-selected {
      position: relative;
      padding: { top: 10px; bottom: 10px; }
      margin: { top: 2.5px; bottom: 2.5px; }
      background: linear-gradient(135deg, #BC4CF7 0%, #7873EE 100%);

      &.-start-day {
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
      }

      &.-end-day {
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
      }
    }
  }

  & > .day-container {
    display: flex;
    margin-top: 7px;
    text-align: center;
    flex-flow: row wrap;

    & > .day {
      border-radius: 20px;
      flex: 0 calc(100% / 7);
      padding: { top: 10px; bottom: 10px; }
      margin: { top: 2.5px; bottom: 2.5px; }

      &.-selectable {
        z-index: 1;
        opacity: 0.7;

        &:hover {
          opacity: 1;
          border: unset;
          color: #FFFFFF;
          background: linear-gradient(135deg, #BC4CF7 0%, #7873EE 100%);
        }
      }

      &.-in-range {
        opacity: 1;
        color: blue !important;
      }

      &.-in-range:not(.-selectable) {
        color: unset;
        padding: unset;
        background-color: unset;
      }

      // &.-pre-selected {
      //   color: #FFFFFF;
      //   background: linear-gradient(135deg, #BC4CF7 0%, #7873EE 70%);
      // }

      &.-hide { opacity: 0 !important; }

      & > .value { font-size: 14px; }
    }

    & > .day:not(.-selectable) { opacity: 0.2; }
  }
}
</style>
