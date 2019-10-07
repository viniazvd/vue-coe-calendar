import { getDate, isBetween, getTimePeriod } from '../services/index'

const getCalendar = {
  methods: {
    isAfterMonthEnd (i) {
      return i - this.weekDay > this.lastDayCurrentMonth
    },

    isBeforeMonthStart (i) {
      return this.firstDayBeforeMonth + i <= this.lastDayLastMonth
    },

    getRange (day, month, year) {
      if (!this.date || !(this.date.start || this.date.day)) return false
      if (!this.isRange) return day === this.date.day && month === this.date.month && year === this.date.year

      const { start, end } = getTimePeriod(this.date)

      return isBetween(getDate(start), getDate(end), getDate({ day, month, year }))
    },

    isClicked (day, month, year) {
      if (!this.date || (this.isRange && !this.date.start)) return false

      const date = this.isRange ? this.date.start : this.date

      return (day === date.day) && (date.month === month + 1) && (date.year === year)
    },

    getCalendar (year, month) {
      return Array.from({ length: 42 }, (_, i) => {
        if (this.isBeforeMonthStart(i)) {
          const day = this.firstDayBeforeMonth + i

          return {
            day,
            month: month - 1,
            year,
            selectable: false,
            isRange: this.getRange(day, month - 1, year),
            clicked: false
          }
        } else {
          if (this.isAfterMonthEnd(i)) {
            const day = i - this.lastDayCurrentMonth - this.weekDay

            return {
              day,
              month: month + 1,
              year,
              selectable: false,
              isRange: this.getRange(day, month + 1, year),
              clicked: false
            }
          } else {
            const weekDay = this.weekDay === 6 ? this.weekDay + 7 : this.weekDay
            const day = i - weekDay

            return {
              day,
              month,
              year,
              selectable: true,
              isRange: this.getRange(day, month, year),
              clicked: this.isClicked(day, month, year)
            }
          }
        }
      })
    }
  },

  computed: {
    calendar () {
      return this.getCalendar(this.year, this.month)
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
