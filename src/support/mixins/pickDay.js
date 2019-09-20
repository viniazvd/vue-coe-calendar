import { getFormattedDate } from '../services'

const pickDay = {
  methods: {
    pickDay ({ selectable, day, over }) {
      if (!selectable) return false

      const date = (day = this.day) => getFormattedDate(day, this.month, this.year)

      if (!this.isRange) {
        this.day = day
        this.internalDate = date()

        return
      }

      // this.internalDate.over = date(day)

      // case 1:
      // - initial date already selected
      // - end date already selected
      // - reset dates
      // - set initial date
      if (this.internalDate && this.internalDate.start && this.internalDate.end) {
        this.day = day
        this.finalDay = null

        this.internalDate = {
          start: date(),
          end: null,
          over: null
        }

        // case 2:
        // - no date selected yet
        // - set the initial date
      } else if (!this.day) {
        this.day = day

        this.internalDate = {
          start: date(),
          end: null,
          over: null
        }

      // case 3:
      // - initial date already selected
      // - set the end date
      } else {
        this.finalDay = day

        this.internalDate = {
          start: this.internalDate.start,
          end: day && date(day),
          over: null
          // over: date(over || day) // ?
        }
      }
    }
  }
}

export default pickDay
