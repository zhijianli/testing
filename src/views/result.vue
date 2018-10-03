
<style src="css/result"></style>

<template>
  <div id="app" class="result-view" @touchstart="index = -1">
    <div class="result-box result-title">
      {{result.relateTestScaleName}}
      <span class="share-result-btn" @click="shareResult" v-if="isAPP"></span>
    </div>

    <div class="result-box pei-image" v-if="result.tsqMessage.qualitativeImage">
      <img :src="prefix + result.tsqMessage.qualitativeImage + suffix">
    </div>

    <div class="result-box testing-result" :class="{'no-btn': ! isShow}">
      <h2 class="testing-result-title" v-text="result.relateQualitativeName"></h2>

      <!-- <div class="result-box result-chart" v-if="result.isShowDimensionProfile === 0"> -->
      <div class="result-box result-chart" v-if="result.isShowDimensionProfile === 0">
        <div class="score">
          <span v-text="item" v-for="(item,index) of scoreList" :key="index"></span>
        </div>
        <div class="result-chart-content">
          <div class="result-chart-line-wrapper">
            <div class="line" v-for="(item,index) of scoreList" :key="index"></div>
          </div>
          <div class="zhu-wrapper">

            <ul @touchstart="index = -1" v-if="result.relateDisplayMode === 0">
              <li v-for="(item, i) of result.tsodnList" @click.stop="showScore(item, $event)" v-if="item.isShowDimension === 0" :key="i">

                <template v-if="item.dimensionScore">
                  <div class="zhu" :style="{height: item.dimensionScore * 0.484  + 'rem'}"></div>
                </template>
                <template v-else>
                  <div class="zhu" :style="{height: '2px'}"></div>
                </template>

                <p v-text="item.dimensionName"></p>
              </li>
            </ul>
            <ul @touchstart="index = -1" v-if="result.relateDisplayMode === 1">
              <li v-for="(item, i) of result.tsodnList" @click.stop="showScore(item, $event)" v-if="item.isShowDimension === 0" :key="i">
                <div class="zhu" :style="{height: (((item.dimensionScore - 10) / 10 * 60) / 100) + 'rem'}"></div>
                <p v-text="item.dimensionName"></p>
              </li>
            </ul>
            <ul @touchstart="index = -1" v-if="result.relateDisplayMode === 2">
              <li v-for="(item, i) of result.tsodnList" @click.stop="showScore(item, $event)" v-if="item.isShowDimension === 0" :key="i">
                <div class="zhu" :style="{height: ((item.dimensionScore - -4) * (4.84 / 8)) + 'rem'}"></div>
                <p v-text="item.dimensionName"></p>
              </li>
            </ul>
          </div>

          <transition name="dd">
            <div class="show-score" :style="{top: scoreTop, left: scoreLeft}" v-if="index === 0">
              {{score}}
              <span>正常：{{lowScore}}-{{highScore}}</span>
            </div>
          </transition>

          <transition name="dd">
            <div class="show-lat" :style="{top: scoreTop, left: scoreLeft}" v-if="index === 1">
              <span v-text="weidu"></span>
            </div>
          </transition>
        </div>
      </div>

      <div class="testing-result-item" v-if="result.userName">
        <span>测试人：</span>
        <p>{{result.userName}} {{result.sex === 'man' ? '男' : '女'}} {{result.birthday | bFormat}}岁</p>
      </div>
      <div class="testing-result-item" v-if="result.tsqMessage.briefIntroduction">
        <span>简介：</span>
        <p v-text="result.tsqMessage.briefIntroduction"></p>
      </div>
      <div class="testing-result-item" v-if="result.tsqMessage.concept">
        <span>概念解释：</span>
        <p v-text="result.tsqMessage.concept"></p>
      </div>
      <div class="testing-result-item" v-if="result.tsqMessage.advantage">
        <span>优势：</span>
        <p v-text="result.tsqMessage.advantage"></p>
      </div>
      <div class="testing-result-item" v-if="result.tsqMessage.inferiority">
        <span>劣势：</span>
        <p v-text="result.tsqMessage.inferiority"></p>
      </div>
      <div class="testing-result-item" v-if="result.tsqMessage.proposal">
        <span>分析与建议：</span>
        <p v-html="result.tsqMessage.proposal"></p>
      </div>
      <div class="btn-wrapper" v-if="isShow">
        <div class="btn retesting-btn" @click="retest">重新测试</div>
        <div class="btn share-btn" @click="toExpertDetail()" v-if="isAPP&&self">咨询专家</div>
        <div class="btn share-btn" @click="shareDetail" v-else-if="isAPP">邀请测试</div>
      </div>

      <div class="btn-wrapper yao" v-else>
        <div class="btn share-btn" @click="me">我也测测</div>
      </div>
    </div>

    <div class="result-box hot-testing" v-if="!self">
      <h2>热门测试</h2>
      <div>
        <ul>
          <li v-for="(item,index) of testingResultHotTestingList" @click="go(item.id)" :key="index">
            <img :src="prefix + item.relatePicSrc + suffix">
            <p class="line-overflow" v-text="item.name"></p>
          </li>
        </ul>
      </div>
    </div>

    <!-- <div class="result-box resulting" v-if="fromBanner">
      <h2>推荐咨询师</h2>
      <div>
        <figure>
          <img src="https://picture.120xinmao.com/1513057022223-1513057407941.jpeg" />
          <del>￥500元/50分钟</del>
          <p>
            <span>
              ￥50元
            </span>
            /25分钟</p>
        </figure>
        <section>
          <div>
            <p class="name">崔鹏远</p>
            <p class="info">国家二级心理咨询师 </p>
          </div>
          <p class="remarks"> 2013年取得国家二级心理咨询师资格证书。 </p>
          <p class="experience"> 倾心聆听 唯爱融化 陪你走过人生的低谷 </p>
          <p class="suggestion">
            咨询时，请先和咨询师说测试结果，活动期间，您将以倾诉价格，享受咨询师专业咨询。每人仅可享受一次，后续倾诉单仅能进行倾诉。活动仅支持25分轻松体验，不支持50分钟加倍体验。
          </p>
        </section>
      </div>
      <div @click="goExperts(url+expertID)">
        <p class="quiz-result">找TA咨询 </p>
        <p class="quiz-result" @click="addRecord">找TA咨询 </p>
      </div>
    </div> -->

    <ul class="comment-list" @click="forReply">
      <comment-item :key="item.commentId" :item="item" v-for="item of resultComment.commonCommentList"></comment-item>
    </ul>

    <comment :payload="payload" :focus="focus" @comment="commentHandler" @blur="blur" v-if="uid"></comment>
  </div>
</template>

<script>
import { mapState } from "vuex";

import { getURLParams } from "utils";
import { getResponseGeneral, getResponseGeneralGET, getResponse } from "api";

import commentItem from "components/comment-item";
import comment from "components/comment";
import testingItem from "components/testing-item";
import hotTestingItem from "components/hot-testing-item";

export default {
  data() {
    return {
      a: "",
      index: -1,

      score: 0,
      scoreTop: 0,
      scoreLeft: 0,

      lowScore: 0,
      highScore: 0,

      weidu: "",

      isAPP: false,
      isWX: false,
      self: "",
      focus: 1,
      payload: {
        placeholder: "我来说说...",
        parentCommentName: "",
        parentCommentId: 0
      },
      url: "https://m.120xinmao.com/experts/",
      expertID: "1171065"
    };
  },
  components: {
    commentItem,
    comment
  },
  computed: {
    ...mapState([
      "uid",
      "prefix",
      "suffix",
      "result",
      "resultComment",
      "testingResultHotTestingList",
      "fromBanner"
    ]),
    isShow() {
      return !!this.uid;
    },
    scoreList() {
      const a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const b = [10, 20, 30, 40, 50, 60, 70, 80, 90];
      const c = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

      if (this.result.relateDisplayMode === 0) {
        return a;
      }

      if (this.result.relateDisplayMode === 1) {
        return b;
      }

      if (this.result.relateDisplayMode === 2) {
        return c;
      }
    }
  },
  // asyncData({ store, route }) {
  //   return store.dispatch("getResultData", route.params.id).catch(error => {
  //     console.error(error);
  //   });
  // },
  beforeMount() {
    // 剔除 tsqMessage
    // if (Object.keys(this.result).length > 1) {
    // 	return
    // }

    //this.loading = true
    this.isWX = window.__wxjs_environment === "miniprogram";
    const isWX = navigator.userAgent.match(/MicroMessenger/i);
    if (isWX) {
      let parameterString = decodeURIComponent(window.location.href).split(
        "?"
      )[2];
      let parameters = parameterString.split("&");
      let parameter = {};
      for (const key in parameters) {
        let item = parameters[key].split("=");
        parameter[item[0]] = item[1];
      }
      this.$store.commit("setUid", parameter.uid);
    }
    if (!this.$root.user && this.uid) {
      this.getUserInfo();
    }
  },
  filters: {
    bFormat(value) {
      const currrentYear = new Date().getFullYear();
      const year = new Date(value).getFullYear();

      return currrentYear - year;
    }
  },
  mounted() {
    this.isAPP = navigator.userAgent.match(/xinmao/);
    this.$store
      .dispatch("getResultData", this.$route.params.id)
      .then(() => {
        //this.loading = false

        this.getShareDetail();
      })
      .catch(error => {
        this.$toast(error.msg);
      });
  },
  methods: {
    goExperts(value) {
      const isAPP = /xinmao/.test(navigator.userAgent);

      if (isAPP) {
        const ua = navigator.userAgent;
        const isIOS = /iPhone/i.test(ua);
        const isAndroid = /Android/i.test(ua);

        const options = {
          mid: this.detail.member.mid,
          pLevel: this.detail.member.pLevel
        };

        isIOS &&
          window.webkit.messageHandlers.ArticalPushConsltPage.postMessage(
            options
          );

        isAndroid && window.Android.postMessage(JSON.stringify(options));
      } else {
        location.href = `${value}?uid=${this.uid}`;
      }
    },
    me() {
      if (this.uid) {
        this.$router.push(`/detail/${this.$route.params.id}`);
      } else {
        const isWX = navigator.userAgent.match(/MicroMessenger/i);

        if (isWX) {
          this.getOpenID();
        } else {
          location.href = `/signup?next=${encodeURIComponent(
            location.href.split("result")[0] +
              "detail/" +
              this.result.relateTestScaleId
          )}`;
        }
        location.href = `/signup?next=${encodeURIComponent(location.href)}`;
      }
    },
    // relateTestScaleId
    async getOpenID() {
      try {
        const params = {
          notifyUrl: location.href
        };
        const data = await getResponseGeneral(
          "weixinCore/getCurriculumAuthUrl",
          params
        );
        if (data.url) {
          location.href = decodeURIComponent(data.url);

          return;
        }

        // if (data.code === 0 && data.member && data.member.mid) {
        // 	//alert(data.mid)
        // 	//alert(data.member.mid)
        // 	document.cookie = `mid=${data.member.mid}; expires=${new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toUTCString()}; path=/`
        // 	this.$store.commit('setUid', data.member.mid)

        // 	this.$root.user = {
        // 		uid: data.member.mid,
        // 		avatar: data.member.avatar ? data.member.avatar : '',
        // 		nickname: data.member.nickname,
        // 		//phone: data.mobilePhone
        // 	}

        // 	this.$router.push(`/topic/${this.$route.params.id}`)

        // 	return
        // }

        this.$toast("获取 openid 出错");
      } catch (e) {
        this.$toast(e.msg || e.message);
      }
    },
    // async getOpenID() {
    //   try {
    //     const data = await getResponseGeneralGET("weixinCore/getSnsapiBase");

    //     if (data.code === 0 && data.member && data.member.mid) {
    //       document.cookie = `mid=${data.member.mid}; expires=${new Date(
    //         Date.now() + 30 * 24 * 60 * 60 * 1000
    //       ).toUTCString()}; path=/`;

    //       location.href = `/testing/detail/${this.result.relateTestScaleId}`;

    //       return;
    //     }

    //     this.$toast("获取 openid 出错");
    //   } catch (e) {
    //     this.$toast(e.msg);
    //   }
    // },
    // addRecord() {
    //   TDAPP.onEvent("去找他咨询");
    // },
    showScore(
      { dimensionScore, dimensionDescription, normLowScore, normHighScore },
      e
    ) {
      let target = e.target;
      let { width, height, top, left } = target.getBoundingClientRect();

      const rem = screen.width / 7.5;

      const boxWidth = rem * 2.5;
      const boxHeight = rem * 1.1;

      this.scoreTop = `${top - boxHeight - 15}px`;
      this.scoreLeft = `${left - boxWidth / 2 + width / 2}px`;

      //this.index = 0
      this.score = dimensionScore;
      this.lowScore = normLowScore;
      this.highScore = normHighScore;

      if (target.tagName === "P") {
        this.scoreTop = `${top + height + 0}px`;
        this.scoreLeft = `${left - boxWidth / 2 + width / 2}px`;

        this.weidu = dimensionDescription;

        if (dimensionDescription) {
          this.index = 1;
        }
      } else {
        this.index = 0;
      }

      this.$nextTick(() => {
        console.dir(document.querySelector(".show-score"));
      });
    },
    retest() {
      //location.href = `/testing/topic/${this.result.relateTestScaleId}`

      this.$router.push(
        `/topic/${this.result.relateTestScaleId}?fromBanner=${this.fromBanner}`
      );
    },
    go(id) {
      this.$router.push(`/detail/${id}?uid=${this.uid}`);
    },
    download() {
      location.href =
        "http://a.app.qq.com/o/simple.jsp?pkgname=com.xinmao.depressive";
    },
    shareResult() {
      this.share({
        type: 1,
        mid: this.$route.params.id,
        title: this.result.relateTestScaleName,
        result: `【测试结果】${this.result.relateQualitativeName}`,
        img: "https://static.120xinmao.com/share-logo.png"
      });
    },
    shareDetail() {
      // console.log(this.$detail)
      // console.log(this.$detail.name)
      this.share({
        type: 0,
        mid: this.result.relateTestScaleId,
        title: this.$detail.name,
        result: this.$detail.description,
        img: this.prefix + this.$detail.relatePicSrc
      });
    },
    share(options) {
      const ua = navigator.userAgent;
      const isIOS = /iPhone/i.test(ua);
      const isAndroid = /Android/i.test(ua);

      console.log(options);
      isIOS && window.webkit.messageHandlers.NativeMethod.postMessage(options);
      //isIOS && window.webkit.messageHandlers.InvitationShare.postMessage(options)

      isAndroid && window.Android.showShare(JSON.stringify(options));
    },
    forReply(e) {
      let target = e.target;
      let parentNode;

      if (target.className !== "comment-item") {
        while ((parentNode = target.parentNode)) {
          if (parentNode.className === "comment-item") {
            target = parentNode;

            break;
          }

          target = parentNode;
        }
      }

      this.focus++;
      this.payload.placeholder = `回复${target.dataset.name}：`;

      this.payload.parentCommentId = target.dataset.id;
      this.payload.parentCommentName = target.dataset.name;

      this.$parentCommentId = target.dataset.id;
      this.$parentCommentName = target.dataset.name;
    },
    commentHandler(value, id) {
      const options = {
        mName: this.$root.user.nickname,
        commentContent: value,
        mHeadPortrait: this.$root.user.avatar,
        commentTime: Date.now(),
        commentId: id,
        parentCommentId: 0
      };

      if (this.$parentCommentId) {
        options.parentCommentName = this.$parentCommentName;
        options.parentCommentId = this.$parentCommentId;
      }

      //console.log(options)
      //return
      this.$store.commit("addComment", options);

      this.$parentCommentName = "";
      this.$parentCommentId = 0;

      this.payload.parentCommentId = 0;
      this.payload.parentCommentName = "";
    },
    blur() {
      this.payload.placeholder = "我来说说...";
    },
    toExpertDetail() {
      const ua = navigator.userAgent;
      const isIOS = /iPhone/i.test(ua);
      const isAndroid = /Android/i.test(ua);
      isIOS &&
        window.webkit.messageHandlers.JumpConsltList.postMessage(
          "JumpConsltList"
        );
      isAndroid && window.Android.JumpConsltList();
    },
    async getShareDetail() {
      //console.log(this.$currentDetailID)
      const data = await getResponse(
        "testCenter/testScaleInfo/getMessageByIdFromFront",
        {
          testScaleId: this.result.relateTestScaleId
          //userId: uid
        }
      );

      if (data.code === 0) {
        this.$detail = data.testScaleInfoMessage;

        console.log(this.$detail);
      }
    },
    async getUserInfo() {
      const data = await getResponseGeneral(
        "depression/api/getMemberByMid.json",
        {
          mid: this.uid
        }
      );

      if (data.code === 0) {
        this.$root.user = {
          uid: this.uid,
          nickname: data.nickname,
          phone: data.mobilePhone
        };
      }
    }
  },
  beforeDestroy() {
    this.$store.commit("setFromBanner", false);
  }
};
</script>