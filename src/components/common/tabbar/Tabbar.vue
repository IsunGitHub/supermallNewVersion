<template>
  <div id="tab-bar">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "Tabbar"
  }
</script>

<style scoped>
  #tab-bar {
    background-color: #f6f6f6;
    display: flex;
    text-align: center;
    justify-content: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }

</style>
