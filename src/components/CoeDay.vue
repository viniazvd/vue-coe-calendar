<template>
  <div class="coe-day">
    <div class="row-container">
      <div
        v-for="row in 6"
        :key="row"
        :style="getPosition(row)"
        :class="[
          'row', {
            '-start-day': hasStartDate(row),
            '-end-day': hasEndDate(row)
          }
        ]"
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
            '-hide': showDisabledDays && !day.selectable
          }
        ]"
        @click="$emit('pick-day', day)"
      >
        <span class="value">{{ day.day }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getDay, getMonth, getDataPerRow, getSelectedsPerRow } from '../support/services'

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

  computed: {
    startDay () {
      return +getDay(this.date.start)
    },

    endDay () {
      return +getDay(this.date.end)
    },

    startMonth () {
      return +getMonth(this.date.start)
    },

    endMonth () {
      return +getMonth(this.date.end)
    }
  },

  methods: {
    getPosition (row) {
      if (!this.date.end) return { 'width': 0 }

      // calendar data sliced per row
      const dataPerRow = this.getDataPerRow(row)

      // selected days per row
      const selectedPerRow = getSelectedsPerRow(dataPerRow)

      // pixel size
      const daySize = 46

      const width = this.getWidth(selectedPerRow)
      const left = this.getLeft(row, dataPerRow) * daySize

      return {
        'width': width + '%',
        'left': left + 'px'
      }
    },

    getWidth (selectedPerRow) {
      const dayWidth = 14
      const sameDay = this.startDay === this.endDay
      const sameMonth = this.startMonth === this.endMonth

      return sameDay && sameMonth ? 0 : selectedPerRow * dayWidth
    },

    getDataPerRow (row) {
      return getDataPerRow(this.calendar, row, this.month)
    },

    hasStartDate (row) {
      return this.getDataPerRow(row).some(({ day, month }) => day === this.startDay && month === this.startMonth)
    },

    hasEndDate (row) {
      return this.getDataPerRow(row).some(({ day, month }) => day === this.endDay && month === this.endMonth)
    },

    getLeft (row, dataPerRow) {
      // if row contains start date
      const hasStartDate = dataPerRow.some(({ day, month }) => day === this.startDay && month === this.startMonth)

      // if row contains end date
      const hasEndDate = dataPerRow.some(({ day, month }) => day === this.endDay && month === this.endMonth)

      // qnt of selectable days shorter than the start date
      const diff = dataPerRow.filter(({ day }) => day < this.startDay).length

      // fix diff of the line (1, 5 or 6) that does not have the 7 days of the current month (last month or previous month)
      const diffFixs = this.daysBeforeMonth + diff

      if (dataPerRow.length === 7 && hasStartDate && hasEndDate && row === 1) return this.daysBeforeMonth > 0 ? diffFixs : diff

      if (dataPerRow.length < 7 && !hasStartDate && hasEndDate) return row > 1 ? 0 : this.daysBeforeMonth

      if (hasStartDate && hasEndDate || hasStartDate && !hasEndDate) return row === 1 ? diffFixs : diff

      return row === 1 ? this.daysBeforeMonth : 0
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
        color: #FFFFFF;
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
