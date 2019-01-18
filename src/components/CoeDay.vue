<template>
  <div class="coe-day">
    <div class="row-container">
      <div
        v-for="row in 6"
        :key="row"
        :style="getPosition(row)"
        class="row"
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
import { getDay, getMonth } from '../support/services'

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
      const days = this.calendar
        .slice((row  - 1) * 7, ((row  - 1) + 1) * 7)
        .filter(row => row.month === this.month)

      const daysPerRow = days.reduce((acc, { isRange, selectable }) => {
        if (isRange && selectable) acc += isRange

       return acc
      }, 0)

      const dayWidth = 14
      const width = (this.startDay === this.endDay && this.startMonth === this.endMonth) ? 0 : (daysPerRow * dayWidth)

      const hasStartDate = days.some(({ day, month }) => day === this.startDay && month === this.startMonth)
      const hasEndDate = days.some(({ day, month }) => day === this.endDay && month === this.endMonth)

      const firstDay = days.filter(({ day }) => day < this.startDay).length

      const left = this.getLeftPosition(hasEndDate, hasStartDate, firstDay, daysPerRow, days)

      return {
        'width': width + '%',
        'left': left + 'px'
      }
    },

    getLeftPosition (hasEndDate, hasStartDate, firstDay, daysPerRow, days) {
      const itemSize = 46

      if (days.length < 7) {
        if (hasStartDate && !hasEndDate) {
          return (7 - daysPerRow) * itemSize
        } else if (!hasStartDate && !hasEndDate && firstDay) {
          return (7 - daysPerRow) * itemSize
        } else {
          return 0
        }
      }

      if ((7 - daysPerRow) === 0) return 0

      if (days.length < 7 && !hasEndDate && !hasStartDate) return (7 - daysPerRow) * itemSize

      if (hasEndDate && hasStartDate) {
        if (this.month === this.endMonth) {
          return 0
        } else {
          return firstDay * itemSize
        }
      }

      if (hasStartDate && !hasEndDate) return firstDay * itemSize
      if (this.startMonth !== this.endMonth) return 0
      if (!hasStartDate && hasEndDate) return this.startDay > this.endDay ? (7 - daysPerRow) * itemSize : 0
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
    }
  }

  & > .day-container {
    display: flex;
    margin-top: 5px;
    text-align: center;
    flex-flow: row wrap;

    & > .day {
      border-radius: 20px;
      flex: 0 calc(100% / 7);
      margin: { top: 2.5px; bottom: 2.5px; }
      padding: { top: 10px; bottom: 10px; }

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
        // background: linear-gradient(135deg, #BC4CF7 0%, #7873EE 100%);
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
