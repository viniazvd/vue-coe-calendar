<template>
  <div class="week-container">
    <div v-for="(weekDay, index) in ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']" :key="index" class="week">
      <span class="value">{{ weekDay }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'coe-week'
}
</script>

<style lang="scss">
.week-container {
  display: flex;

  & > .week {
    width: 100%;
    text-align: center;
    padding: 5px;

    & > .value {
      padding-bottom: 5px;
      display: block;
    }
  }
}
</style>
