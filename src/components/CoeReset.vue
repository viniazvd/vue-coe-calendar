<script>

// <template>
//   <div class="reset-container">
//     <button @click="$emit('reset-date')">REDEFINIR</button>
//   </div>
// </template>

export default {
  name: 'coe-reset',

  functional: true,

  render (h, { listeners }) {
    const button = [ h('button', { on: { click: listeners['reset-date'] } }, 'REDEFINIR') ]

    return h('div', {
      attrs: { class: 'reset-container' }
    }, [ button ])
  }
}
</script>

<style lang="scss">
.reset-container {
  padding: 5px;
  display: flex;
  justify-content: center;
}
</style>
