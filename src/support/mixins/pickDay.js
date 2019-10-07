const pickDay = {
  methods: {
    pickDay ({ selectable, day, month, year }) {
      if (!selectable) return false

      const date = (day = this.date.start.day) => ({ day, month: this.month, year: this.year })

      if (!this.isRange) {
        this.date = { day, month, year }

        return
      }

      // this.internalDate.over = date(day)

      // case 1:
      // - initial date already selected
      // - end date already selected
      // - reset dates
      // - set initial date
      if (this.date && this.date.start && this.date.end) {
        this.date.start = date(day)
        this.date.end = null
        this.date.over = null

        // case 2:
        // - no date selected yet
        // - set the initial date
      } else if (!this.date.start.day) {
        this.date.start = date()
        this.date.end = null
        this.date.over = null

      // case 3:
      // - initial date already selected
      // - set the end date
      } else {
        this.date.end = date(day)
        this.date.over = null
      }
    }
  }
}

export default pickDay
