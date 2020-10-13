<template>
    <div class="tab-bar-item" @click="itemCLick">
      <div v-if="!isActive"><slot name="item-icon"></slot></div>
      <div v-else><slot name="item-icon-active"></slot></div>
      <div :style="activeStyle"><slot name="item-text"></slot></div>
    </div>
</template>

<script>
  export default {
    name: "TabbariItem",
    props:{
      path:String,
      activeColor:{
        type:String,
        default:'red'
      }
    },
    data() {
      return {
        /*isActive:true*/
      }
    },
    computed:{
      isActive() {
        return this.$route.path.indexOf(this.path) !== -1
      },
      activeStyle() {
        return this.isActive ? {color:this.activeColor} : {}
      }
    },
    methods: {
      itemCLick() {
        this.$router.replace(this.path)
      }
    }
  }
</script>

<style scoped>
  .tab-bar-item {
    flex: 1;
    height: 49px;
    margin-top: 5px;
    font-size: 15px;
  }
  .tab-bar-item img {
    width: 22px;
    height: 22px;
    margin-top: 1px;
  }
</style>
