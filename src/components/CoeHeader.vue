<template>
  <div class="header-container">
    <span class="monthHandler" @click="$emit('date-handler', '<')">‹</span>
    <span>{{ month }} {{ year }}</span>
    <span class="monthHandler" @click="$emit('date-handler', '>')">›</span>
  </div>
</template>

<script>

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Maio',
  'Abril',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
]

export default {
  name: 'coe-header',

  props: {
    month: {
      type: String,
      required: true,
      validator (month) {
        return months.some(m => m === month)
      }
    },
    year: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang="scss">
.header-container {
  padding: 10px;
  display: flex;
  justify-content: space-between;

  & > .monthHandler { cursor: pointer; }
}
</style>
