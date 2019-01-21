<template>
  <div class="options-selection">
    <div v-if="showMonths" class="months">
      <div
        v-for="(monthName, monthNumber) in months"
        :key="monthNumber"
        :class="monthClasses(monthNumber)"
        @click="$emit('set-month', +monthNumber)"
      >
        <span class="value">{{ monthName }}</span>
      </div>
    </div>

    <div v-else class="years">
      <div
        v-for="(_year, index) in years"
        :key="index"
        :class="yearClasses(_year)"
        :ref="_year === year ? 'year' : null"
        @click="$emit('set-year', +_year)"
      >
        <span class="value">{{ _year }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { months } from '../support/services'

export default {
  name: 'coe-selections',

  props: {
    showMonths: Boolean,
    showYears: Boolean,
    month: Number,
    year: Number
  },

  mounted () {
    if (this.$refs.year && this.$refs.year[0]) {
      this.$el.scrollTop = this.$refs.year[0].offsetTop - this.$refs.year[0].offsetWidth + 88
    }
  },

  computed: {
    months () {
      return months
    },

    years () {
      const before = Array.from({ length: 30 }).map((year, index) => (this.year + 1) + index)
      const after = Array.from({ length: 30 }).map((year, index) => this.year - index)

      return [ ...before, ...after ].sort((a, b) => a - b)
    }
  },

  methods: {
    monthClasses (month) {
      return [ 'month', { '-selected': +month === this.month } ]
    },

    yearClasses (year) {
      return [ 'year', { '-selected': +year === this.year } ]
    }
  }
}
</script>

<style lang="scss">
.options-selection {
  max-height: 400px;

  & > .months {
    display: flex;
    flex-direction: column;

    & > .month {
      opacity: 0.7;
      text-align: center;
      padding: { top: 8px; bottom: 8px; }

      & > .value {}

      &:hover {
        opacity: 1;
        color: white;
        background: linear-gradient(135deg, #BC4CF7 0%, #7873EE 100%);
      }
    }

    & .-selected {
      opacity: 1;
      color: white;
      background: linear-gradient(135deg, #BC4CF7 0%, #7873EE 100%);
    }
  }

  & > .years {
    display: flex;
    flex-direction: column;

    & > .year {
      width: 100%;
      opacity: 0.7;
      text-align: center;
      padding: { top: 5px; bottom: 5px; }

      & > .value {}

      &:hover {
        opacity: 1;
        color: white;
        background: linear-gradient(135deg, #BC4CF7 0%, #7873EE 100%);
      }
    }

    & .-selected {
      opacity: 1;
      color: white;
      background: linear-gradient(135deg, #BC4CF7 0%, #7873EE 100%);
    }

    & :first-child { padding-top: 9px; }
  }
}
</style>
