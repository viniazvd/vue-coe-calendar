import { getMonth, getYear, getDate } from '../services/index'
import {
  firstDayBeforeMonth,
  isBeforeMonthStart,
  lastDayCurrentMonth,
  isAfterMonthEnd,
  weekDay
} from '../services/calendar'

const getCalendar = {
  methods: {
    getRange (day, month) {
      if (!this.internalDate) return false
      if (!this.internalDate.start || !this.internalDate.end) return false
      if (!this.isRange) return day === this.day && (month + 1) === this.initMonth

      const startDate = getDate(this.internalDate.start)
      const finalDate = getDate(this.internalDate.end)
      const loopDate = +new Date(this.year, (this.month - 1), day)

      return (loopDate >= startDate && loopDate <= finalDate) || (loopDate <= startDate && loopDate >= finalDate)
    },

    isClicked (day, month, year) {
      if (!this.internalDate) return false

      const date = this.isRange ? this.internalDate.start : this.internalDate

      return (day === this.day) && (+getMonth(date) === month + 1) && (+getYear(date) === year)
    },

    getCalendar (year, month) {
      return Array.from({ length: 42 }).map((_, i) => {
        if (isBeforeMonthStart(year, month, i)) {
          const day = firstDayBeforeMonth(year, month) + i

          return {
            day,
            selectable: false,
            isRange: this.getRange(day, month),
            clicked: false
          }
        } else {
          if (isAfterMonthEnd(year, month, i)) {
            const day = i - lastDayCurrentMonth(year, month) - new Date(year, month, 1).getDay() - (new Date(year, month, 1).getDay() === 0 ? 6 : - 1)

            return {
              day,
              selectable: false,
              isRange: this.getRange(day, month),
              clicked: false
            }
          } else {
            const day = i - weekDay(year, month)

            return {
              day,
              selectable: true,
              isRange: this.getRange(day, month),
              clicked: this.isClicked(day, month, year)
            }
          }
        }
      })
    }
  },

  computed: {
    calendar () {
      return this.getCalendar(this.year, this.month - 1)
    }
  }
}

export default getCalendar

