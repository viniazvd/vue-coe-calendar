import { getMonth, getYear, getDate } from '../services/index'

const getCalendar = {
  methods: {
    isAfterMonthEnd (i) {
      return i - new Date(this.year, this.month - 1, 0).getDay() > this.lastDayCurrentMonth
    },

    isBeforeMonthStart (i) {
      return this.firstDayBeforeMonth + i <= this.lastDayLastMonth
    },

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
      return Array.from({ length: 42 }, (_, i) => {
        if (this.isBeforeMonthStart(i)) {
          const day = this.firstDayBeforeMonth + i

          return {
            day,
            selectable: false,
            isRange: this.getRange(day, month),
            clicked: false
          }
        } else {
          if (this.isAfterMonthEnd(i)) {
            const day = i - this.lastDayCurrentMonth - new Date(year, month, 1).getDay() - (new Date(year, month, 1).getDay() === 0 ? 6 : - 1)

            return {
              day,
              selectable: false,
              isRange: this.getRange(day, month),
              clicked: false
            }
          } else {
            const day = i - this.weekDay

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
    },

    firstDayBeforeMonth () {
      const date = new Date(this.year, this.month - 1, 0)
      const day = date.getDay()
      const calendarStart = new Date(date)

      // get the difference till the first day of the week plus the offset to start the week at the given day
      const diff = calendarStart.getDate() - day
      calendarStart.setDate(diff)

      // in case the start date is further then the start of the month, set back with a week.
      if (calendarStart.getDate() > date.getDate()) return calendarStart.setDate(calendarStart.getDate() - 7)

      return calendarStart.getDate()
    },

    // WIP
    firstDayAfterMonth () {
      return new Date(this.year, this.month - 1, 1).getDay() - (new Date(this.year, this.month - 1, 1).getDay() === 0 ? 6 : - 1)
    },

    lastDayCurrentMonth () {
      return new Date(this.year, this.month, 0).getDate()
    },

    lastDayLastMonth () {
      return new Date(this.year, this.month - 1, 0).getDate()
    },

    weekDay () {
      return new Date(this.year, this.month - 1, 0).getDay()
    }
  }
}

export default getCalendar

