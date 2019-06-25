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
import { getDay, getMonth, getDatePerRow, getSelectedsPerRow, isBetween } from '../support/services'

export default {
  name: 'CoeDay',

  props: {
    date: {
      type: [String, Object]
    },
    month: Number,
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
        'left': this.getLeft(row, dataPerRow) * daySizePixel + 'px'
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

    getDatePerRow (row) {
      return getDatePerRow(this.calendar, row, this.month)
    },

    // if row contains start date
    hasStartDate (row) {
      return this.getDatePerRow(row).some(({ day, month }) => {
        return day === this.startDay // && month === this.startMonth
      })
    },

    // if row contains end date
    hasEndDate (row) {
      return this.getDatePerRow(row).some(({ day, month }) => {
        return day === this.over // && month === this.endMonth
      })
    },

    getLeft (row, dataPerRow) {
      const hasStartDate = this.hasStartDate(row)
      const hasEndDate = this.hasEndDate(row)
      const ranges = dataPerRow.filter(({ isRange }) => isRange).length
      const startIndex = dataPerRow.findIndex(({ day }) => day === this.startDay) + 1
      const overIndex = dataPerRow.findIndex(({ day }) => day === this.over) + 1
      const fixRowGap = dataPerRow.length !== 7 && row === 1
        ? this.daysBeforeMonth
        : 0

      console.log('-----')
      console.log('row', row)
      console.log('ranges', ranges)
      console.log('startIndex', startIndex)
      console.log('overIndex', overIndex)
      console.log(hasStartDate, hasEndDate)

      if (ranges === 7) return console.log('ranges 7') || 0
      if ((this.month !== this.startMonth)) {
        console.log('!=====')
        return hasStartDate && hasEndDate
          ? 0// (overIndex - 1) + fixRowGap
          : 0 + fixRowGap
      }

      if (hasStartDate && hasEndDate && row === 1) {
        if (overIndex === startIndex) return console.log('1.0') || (startIndex - 1) + this.daysBeforeMonth

        return overIndex > startIndex
          ? console.log('1.1') || overIndex - ranges + this.daysBeforeMonth
          : console.log('1.2') || (startIndex - ranges) + this.daysBeforeMonth
      }

      if (hasStartDate && hasEndDate) {
        console.log('2.0')
        if (overIndex >= startIndex) {
          return startIndex - 1
        } else {
          return overIndex - 1
        }
      }

      if (!hasStartDate && !hasEndDate) return console.log('2') || 0

      if (this.startDay > this.over)
        return overIndex
          ? console.log('3') || (overIndex - 1) + fixRowGap
          : console.log('4') || (ranges - startIndex) === 0 ? 0 : (startIndex - 1) + fixRowGap

      const index = startIndex > overIndex ? startIndex : overIndex

      return !overIndex ? console.log('5') || 7 - ranges : console.log('6') || (index - ranges) * -1
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
