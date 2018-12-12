export default {
  bind (el, binding) {
    const handler = (e) => {
      if (!el.contains(e.target) && el !== e.target) {
        binding.value(e)
      }
    }
    el.__vueClickOutside__ = handler

    document.addEventListener('click', handler)
  },

  unbind (el) {
    document.removeEventListener('click', el.__vueClickOutside__)
    el.__vueClickOutside__ = null
  }
}
