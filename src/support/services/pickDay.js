import { getFormattedDate } from './'

export function rangeOption (day) {
  const setStartDate = () => {
    this.internalDate = {
      start: getFormattedDate(this.day, this.month, this.year),
      end: null
    }
  }

  const setFullDate = () => {
    this.internalDate = {
      start: this.internalDate.start,
      end: getFormattedDate(day, this.month, this.year)
    }
  }

  const setBothSelecteds = () => {
    this.internalDate = null
    this.day = day
    this.finalDay = null

    setStartDate()
  }

  const setNoSelecteds = () => {
    this.day = day

    setStartDate()
  }

  const setStartSelected = () => {
    this.finalDay = day

    setFullDate()
  }

  const option = {
    bothSelecteds: this.internalDate && this.internalDate.start && this.internalDate.end,
    noSelecteds: !this.day,
    startSelected: true
  }

  const action = {
    bothSelecteds: setBothSelecteds,
    noSelecteds: setNoSelecteds,
    startSelected: setStartSelected
  }

  const type = Object.keys(option).find(prop => option[prop])

  return action[type]()
}
