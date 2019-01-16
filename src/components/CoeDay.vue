<template functional>
  <div class="day-container">
    <div
      v-for="(day, index) in props.calendar"
      :key="index"
      :class="[
        'day', {
          '-selectable': day.selectable,
          '-in-range': (day.isRange || day.clicked) && day.selectable,
          '-hide': props.showDisabledDays && !day.selectable
        }
      ]"
      @click="() => listeners['pick-day'](day)"
    >
      <span class="value">{{ day.day }}</span>
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
  display: flex;
  margin-top: 5px;
  text-align: center;
  flex-flow: row wrap;

  & > .day {
    border-radius: 20px;
    flex: 0 calc(100% / 7);
    margin: { top: 2.5px; bottom: 2.5px; }
    padding: { top: 10px; bottom: 10px; }

    &.-selectable {
      opacity: 0.7;

      &:hover {
        opacity: 1;
        border: unset;
        color: #FFFFFF;
        background: linear-gradient(135deg, #BC4CF7 0%, #7873EE 100%);
      }
    }

    &.-in-range {
      opacity: 1;
      color: #FFFFFF;
      background: linear-gradient(135deg, #BC4CF7 0%, #7873EE 100%);
    }

    &.-in-range:not(.-selectable) {
      color: unset;
      padding: unset;
      background-color: unset;
    }

    &.-hide { display: none; }

    & > .value { font-size: 14px; }
  }

  & > .day:not(.-selectable) { opacity: 0.2; }
}
</style>
