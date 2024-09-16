<template>
  <div  id="app" class="login_box">
    <!-- <Backbar title="登录"></Backbar> -->
    <div class="input_login">

         <!--  <input type="search" placeholder="用户名" v-model="uname" maxlength="18" autocapitalize="off">
      <input type="password" placeholder="密码" v-model="pwd" maxlength="18" @keydown.enter="cheack_n_p"> 
      <button @click="cheack_n_p">登录</button> -->
          <div align="center">  <img class="zhiji-image" src="../assets/zhiji.png"></div>
                <p class="shijie-text">这个世界并不完美，<br><br>但我们终究可以疗愈自己。</p>
            <div class="wechat-login">用微信登录，体验更多测试</div> 

    </div>

    <!-- 撑开Fixednav挡住的位置 -->
    <!-- <div class="space"></div> -->
    <!-- 固定导航栏 -->
    <!-- <fixednav></fixednav> -->

  </div>
</template>

 <script>

 import {getResponseGeneral} from "api"
 import {getURLParams} from "utils"
import {mapState} from "vuex"
import fixednav from 'components/fixed-nav';

export default {
  data() {
    return {
      loading: false
    }
  },
  asyncData({store}) {
    return store.dispatch("getHomeData").catch((error) => {
      console.log(error.msg)
    })
  },
//   mounted () {
//     if (this.getLogin) {
//       this.$router.replace('/myzone');
//     }
//   },
//   methods: {
//      cheack_n_p () {
//        if (this.uname === '' || this.pwd === '') {
//         alert('用户名或密码不能为空');
//          return;
//        }
   //    if (this.uname !== this.getuname || this.pwd !== this.getpwd) {
   //    if (this.uname !== "111" || this.pwd !== "111") {
   //       alert('用户名或密码错误');
   //     } else {
   //      this.$store.dispatch('setLogin', true);
   //      this.$router.replace('/myzone');
   //    }
   //  }
  // },
  components: {
    fixednav
  }
};
</script>

<style lang="less" scoped>
.input_login{
  text-align: center;
  margin-top: 25%;
  input{
    height: 1rem;
    width: 10rem;
    padding:.6rem;
    box-sizing:border-box;
    border:none;
    outline:none;
    font-size:.45rem;
    display:block;
  }
  button{
    margin: .6rem auto;
    display:block;
    width: 9rem;
    height: 1rem;
    font-size:.5rem;
    background:#4cd964;
    border:none;
    outline:none;
    color:#fff;
    border-radius:.1rem;
  }

}

.zhiji-image{
  width:20%;
  height:20%;
}
.shijie-text{
  margin-top:.5rem;
  color:#0ba8f0;
  font-size:.26rem;
}
.wechat-login{
  width:70%;
  height:.75rem;
  line-height:.75rem;
  align:center;
  margin-top:1.5rem;
  margin-left:15%;
  color:#FFFFFF;
  background:#0ba8f0;
  font-size:.3rem;
  border-radius:.05rem
}

</style>
