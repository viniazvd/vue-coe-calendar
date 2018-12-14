export const months = {
  1: 'Janeiro',
  2: 'Fevereiro',
  3: 'Março',
  4: 'Maio',
  5: 'Abril',
  6: 'Junho',
  7: 'Julho',
  8: 'Agosto',
  9: 'Setembro',
  10: 'Outubro',
  11: 'Novembro',
  12: 'Dezembro'
}

export function getDay (date) {
  return date.split('/')[0]
}

export function getMonth (date) {
  return date.split('/')[1]
}

export function getYear (date) {
  return date.split('/')[2]
}

export function getFormattedDate (day, month, year) {
  if (month < 10) month = `0${month}`

  return `${day}/${month}/${year}`
}

export function getDate (date) {
  return +new Date(getYear(date), (getMonth(date) - 1), getDay(date))
}

function getDayBeforeMonth (year, month) {
  const date = new Date(year, month, 0)
  const day = date.getDay()
  const calendarStart = new Date(date)

  // get the difference till the first day of the week plus the offset to start the week at the given day
  const diff = calendarStart.getDate() - day
  calendarStart.setDate(diff)

  // in case the start date is further then the start of the month, set back with a week.
  if (calendarStart.getDate() > date.getDate()) return calendarStart.setDate(calendarStart.getDate() - 7)

  return calendarStart.getDate()
}

function getDayAfterMonth (year, month) {
  return new Date(year, month, 0).getDate()
}

// wip
export function isValid (date) {
  const day = +getDay(date)
  const month = +getMonth(date)
  const year = +getYear(date)

  const d = new Date(`${year}-${month}-${day}`)

  return date.length === 10 && ((Boolean(+d) && d.getDate() + 1) === day)
}

function isRange (day, month) {
  if (!this.internalDate) return false
  if (!this.internalDate.start || !this.internalDate.end) return false
  if (!this.isRange) return day === this.day && (month + 1) === this.initMonth

  const startDate = getDate(this.internalDate.start)
  const finalDate = getDate(this.internalDate.end)
  const loopDate = +new Date(this.year, (this.month - 1), day)

  return (loopDate >= startDate && loopDate <= finalDate) || (loopDate <= startDate && loopDate >= finalDate)
}

function isClicked (day, month, year) {
  if (!this.internalDate) return false

  const date = this.isRange ? this.internalDate.start : this.internalDate

  return (day === this.day) && (+getMonth(date) === month + 1) && (+getYear(date) === year)
}

export function getStartDate (day) {
  return +this.internalDate.start < +this.internalDate.end ? this.internalDate.start : getFormattedDate(day, this.month, this.year)
}

export function getEndDate (day) {
  return +this.internalDate.start < +this.internalDate.end ? getFormattedDate(day, this.month, this.year) : this.internalDate.start
}

export function getCalendar (year, month) {
  const dayBeforeMonth = getDayBeforeMonth(year, month)
  const dayAfterMonth = month => getDayAfterMonth(year, month)

  const isBeforeMonthStart = i => dayBeforeMonth + i <= dayAfterMonth(month)
  const isAfterMonthEnd = i => i - new Date(year, month, 0).getDay() > dayAfterMonth(month + 1)

  let calendar = []
  let day, tempDay, selectable, inRange, clicked

  for (let i = 0; i < 42; i++) {
    if (isBeforeMonthStart(i)) {
      tempDay = dayBeforeMonth + i

      day = tempDay
      selectable = false
      inRange = isRange.call(this, tempDay, month)
      clicked = false
    } else {
      if (isAfterMonthEnd(i)) {
        tempDay = i - dayAfterMonth(month + 1) - new Date(year, month, 1).getDay() + 1

        day = tempDay
        selectable = false
        inRange = isRange.call(this, tempDay, month)
        clicked = false
      } else {
        tempDay = i - new Date(year, month, 0).getDay()

        day = tempDay
        selectable = true
        inRange = isRange.call(this, tempDay, month)
        clicked = isClicked.call(this, tempDay, month, year)
      }
    }

    calendar.push({ day, month, selectable, inRange, clicked })
  }

  return calendar
}
