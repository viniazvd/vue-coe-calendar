/**
 * Transforms pieces of a date into a Date instance.
 * @param pieces - Date pieces.
 */
const parsePiecesToDate = (pieces) => new Date(pieces.year, pieces.month, pieces.date)

/**
 * Compare pieces of a date to values obtained from a Date instance.
 * @param pieces - Pieces of a date (date, month and year).
 * @param instance - A Date instance.
 */
const comparePiecesToDate = (
  pieces,
  instance = parsePiecesToDate(pieces)
) => (
  instance.getDate() === pieces.date &&
  instance.getMonth() === pieces.month &&
  instance.getFullYear() === pieces.year
)

/**
 * Brazilian date pattern.
 */
const pattern = /^\d{2}\/\d{2}\/\d{4}$/

const isDatePattern = (value) => pattern.test(value)

/**
 * Resolve a brazilian formatted date into date, month and year pieces.
 * @param value - A date in DD/MM/YYYY.
 */
const mapToPieces = (value) => {
  const expression = /^(\d{2})\/(\d{2})\/(\d{4})$/
  const [ , DD, MM, YYYY ] = expression.exec(value)

  return {
    date: parseInt(DD, 10),
    year: parseInt(YYYY, 10),
    month: parseInt(MM, 10) - 1,
  }
}

export default (value) => value.length === 10 && isDatePattern(value) && comparePiecesToDate(mapToPieces(value))
