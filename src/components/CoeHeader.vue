<template>
  <div class="header-container">
    <span class="monthHandler" @click="$emit('date-handler', '<')">‹</span>
    <div class="date-preview">
      <span @click="$emit('show-months')">{{ month }}</span>
      <span @click="$emit('show-years')">{{ year }}</span>
    </div>
    <span class="monthHandler" @click="$emit('date-handler', '>')">›</span>
  </div>
</template>

<script>

import { months } from '../support/services'

export default {
  name: 'coe-header',

  props: {
    month: {
      type: String,
      required: true,
      validator (month) {
        return Object.values(months).some(m => m === month)
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

  & > .date-preview {
    cursor: pointer;

    & :first-child { padding-right: 10px; }
  }
}
</style>
