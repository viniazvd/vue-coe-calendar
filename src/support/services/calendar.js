export function firstDayBeforeMonth (year, month) {
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

export const lastDayCurrentMonth = (year, month) => new Date(year, month + 1, 0).getDate()

export const lastDayLastMonth = (year, month) => new Date(year, month, 0).getDate()

export const isBeforeMonthStart = (year, month, i) => firstDayBeforeMonth(year, month) + i <= lastDayLastMonth(year, month)

export const isAfterMonthEnd = (year, month, i) => i - new Date(year, month, 0).getDay() > lastDayCurrentMonth(year, month)

export const weekDay = (year, month) => new Date(year, month, 0).getDay()

// WIP
export const firstDayAfterMonth = (year, month) => new Date(year, month, 1).getDay() - (new Date(year, month, 1).getDay() === 0 ? 6 : - 1)
