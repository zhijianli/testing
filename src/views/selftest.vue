<style src="css/home"></style>
<style scoped>
    .testing-item {
        padding: .42rem .3rem .32rem 0;
        border-bottom: 1px solid #EEE;
    }
    .testing-item:last-child {
        border-bottom: none;
    }
    .testing-info-wrapper {
        display: flex;
        justify-content: space-between;
        margin-bottom: .2rem;

    & img {
          width: 1.8rem;
          height: 1.8rem;
          margin-left: .6rem;
          border-radius: 8px;
          object-fit: cover;
      }
    }
    .testing-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

    & h2 {
          color: #333;
          font-size: .36rem;
      }

    & p {
          color: #666;
          font-size: .26rem;
          line-height: .4rem;
          word-break: break-all;
      }
    }
    .testing-count {
        display: flex;
        color: #BFBFBF;
        font-size: .24rem;
        line-height: .42rem;

    & span {
          margin-left: auto;
      }
    }
    .space{
    	width:10rem;
    	height:1.2rem;
    }
</style>
<template>
    <div id="app">
        <div class="choice-testing">
            <ul class="testing-list">
                <li class="testing-item" @click="go(item.id)" v-for="item of testingList">
                    <div class="testing-info-wrapper">
                        <div class="testing-info">
                            <h2 class="line-overflow" v-text="item.name || item.relateTestScaleName"></h2>
                            <p class="line-overflow" v-text="item.description || item.tsiMessage.abstractStr"></p>
                        </div>
                        <img :src="prefix + item.relatePicSrc + suffix" v-if="typeof item.relatePicSrc !== 'undefined'">
                        <img :src="prefix + item.tsiMessage.relatePicSrc + suffix" v-else>
                    </div>
                    <p class="testing-count" slot="footer">
                        共{{item.numberOfTitle}}题·{{item.numberOfTest}}人测过
                        <!--<span>{{item.ping}}评论</span>-->
                    </p>
                    <!--<slot name="footer"></slot>-->

                </li>
                <!--<testing-item :key="item.id" :item="item" v-for="item of testingList">-->
                    <!--<p class="testing-count" slot="footer">-->
                        <!--共{{item.numberOfTitle}}题·{{item.numberOfTest}}人测过-->
                         <!--&lt;!&ndash;<span>{{item.ping}}评论</span>&ndash;&gt;-->
                    <!--</p>-->
                <!--</testing-item>-->
            </ul>
        </div>
        <div class="home-loading" v-if="loading"></div>

        <!-- 撑开Fixednav挡住的位置 -->
        <div class="space"></div>
        <!-- 固定导航栏 -->
        <fixednav></fixednav>
    </div>
</template>

<script>
    import {getResponseGeneral,getResponse} from "api"
    import {getURLParams} from "utils"

    import {mapState} from "vuex"
    import fixednav from 'components/fixed-nav';
//    import testingItem from "components/testing-item"

    export default {
        data() {
            return {
                loading: false,
                id:-1,
                flag:false,
                testingList:[]
            }
        },
        computed: {
//            ... mapState(["uid", "classify", "testingList"]),
            ... mapState(["uid", "classify","prefix", "suffix"]),
        },
       components: {
           // testingItem,
           fixednav
       },
//        asyncData({store}) {
//            return store.dispatch("getClassifyData").catch((error) => {
//                console.error(error)
//            })
//        },
        beforeMount() {
            sessionStorage.setItem("type", "self");
            this.$store.state.uid = 12;//测试的时候先写死
            console.log(this.uid+"=================");
            if (this.uid) {

                document.cookie = `mid=${this.uid}; expires=${new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toUTCString()}; path=/`

                this.getUserInfo()
            }
            this.loading = true;
            var that=this;
//            this.$store.dispatch("getClassifyData").then(() => {
//                this.classify.forEach(function (v,i) {
//                    if(v.name=='自测评估'){
//                        that.id=v.id;
//                    }
//                })
//                that.getClassData(this.id)
//            }).catch((error) => {
//                this.$toast("似乎网络出现了一点问题~~")
//            })
//            console.log(44)
            this.getClassType()
        },
        methods: {
            async getClassType(){
                var that=this;
                const data = await getResponse("testCenter/testScaleClass/getAllMessageFromFront")
                if(data.code===0){
                    data.testScaleClassList.forEach(function (v,i) {
                        if(v.name=='自测评估'){
                            that.id=v.id;
                            that.flag=true;
                        }
                    })
                    if(this.flag){
                        this.getClassData(this.id)
                    }
                }

            },
            async getClassData(id){
                const data = await getResponse("testCenter/testScaleInfo/getMessageFromClassPage", {
                    testScaleClassId: id
                })
                this.loading = false;
                this.testingList=data.testScaleInfoList;
//                this.$store.commit("setTestingList", data.testScaleInfoList)
//                this.$store.dispatch("getClassifyTestingList",{id}).then(() => {
//                    this.loading = false;
//                }).catch((error) => {
//                    this.$toast(error.msg)
//                })
            },
            go(id) {
                this.$router.push({
                    path: `/detail/${id}`
                })
            },
            async getUserInfo() {
                // const data = await getResponseGeneral("depression/api/getMemberByMid.json", {
                //     mid: this.uid
                // })
                //
                // if (data.code === 0) {
                //     this.$root.user = {
                //         uid: this.uid,
                //         avatar: data.avatar,
                //         nickname: data.nickname,
                //         phone: data.mobilePhone
                //     }
                // }

                //测试的时候先写死
                this.$root.user = {
                      uid: 12,
                      avatar: "touxiang",
                      nickname: "mocui",
                      phone: "135656565"
                }
            }
        }
    }
</script>
