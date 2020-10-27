<template>
  <div class="botton-bar">
    <div class="check-content">
      <check-button :is-checked="isSelectAll" class="checked-button" @click.native="checkClick"></check-button>
      <span>全选</span>
    </div>

    <div class="price">
      合计： {{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      去计算 ({{checkLength}})
    </div>

  </div>
</template>

<script>
    import checkButton from 'components/content/checkButton/CheckButton'

    import {mapGetters} from 'vuex'

    export default {
        name: "CartBottonBar",
        components: {
          checkButton
        },
        computed: {
          ...mapGetters(['cartList']),
          totalPrice() {
            return '￥' + this.cartList.filter(item => {
              return item.checked
            }).reduce((preValue,item) => {
              return preValue + item .price * item.count
            },0).toFixed(2)
          },
          checkLength() {
            return this.cartList.filter(item => item.checked).length
          },
          isSelectAll() {
            //使用filter
            /*if(this.cartList.length === 0) return false*/
            /*return !(this.cartList.filter(item => !item.checked).length)*/
            //使用find
            /*if(this.cartList.length == 0) {
              return false
            }else {
              return !this.cartList.find(item => !item.checked)
            }*/
            //普通遍历
            if(this.cartList.length === 0) return false
            for(let item of this.cartList) {
              if(!item.checked) {
                return false
              }
            }
            return true
          }
        },
        methods: {
          checkClick() {
            if(this.isSelectAll) {
              this.cartList.forEach(item => item.checked = false)
            }else {
              this.cartList.forEach(item => item.checked = true)
            }
          },
          calcClick() {
            if(!this.isSelectAll) {
              this.$toast.show('请选择购买的商品',2000)
            }
          }
        }
    }
</script>

<style scoped>
  .botton-bar {
    height: 40px;
    background-color: #eee;
    position: relative;
    bottom: 10px;
    line-height: 40px;
    display: flex;

    font-size: 14px;
  }
  .check-content {
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 58px;
  }

  .checked-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }

  .price {
    margin-left: 20px;
    flex: 1;
  }

  .calculate {
    width: 80px;
    background: red;
    color: #fff;
    text-align: center;
  }
</style>
