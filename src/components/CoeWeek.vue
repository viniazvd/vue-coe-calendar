<template functional>
  <div class="week-container">
    <div
      v-for="(day, index) in ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']"
      :key="index"
      class="week"
    >
      <span class="value">{{ day }}</span>
    </div>
  </div>
</template>

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
