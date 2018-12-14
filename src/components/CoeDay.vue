<template>
  <div class="day-container">
    <div v-for="(λ, index) in calendar" :key="index" class="day">
      <span :class="dayClasses(λ)" @click="$emit('pick-day', λ)">
        {{ λ.day }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'coe-day',

  props: {
    calendar: {
      type: Array,
      required: true,
      validator (c) {
        return c.length === 42
      }
    }
  },

  methods: {
    dayClasses ({ selectable, day, month, inRange, clicked }) {
      return [
        'value',
        {
          '-selectable': selectable,
          '-in-range': inRange || clicked
        }
      ]
    }
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
  }
}
</style>
