export function getDayBeforeMonth (year, month) {
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

export function getDayAfterMonth (year, month) {
  return new Date(year, month, 0).getDate()
}
