<template>
  <div class="coe-day">
    <div class="row-container">
      <div
        v-for="row in 6"
        :key="row"
        :style="getStyles(row)"
        :class="{
          '-selected': over,
          '-start-day': isRounded(row, 'min'),
          '-end-day': isRounded(row, 'max')
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
import * as services from '../support/services'

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
          const { width, left } = this.getPosition(index + 1)
          const background = this.gradient(index + 1)

          acc[index + 1] = { width, left, background }

          return acc
        }, {})
    },

    startDay () {
      return +services.getDay(this.date.start)
    },

    endDay () {
      return this.date.end ? +services.getDay(this.date.end) : this.over
    },

    startMonth () {
      return +services.getMonth(this.date.start)
    },

    endMonth () {
      return +services.getMonth(this.date.end)
    },

    startYear () {
      return +services.getYear(this.date.start)
    }
  },

  methods: {
    gradient (row) {
      const { day: startDay } = this.getDate('min')
      const { day: endDay } = this.getDate('max')

      // descobre o primeiro e o último dia da semana do mesmo mês
      const sun = row === 1 ? 1 : this.calendar[(row - 1)*7].day
      const sat = row > 3 && this.calendar[row*7 - 1].day < 13 ? 30 : this.calendar[row*7 - 1].day

      // se nao possuir dias selecionados, retorna cor sólida
      // if (sun > endDay || sat < startDay) return 'red'

      // descobre as porcentagens
      const weekStartDay = this.isRounded(row, 'min') ? startDay : sun
      const weekEndDay = this.isRounded(row, 'max') ? endDay : sat
      const total = endDay - startDay + 1
      const startPerc = 100*(startDay - weekStartDay)/total
      const endPerc = 100*(weekEndDay - startDay + 1)/total

      // calcula a porcentagem inicial
      const aaa = startPerc ? startPerc/(endPerc + startPerc) : 0

      // calcula a porcentagem final
      const bbb = endPerc === 100 ? 1 : (100 + startPerc)/(endPerc + startPerc)

      return `linear-gradient(90deg, #BC4CF7 ${aaa*100}%, #7873EE ${bbb*100}%)`
    },

    // isBetween: services.isBetween,

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
      const selectedPerRow = services.getSelectedsPerRow(dataPerRow)

      // pixel size
      const daySizePixel = 47.14

      return {
        // 'width': this.getWidth(row, selectedPerRow) + '%',
        'width': this.getWidth(row, selectedPerRow) + 'px',
        'left': this.getLeft(row) * daySizePixel + 'px'
      }
    },

    getWidth (row, selectedPerRow) {
      const daySizePixel = 14
      const startDayEqualEnd = this.startDay === this.endDay
      const startMonthEqualEnd = this.startMonth === this.endMonth

      return startDayEqualEnd && startMonthEqualEnd
        ? 0
        // : selectedPerRow * daySizePixel
        : selectedPerRow * 47.14
    },

    getLeft (row) {
      const {
        day: startDay,
        month: startMonth,
        year: startYear
      } = this.getDate('min')

      if ((startMonth !== this.month || startYear !== this.year) && row === 1) {
        return this.getIndex(1, this.month, this.year) % 7
      }

      const index = this.getIndex(startDay, startMonth, startYear)

      if (Math.floor(index / 7) + 1 !== row) return 0

      // week day
      return index % 7
    },

    getIndex (day, month, year) {
      return this.calendar.findIndex(obj => {
        return obj.day === day && obj.month === month && obj.year === year
      })
    },

    isRounded (row, type) {
      const date = this.getDate(type)

      return this.getDatePerRow(row).some(({ day, month, year }) => {
        return day === date.day && month === date.month && year === date.year
      })
    },

    getDate (type) {
      const startDate = services.getDate(this.date.start)
      const overDate = services.getDate(this.date.over || this.date.end)

      const date = Math[type](startDate, overDate)

      return {
        day: new Date(date).getDate(),
        month: new Date(date).getMonth() + 1,
        year: new Date(date).getFullYear()
      }
    },

    getDatePerRow (row) {
      return services.getDatePerRow(this.calendar, row, this.month)
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
        color: white !important;
      }

      &.-in-range:not(.-selectable) {
        color: unset;
        padding: unset;
        background-color: unset;
      }

      &.-hide { opacity: 0 !important; }

      & > .value { font-size: 14px; }
    }

    & > .day:not(.-selectable) { opacity: 0.2; }
  }
}
</style>
