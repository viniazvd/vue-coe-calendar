export function getDay (date) {
  return date.split('/')[0]
}

export function getMonth (date) {
  return date.split('/')[1]
}

export function getYear (date) {
  return date.split('/')[2]
}

export function getDate (date) {
  let { day, month, year } = date

  if (month < 10) month = `0${month}`

  return `${day}/${month}/${year}`
}

export function getDaysInMonth (date) {
  return new Date(getYear(date), getMonth(date) + 1, 0).getDate()
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

export function getCalendar (year, month) {
  const dayBeforeMonth = getDayBeforeMonth(year, month)
  const dayAfterMonth = month => getDayAfterMonth(year, month)

  const isBeforeMonthStart = i => dayBeforeMonth + i <= dayAfterMonth(month)
  const isAfterMonthEnd = i => i - new Date(year, month, 0).getDay() > dayAfterMonth(month + 1)

  let calendar = []
  let day, selectable

  for (let i = 0; i < 42; i++) {
    if (isBeforeMonthStart(i)) {
      day = dayBeforeMonth + i
      selectable = false
    } else {
      if (isAfterMonthEnd(i)) {
        day = i - dayAfterMonth(month + 1) - new Date(year, month, 1).getDay() + 1
        selectable = false
      } else {
        day = i - new Date(year, month, 0).getDay()
        selectable = true
      }
    }

    calendar.push({ day, selectable })
  }

  return calendar
}

export function getMonthName (index) {
  const month = {
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

  return month[index]
}
