<template functional>
  <div class="day-container">
    <div
      v-for="(day, index) in props.calendar"
      :key="index"
      class="day"
    >
      <span
        :class="[
          'value', {
            '-selectable': day.selectable,
            '-in-range': (day.isRange || day.clicked) && day.selectable,
            '-hide': props.showDisabledDays && !day.selectable
          }
        ]"
        @click="() => listeners['pick-day'](day)"
      >
        {{ day.day }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CoeDay',
  props: {
    calendar: {
      type: Array,
      required: true,
      validator: c => c.length === 42
    },
    showDisabledDays: Boolean
  }
}
</script>

<style lang="scss">
.day-container {
  width: 100%;
  display: flex;
  margin-top: 5px;
  text-align: center;
  flex-flow: row wrap;

  & > .day {
    height: 0;
    position: relative;
    width: calc(100% / 7);
    flex: 0 calc(100% / 7);
    margin-bottom: calc(100% / 7);

    & > .value { color: gray; }

    & > .-selectable {
      color: red;

      &:hover {
        padding: 5px;
        border: 1px solid black;
      }
    }

    & > .-in-range {
      padding: 5px;
      color: red;
      background-color: black;
    }

    & > .-in-range:not(.-selectable) {
      padding: unset;
      color: unset;
      background-color: unset;
    }

    & > .-hide { display: none; }
  }
}
</style>
