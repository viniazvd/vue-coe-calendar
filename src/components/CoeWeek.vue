<script>

// <template>
//   <div class="week-container">
//     <div v-for="(weekDay, index) in ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']" :key="index" class="week">
//       <span class="value">{{ weekDay }}</span>
//     </div>
//   </div>
// </template>

const weeksArray = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

export default {
  name: 'coe-week',

  functional: true,

  render (h) {
    const weeks = weeksArray.map((weekDay, index) => {
      return [ h('div', { attrs: { class: 'week' } }, [
        h('span', { class: 'value' }, weekDay) ])
      ]
    })

    return h('div', {
      attrs: { class: 'week-container' }
    }, [ weeks ])
  }
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
