export function getDay (date) {
  return date.split('/')[0]
}

export function getMonth (date) {
  return date.split('/')[1] - 2
}

export function getYear (date) {
  return date.split('/')[2]
}

export function getDaysInMonth (date) {
  return new Date(getYear(date), getMonth(date) + 1, 0).getDate()
}

function getDayBeforeMonth (year, month) {
  const date = new Date(year, month, 0)
  const day = date.getDay()

  // create a new date instance because we don't want to edit the original object
  const calendarStart = new Date(date)

  const coe = new Date(year, month + 1, 0).getDay()

  // get the difference till the first day of the week plus the offset to start the week at the given day
  const diff = calendarStart.getDate() - day + (coe === 0 ? -7 : 0)
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
  const isDayCurrentMonth = i => i - new Date(year, month, 0).getDay() > dayAfterMonth(month + 1)

  let calendar = []
  let day = 0

  for (let i = 0; i < 42; i++) {
    if (isBeforeMonthStart(i)) {
      day = dayBeforeMonth + i
    } else {
      if (isDayCurrentMonth(i)) {
        day = i - dayAfterMonth(month + 1) - new Date(year, month, 1).getDay() + 1
      } else {
        day = i - new Date(year, month, 0).getDay()
      }
    }

    calendar.push({ day })
  }

  return calendar
}
