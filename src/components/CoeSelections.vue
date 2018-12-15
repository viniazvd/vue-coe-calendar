<template>
  <div class="options-selection">
    <select
      v-if="showMonths"
      :value="month"
      @input="month => $emit('set-month', +month.target.value)"
      @change="$emit('close')"
    >
      <option disabled value="">Escolha um mês</option>
      <option v-for="(month, index) in months" :key="month" :value="+index">
        {{ month }}
      </option>
    </select>

    <select
      v-else
      :value="year"
      @input="year => $emit('set-year', +year.target.value)"
      @change="$emit('close')"
    >
      <option disabled value="">Escolha um ano</option>
      <option v-for="(year, index) in years" :key="index" :value="year">
        {{ year }}
      </option>
    </select>
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

  computed: {
    months () {
      return months
    },

    years () {
      const before = Array.from({ length: 30 }).map((year, index) => this.year + index)
      const after = Array.from({ length: 30 }).map((year, index) => this.year - index)

      return [ ...before, ...after ].sort((a, b) => a - b)
    }
  }
}
</script>
