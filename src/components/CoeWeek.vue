<template functional>
  <div class="week-container">
    <div
      v-for="(day, index) in ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']"
      :key="index"
      class="week"
    >
      <span class="value">{{ day }}</span>
    </div>
  </div>
</template>

<style lang="scss">
.week-container {
  display: grid;
  grid-column-gap: 10px;
  justify-content: center;
  grid-template-columns: repeat(7, 30px);

  & > .week {
    width: 100%;
    text-align: center;

    & > .value {
      font-size: 11px;
      text-transform: uppercase;
      color: rgba(18, 30, 72, 0.3);
    }
  }
}
</style>
