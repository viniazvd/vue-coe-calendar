<script>

// <template>
//   <div class="header-container">
//     <span class="monthHandler" @click="$emit('date-handler', '<')">‹</span>
//     <div class="date-preview">
//       <span @click="$emit('show-months')">{{ month }}</span>
//       <span @click="$emit('show-years')">{{ year }}</span>
//     </div>
//     <span class="monthHandler" @click="$emit('date-handler', '>')">›</span>
//   </div>
// </template>

import { months } from '../support/services'

const getMonthName = monthIndex => months[monthIndex]

export default {
  name: 'coe-header',

  functional: true,

  props: {
    month: {
      type: Number,
      validator: m => m >= 1 && m <= 12
    },
    year: Number
  },

  render (h, { props, listeners }) {
    const handler = (symbol, option) => h('span', {
      attrs: { class: 'monthHandler' },
      on: { click: () => listeners['date-handler']({ key: null }, option) }
    }, symbol)

    const decrementHandler = [ handler('‹', '<') ]

    const month = [ h('span', { on: { click: listeners['show-months'] } }, [ getMonthName(props.month) ]) ]

    const year = [ h('span', { on: { click: listeners['show-years'] } }, [ props.year ]) ]

    const datePreview = [ h('div', { attrs: { class: 'date-preview' } }, [ month, year ]) ]

    const incrementalHandler = [ handler('›', '>') ]

    return h('div', {
      attrs: { class: 'header-container' }
    }, [
      decrementHandler,
      datePreview,
      incrementalHandler
    ])
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
