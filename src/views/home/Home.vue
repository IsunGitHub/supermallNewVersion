<template>
  <div id="home">
    <!--顶部条-->
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <tab-control class="tab-control"
                 :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 v-show="isTabFixed"
    >
    </tab-control>

   <scroll class="content"
           ref="scroll"
           :probeType="3"
           @scroll="contentScroll"
           :pullUpLoad="true"
           @pullingUp="loadMore"
   >
     <!--轮播图-->
     <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
     <!--推荐展示区-->
     <RecommendView :recommends="recommends"></RecommendView>
     <!--本周流行展示区-->
     <feature-view></feature-view>
     <!--选择区分栏-->
     <tab-control :titles="['流行','新款','精选']"
                  @tabClick="tabClick"
                  ref="tabControl2"
     >
     </tab-control>

     <good-list :goods="showGoods"></good-list>


   </scroll>

     <back-top @click.native="backClick" v-if="isShowBackTop"></back-top>
  </div>

</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from'./childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'

  import {getHomeMultidata,getHomeGoods} from 'network/home'
  import {debounce} from 'common/utils'


 /* import Swiper from 'components/common/swiper/Swiper'
  import SwiperItem from 'components/common/swiper/SwiperItem'*/


  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodList,
      Scroll,
      BackTop
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop' : {page: 0, list: []},
          'new' : {page: 0, list: []},
          'sell' : {page: 0, list: []}
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      },
    },
    destroyed() {
      //销毁
      //console.log('home destroyed')
    },
    activated() {
      //活跃
      //console.log('activated');
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      //非活跃
      //console.log('deactivated');
      this.saveY = this.$refs.scroll.getScrollY()
    },
    created() {
      //请求多个数据
      this.getHomeMultidata()

      //请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    mounted() {
      //图片加载完成的事件监听
      const refresh = debounce(this.$refs.scroll.refresh,50)

      this.$bus.$on('itemImageLoad',() => {
        //console.log('----');
        //this.$refs.scroll.refresh()
        refresh()
      })
    },
    methods: {
      /*事件监听相关的方法*/
      tabClick(index) {
        //console.log(index);
        switch (index) {
            case 0:
              this.currentType = 'pop'
                break
            case  1:
              this.currentType = 'new'
                break
            case 2:
              this.currentType = 'sell'
                break
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      backClick() {
        this.$refs.scroll.scrollTo(0,0)
      },
      contentScroll(position) {
        //判断BackTop是否显示
        this.isShowBackTop = (-position.y) > 1000
        //决定tabControl是否吸顶
        this.isTabFixed = (-position.y) > this.tabOffsetTop
        //console.log(position.y)
      },
      loadMore() {
        //console.log('上拉加载更多loadMore')
        this.getHomeGoods(this.currentType)
        this.$refs.scroll.finishPullUp()
      },
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },

      /*网络请求相关的方法*/
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          //console.log(res);
          this.banners = res.data.data.banner.list
          this.recommends = res.data.data.recommend.list
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then((res) => {
          //console.log(res)
          this.goods[type].list.push(...res.data.data.list)
          this.goods[type].page += 1

          this.$refs.scroll.finishPullUp()
        })
      },
    }
  }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    position: relative;
    height: 100vh;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: white;

 /*   position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9;*/
  }



  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }
/*  .content {
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 51px;
  }*/
</style>
