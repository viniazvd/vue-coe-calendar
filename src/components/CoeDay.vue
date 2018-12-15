<script>

// <template>
//   <div class="day-container">
//     <div v-for="(λ, index) in calendar" :key="index" class="day">
//       <span :class="dayClasses(λ)" @click="$emit('pick-day', λ)">
//         {{ λ.day }}
//       </span>
//     </div>
//   </div>
// </template>

function dayClasses (showDisabledDays, { selectable, day, month, inRange, clicked }) {
  return [
    'value',
    {
      '-selectable': selectable,
      '-in-range': (inRange || clicked) && selectable,
      '-hide': showDisabledDays && !selectable
    }
  ]
}

export default {
  name: 'coe-day',

  functional: true,

  props: {
    calendar: {
      type: Array,
      required: true,
      validator (c) {
        return c.length === 42
      }
    },
    showDisabledDays: Boolean
  },

  render (h, { props, listeners }) {
    const days = props.calendar.map((λ, index) => {
      return [ h('div', { attrs: { class: 'day' } }, [
        h('span', {
          class: dayClasses(props.showDisabledDays, λ),
          on: { click: () => listeners['pick-day'](λ) }
        }, λ.day)
      ]) ]
    })

    return h('div', {
      attrs: { class: 'day-container' }
    }, [ days ])
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
