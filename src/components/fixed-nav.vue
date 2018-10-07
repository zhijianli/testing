 <template>


  <nav class="fixed_nav">
    <router-link to="/">
      <span class="one_fixed_nav" @click="$store.state.displayPage = 1">
        <!-- <svg v-if="returnPageNow == 'homepage'">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#index.18edf5a"></use>
        </svg>
        <svg v-if="returnPageNow !== 'homepage'">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#index-regular.b245d60"></use>
        </svg> -->

            <img class="imgUrl" :src="indexImgUrl">
            <!-- $store.state.displayPage == 1 ? 'color = #FFF' : 'color = #000' -->
        <span>首页</span>
      </span>
    </router-link>

    <router-link to="/classify">
      <span class="one_fixed_nav" @click="$store.state.displayPage = 2">
        <!-- <svg v-if="returnPageNow == 'order'">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#order.070ae2a"></use>
        </svg>
        <svg v-if="returnPageNow !== 'order'">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#order-regular.41c17f8"></use>
        </svg> -->
        <img class="imgUrl" :src="classifyImgUrl">
        <span>分类</span>
      </span>
    </router-link>

    <router-link to="/selftest">
      <span class="one_fixed_nav" @click="$store.state.displayPage = 3">
        <!-- <svg v-if="returnPageNow == 'myzone'">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#profile.dbc5ebf"></use>
        </svg>
        <svg v-if="returnPageNow !== 'myzone'">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#profile-regular.c151d62"></use>
        </svg> -->
        <img class="imgUrl" :src="selfImgUrl">
        <span>我的测试</span>
      </span>
    </router-link>
  </nav>
</template>

<script>

import indexImgUrl from '../assets/index.png'
import classifyImgUrl from '../assets/classify.png'
import selfImgUrl from '../assets/myHomePage.png'
import indexImgGrayUrl from '../assets/index-gray.png'
import classifyImgGrayUrl from '../assets/classify-gray.png'
import selfImgGrayUrl from '../assets/myHomePage-gray.png'

export default {
  name: 'fixed_nav',
  data () {
    return {
        indexImgUrl:'',
        classifyImgUrl:'',
        selfImgUrl:''
    };
  },
  mounted () {
    // setInterval(() => {
    //   // console.log(this.returnPageNow);
    // }, 2000);

    if(this.$store.state.displayPage==1){
      this.indexImgUrl = indexImgUrl;
      this.classifyImgUrl = classifyImgGrayUrl;
      this.selfImgUrl = selfImgGrayUrl;
    }else if(this.$store.state.displayPage==2){
      this.indexImgUrl = indexImgGrayUrl;
      this.classifyImgUrl = classifyImgUrl;
      this.selfImgUrl = selfImgGrayUrl;
    }else if(this.$store.state.displayPage==3){
      this.indexImgUrl = indexImgGrayUrl;
      this.classifyImgUrl = classifyImgGrayUrl;
      this.selfImgUrl = selfImgUrl;
    }else{
      this.indexImgUrl = indexImgGrayUrl;
      this.classifyImgUrl = classifyImgGrayUrl;
      this.selfImgUrl = selfImgGrayUrl;
    }

  },
  computed: {
    returnPageNow () {
      return this.$store.getters.getwhichpage;
    }
  },
  methods: {

  }
};
</script>
  <!-- lang="less"  -->
<style scoped>
  .fixed_nav{
     width:7.5rem;
     /* margin-left:1.35rem; */
     height:1.2rem;
     /* background:#20B2AA; */
     background:#FFF;
     position:fixed;
     left:0;
     right:0;
     bottom:0;
     font-size: .28rem;
     z-index: 999;
     svg{
      width:.45rem;
      height: .45rem;
      display:block;
      margin: .2rem auto .1rem;
     }
     .one_fixed_nav{
      width:32.6%;
      display:inline-block;
      height:1.2rem;
      text-align:center;
     }

     .imgUrl{
       margin-top:.05rem;
       margin-left:.95rem;
       margin-bottom: .15rem;
       width: 0.6rem;
     }
     .isblue{
       color: #0ba8f0;
     }
  }
</style>
