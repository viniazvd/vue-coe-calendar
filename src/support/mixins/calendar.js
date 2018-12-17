import { getMonth, getYear, getDate, getFormattedDate } from '../services/index'
import { getDayBeforeMonth, getDayAfterMonth } from '../services/calendar'

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
      const dayBeforeMonth = getDayBeforeMonth(year, month)
      const dayAfterMonth = month => getDayAfterMonth(year, month)

      const isBeforeMonthStart = i => dayBeforeMonth + i <= dayAfterMonth(month)
      const isAfterMonthEnd = i => i - new Date(year, month, 0).getDay() > dayAfterMonth(month + 1)

      let calendar = []
      let day, tempDay, selectable, isRange, clicked

      for (let i = 0; i < 42; i++) {
        if (isBeforeMonthStart(i)) {
          tempDay = dayBeforeMonth + i

          day = tempDay
          selectable = false
          isRange = this.getRange(tempDay, month)
          clicked = false
        } else {
          if (isAfterMonthEnd(i)) {
            tempDay = i - dayAfterMonth(month + 1) - new Date(year, month, 1).getDay() - (new Date(year, month, 1).getDay() === 0 ? 6 : - 1)

            day = tempDay
            selectable = false
            isRange = this.getRange(tempDay, month)
            clicked = false
          } else {
            tempDay = i - new Date(year, month, 0).getDay()

            day = tempDay
            selectable = true
            isRange = this.getRange(tempDay, month)
            clicked = this.isClicked(tempDay, month, year)
          }
        }

        calendar.push({ day, month, selectable, isRange, clicked })
      }

      return calendar
    }
  },

  computed: {
    calendar () {
      return this.getCalendar(this.year, this.month - 1)
    }
  }
}

export default getCalendar

