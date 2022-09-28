<script>

// <template>
//   <div class="header-container">
//     <div class="container">
//       <span class="monthHandler" @click="$emit('input', '<')">‹</span>
//       <div class="date-preview">
//         <span @click="$emit('show-months')">{{ month }}</span>
//         <span @click="$emit('show-years')">{{ year }}</span>
//       </div>
//       <span class="monthHandler" @click="$emit('input', '>')">›</span>
//     </div>
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

    year: Number,

    isRange: Boolean
  },

  render (h, { props, listeners }) {
    const handler = (symbol, option) => h('span', {
      attrs: { class: 'monthHandler' },
      on: {
        click: (e) => {
          listeners['input']({ key: null }, option)
          e.stopPropagation()
        }
      }
    }, symbol)

    const decrementHandler = [ handler('‹', '<') ]

    const month = [ h('span', {
      on: {
        click: (e) => {
          !props.isRange ? listeners['show-months']() : null
          e.stopPropagation()
        }
      }
    }, [ getMonthName(props.month) ]) ]

    const year = [ h('span', {
      on: {
        click: (e) => {
          !props.isRange ? listeners['show-years']() : null
          e.stopPropagation()
        }
      }
    }, [ props.year ]) ]

    const datePreview = [ h('div', { attrs: { class: 'date-preview' } }, [ month, year ]) ]

    const incrementalHandler = [ handler('›', '>') ]

    const container = [ h('div', {
      attrs: { class: 'container' },
    }, [
      decrementHandler,
      datePreview,
      incrementalHandler
    ]) ]

    return h('div', {
      attrs: { class: 'header-container' }
    }, [ container ])
  }
}
</script>

<style lang="scss">
.header-container > .container {
  padding: 15px 25px;
  display: flex;
  justify-content: space-between;

  & > .monthHandler { cursor: pointer; }

  & > .date-preview {
    cursor: pointer;
    font-size: 14px;
    text-transform: uppercase;
    font-weight: 700;

    & :first-child { padding-right: 10px; }
  }
}
</style>
