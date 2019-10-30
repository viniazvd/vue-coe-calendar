<template>
  <div class="coe-day">
    <div class="row-container">
      <div
        v-for="row in 6"
        :key="row"
        :style="getStyles(row)"
        :class="['row', {
          '-start-day': isRounded(row, 'start'),
          '-end-day': isRounded(row, 'end')
        }]"
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
            '-single': !date.start,
            '-hide': showDisabledDays && !day.selectable,
          }
        ]"
        @click="$emit('pick-day', Object.assign(day))"
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
    date: Object,
    month: Number,
    year: Number,
    calendar: {
      type: Array,
      required: true,
      validator: c => c.length === 42
    },
    showDisabledDays: Boolean
  },

  computed: {
    // style settings for each line
    style () {
      if (!this.date.end && !this.date.over && !this.date.start) {
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
    }
  },

  methods: {
    getStyles (row) {
      const sizes = this.style ? this.style[row] : { width: 0, left: 0 };
      const opacity = this.date.over ? { opacity: 0.5 } : {}

      return { ...sizes, ...opacity }
    },

    setEndDate (e) {
      if (this.date.end || !e.target.children.length) return false

      this.$emit('set:over-day', +(e.target.children[0].innerHTML))
    },

    getPosition (row) {
      // calendar data sliced per row
      const dataPerRow = this.getDatePerRow(row)

      // selected days per row
      const selectedPerRow = services.getSelectedsPerRow(dataPerRow)

      return {
        'width': this.getWidth(row, selectedPerRow) + 'px',
        'left': this.getLeft(row) + 'px'
      }
    },

    getWidth (row, selectedPerRow) {
      if (!selectedPerRow) return 0

      const daySizePixel = 30
      const dayMargin = 10
      const calendarMargin = 20
      const { start, end } = services.getTimePeriod(this.date)
      const startIndex = this.getIndex(start.day, start.month, start.year)
      const endIndex = this.getIndex(end.day, end.month, end.year)
      const startRow = Math.floor(startIndex / 7) + 1
      const endRow = Math.floor(endIndex / 7) + 1
      const extraSpace = startRow !== row && endRow !== row
      ? calendarMargin*2
      : startRow === endRow ? 0 : calendarMargin

      return selectedPerRow * daySizePixel + (selectedPerRow - 1) * dayMargin + extraSpace
    },

    getLeft (row) {
      // pixel size
      const daySizePixel = 40

      const { start } = services.getTimePeriod(this.date)

      if ((start.month !== this.month || start.year !== this.year) && row === 1) {
        return (this.getIndex(1, this.month, this.year) % 7) * daySizePixel - 20
      }

      const index = this.getIndex(start.day, start.month, start.year)

      if (Math.floor(index / 7) + 1 !== row) return -20

      // week day
      return (index % 7) * daySizePixel
    },

    getIndex (day, month, year) {
      return this.calendar.findIndex(obj => {
        return obj.day === day && obj.month === month && obj.year === year
      })
    },

    isRounded (row, type) {
      const dates = services.getTimePeriod(this.date)
      const date = dates[type]

      if (!date) return false

      return this.getDatePerRow(row).some(({ day, month, year }) => {
        return day === date.day && month === date.month && year === date.year
      })
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
    height: 100%;
    position: absolute;

    & > .row {
      margin-bottom: 5px;
      height: 30px;
      position: relative;
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
    display: grid;
    grid-column-gap: 10px;
    grid-row-gap: 5px;
    grid-template-columns: repeat(7, 30px);

    & > .day {
      border-radius: 20px;
      flex: 0 calc(100% / 7);
      display: flex;
      align-items: center;
      justify-content: center;
      height: 30px;

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

        &.-single { background: linear-gradient(135deg, #BC4CF7 0%, #7873EE 100%); }
      }

      &.-in-range:not(.-selectable) {
        color: unset;
        padding: unset;
        background-color: unset;
      }

      &.-hide { opacity: 0 !important; }

      & > .value {
        font-size: 14px;
        line-height: 15px;
      }
    }

    & > .day:not(.-selectable) { opacity: 0.2; }
  }
}
</style>
