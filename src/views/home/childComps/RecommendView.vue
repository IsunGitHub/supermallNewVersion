<template>
  <div class="recomend">
    <div v-for="item in recommends" class="recomendItem">
      <a :href="item.link">
        <img :src="item.image">
        <div>{{item.title}}</div>
      </a>
    </div>
  </div>
</template>

<script>
    export default {
        name: "RecommendView",
        props: {
          recommends: {
            type: Array,
            default() {
              return []
            }
          }
        }
    }
</script>

<style scoped>
  .recomend {
    display: flex;
    width: 100%;
    text-align: center;
    font-size: 12px;

    padding: 10px 0 20px;
    border-bottom: 8px solid #eeeeee;
  }
  .recomendItem {
    flex: 1;
  }

  .recomendItem img {
    width: 65px;
    height: 65px;
    margin-bottom: 10px;
  }

</style>
