import { getMonth, getYear, getDate } from '../services/index'

const getCalendar = {
  methods: {
    isAfterMonthEnd (i) {
      return i - this.weekDay > this.lastDayCurrentMonth
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
            month,
            selectable: false,
            isRange: this.getRange(day, month),
            clicked: false
          }
        } else {
          if (this.isAfterMonthEnd(i)) {
            const day = i - this.lastDayCurrentMonth - this.weekDay

            return {
              day,
              month: month + 2,
              selectable: false,
              isRange: this.getRange(day, month),
              clicked: false
            }
          } else {
            const weekDay = this.weekDay === 6 ? this.weekDay + 7 : this.weekDay
            const day = i - weekDay

            return {
              day,
              month: month + 1,
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

      if (this.weekDay === -1) return calendarStart.getDate() + 7

      return calendarStart.getDate()
    },

    lastDayCurrentMonth () {
      return new Date(this.year, this.month, 0).getDate()
    },

    lastDayLastMonth () {
      return new Date(this.year, this.month - 1, 0).getDate()
    },

    weekDay () {
      const weekDay = new Date(this.year, this.month - 1, 0).getDay()

      if (weekDay === 6) return weekDay - 7

      return weekDay
    }
  }
}

export default getCalendar

