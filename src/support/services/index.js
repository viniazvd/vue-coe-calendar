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
  return date.split('/')[0] || date.split('-')[0]
}

export function getMonth (date) {
  return date.split('/')[1] || date.split('-')[1]
}

export function getYear (date) {
  return date.split('/')[2] || date.split('-')[2]
}

export function getFormattedDate (day, month, year) {
  if (month < 10) month = `0${month}`

  return `${day}/${month}/${year}`
}

export function getDate (date) {
  return +new Date(getYear(date), (getMonth(date) - 1), getDay(date))
}

// wip
export function isValid (date) {
  const day = +getDay(date)
  const month = +getMonth(date)
  const year = +getYear(date)

  const d = new Date(`${year}-${month}-${day}`)

  return date.length === 10 && ((Boolean(+d) && d.getDate() + 1) === day)
}
