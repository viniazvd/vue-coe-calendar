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

      // pixel size
      const daySizePixel = 46

      return {
        'width': this.getWidth(row, selectedPerRow) + '%',
        'left': this.getLeft(row) * daySizePixel + 'px'
      }
    },

    getWidth (row, selectedPerRow) {
      const daySizePixel = 14

      return selectedPerRow * daySizePixel
    },

    getLeft (row) {
      const { start } = services.getTimePeriod(this.date)

      if ((start.month !== this.month || start.year !== this.year) && row === 1) {
        return this.getIndex(1, this.month, this.year) % 7
      }

      const index = this.getIndex(start.day, start.month, start.year)

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
    margin-top: 5px;
    position: absolute;

    & > .row {
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

        &.-single { background: linear-gradient(135deg, #BC4CF7 0%, #7873EE 100%); }
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
