<template functional>
  <div class="reset-container">
    <button class="button" @click="listeners['reset-date']">Redefinir</button>
  </div>
</template>

<style lang="scss">
.reset-container {
  padding: 5px;
  height: 40px;
  display: flex;
  justify-content: center;

  & > .button {
    width: 100%;
    background: transparent;
    border: 1px solid #ccc;
    border-radius: 40px;
    font-size: 11px;
    text-transform: uppercase;
    padding: 0;
    cursor: pointer;
    outline: none;
  }
}
</style>
