<template>
  <div id="detail">

    <!--导航-->
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>

    <scroll class="content" ref="scroll" :probeType="3" @scroll="contentScroll">

      <!--<div>
        <ul>
          <li v-for="item in $store.state.cartList">
            {{item}}
          </li>
        </ul>
      </div>-->
      <!--轮播图-->
      <detail-swiper :top-images="topImages"></detail-swiper>

      <detail-base-info :goods="goods"></detail-base-info>

      <detail-shop-info :shop="shop"></detail-shop-info>

      <detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad"></detail-goods-info>

      <detail-param-info ref="params" :paramInfo="paramInfo"></detail-param-info>

      <detail-comment-info ref="comment" :commentInfo="commentInfo"></detail-comment-info>

      <detail-recommend-info ref="recommend" :recommend-list="recommendList"></detail-recommend-info>

    </scroll>

      <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>

    <back-top @click.native="backClick" v-if="isShowBackTop"></back-top>

    <toast :message="message" :show="show"></toast>

  </div>
</template>

<script>
    import DetailNavBar from './childComps/DetailNavBar'
    import DetailSwiper from './childComps/DetailSwiper'
    import DetailBaseInfo from './childComps/DetailBaseInfo'
    import DetailShopInfo from  './childComps/DetailShopInfo'
    import DetailGoodsInfo from './childComps/DetailGoodsInfo'
    import DetailParamInfo from './childComps/DetailParamInfo'
    import DetailCommentInfo from './childComps/DetailCommentInfo'
    import DetailRecommendInfo from "./childComps/DetailRecommendInfo";
    import DetailBottomBar from  './childComps/DetailBottomBar'

    import BackTop from 'components/content/backTop/BackTop'

    import Scroll from 'components/common/scroll/Scroll'

    import {getDetile,Goods,Shop,GoodsParam,getRecommend} from 'network/detile'

    import {debounce} from "common/utils";

    import Toast from 'components/common/toast/Toast'


    export default {
        name: "Detail",
        components: {
          DetailNavBar,
          DetailSwiper,
          DetailBaseInfo,
          DetailShopInfo,
          Scroll,
          DetailGoodsInfo,
          DetailParamInfo,
          DetailCommentInfo,
          DetailRecommendInfo,
          BackTop,
          DetailBottomBar,
          Toast

        },
        data() {
          return {
            iid: null,
            topImages: [],
            goods: {},
            shop: {},
            goodsInfo: {},
            detailInfo: {},
            paramInfo: {},
            commentInfo: {},
            recommendList: [],
            isShowBackTop: false,
            themeTopYs: [],
            getThemeTopY: null,
            currentIndex: 0,
            message:'',
            show: false
          }
        },
        created() {
          //看数据
          //console.log(this.$route.params);
          //保存传入的iid
          this.iid = this.$route.params.iid
          //根据iid请求详情数据
          getDetile(this.iid).then(res => {
            console.log(res)
            //获取数据
            const data = res.data.result
            //取出轮播图信息
            this.topImages = data.itemInfo.topImages
            //创建商品的对象
            this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
            //取出店铺信息
            this.shop = new Shop(data.shopInfo)
            //取出详细的信息
            this.detailInfo = res.data.result.detailInfo
            this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
            //取出评论信息
            if(data.rate.cRate !==0) {
              this.commentInfo = data.rate.list[0];
            }

            this.goodsInfo = data.itemInfo

          })
          getRecommend().then(res => {
            this.recommendList = res.data.data.list
          })

          this.getThemeTopY = debounce(() => {
            this.themeTopYs = []
            //商品的ref
            this.themeTopYs.push(0)
            //参数的ref
            this.themeTopYs.push(this.$refs.params.$el.offsetTop)
            //评论的ref
            this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
            //推荐的ref
            this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

            //console.log(this.themeTopYs);
          })

        },
        mounted() {

        },
        updated() {

        },
      methods: {
        imageLoad() {
            this.$refs.scroll.refresh()

            this.getThemeTopY()

          },
        backClick() {
          this.$refs.scroll.scrollTo(0,0,300)
        },
        contentScroll(position) {
            //判断BackTop是否显示
            this.isShowBackTop = (-position.y) > 1000
            //测试滚动是否生效
            //console.log(position);
            const positionY = -position.y
            //positionY和主题中的值进行对比
            //[0,7938,9120,9452]
            //positionY在0-7938之间,index = 0
            //positionY在7938-9120之间,index = 1
            //positionY在9120-9452之间,index = 2
            //positionY在9452之后,index = 3
            let length = this.themeTopYs.length
            for(let i = 0 ; i < this.themeTopYs.length; i++) {
              if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])||(i === length-1 && positionY >= this.themeTopYs[i]))) {
                  this.currentIndex = i
                //console.log(this.currentIndex);
                  this.$refs.nav.currentIndex = this.currentIndex
              }
            }
          },
        titleClick(index) {
            console.log(index)
            this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
          },
        addToCart() {
          //获取购物车需要展示的信息
          const product = {}
          product.img = this.topImages[0]
          product.title = this.goodsInfo.title
          product.desc = this.goodsInfo.desc
          product.price = this.goodsInfo.lowNowPrice
          product.iid = this.iid
          //将商品添加到购物车
          //this.$store.cartList.push(product)
          this.$store.dispatch('addCart',product).then(res => {
           /* this.show = true
            this.message = res
            setTimeout(() => {
              this.show = false
              this.message = ''
            },1500)
            console.log(res)*/
            this.$toast.show(res)
          })
        }
      }

    }
</script>

<style scoped>
 #detail {
   position: relative;
   z-index: 9;
   background-color: #fff;
   height: 100vh;
 }

 .detail-nav {
   position: relative;
   z-index: 9;
   background-color: #fff;
 }

  .content {
    height: calc(100% - 44px - 49px);
  }

</style>
