<template>
  <div class="reset-container">
    <button @click="$emit('reset-date')">REDEFINIR</button>
  </div>
</template>

<script>
export default {
  name: 'coe-reset'
}
</script>

<style lang="scss">
.reset-container {
  padding: 5px;
  display: flex;
  justify-content: center;
}
</style>
