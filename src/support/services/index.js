export const months = {
  1: 'Janeiro',
  2: 'Fevereiro',
  3: 'Março',
  4: 'Abril',
  5: 'Maio',
  6: 'Junho',
  7: 'Julho',
  8: 'Agosto',
  9: 'Setembro',
  10: 'Outubro',
  11: 'Novembro',
  12: 'Dezembro'
}

export function getDay (date) {
  return date && date.split('/')[0]
}

export function getMonth (date) {
  return date && date.split('/')[1]
}

export function getYear (date) {
  return date && date.split('/')[2]
}

export function getFormattedDate (day, month, year) {
  if (month < 10) month = `0${month}`

  return `${day}/${month}/${year}`
}

export function getDate (date) {
  return +new Date(getYear(date), (getMonth(date) - 1), getDay(date))
}

export function getDataPerRow (calendar, row, month) {
  return calendar
    .slice((row  - 1) * 7, ((row  - 1) + 1) * 7)
    .filter(row => row.month === month)
}

export function getSelectedsPerRow (dataPerRow) {
  return dataPerRow.reduce((acc, { isRange, selectable }) => {
    if (isRange && selectable) acc += isRange

   return acc
  }, 0)
}
