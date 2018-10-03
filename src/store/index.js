import Vue from "vue"
import Vuex from "vuex"
import actions from "./actions"
import mutations from "./mutations"
import getters from "./getters"

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
        uid: null,
        //prefix: "https://picture.120xinmao.com/",
        // prefix: process.env.NODE_ENV === 'production' ? 'https://picture.120xinmao.com/' : 'https://oml9ntix5.qnssl.com/',
        prefix: process.env.NODE_ENV === 'production' ? 'https://image-testscale.oss-cn-hangzhou.aliyuncs.com/' : 'https://image-testscale.oss-cn-hangzhou.aliyuncs.com/',
    	//prefix: "https://oml9ntix5.qnssl.com/",
        suffix: "",

        banner: [],
    	nav: [],
    	choiceTestingList: [],
    	hotTestingList: [],

    	classify: [],
    	testingList: [],

        testingDetailIsTesting: false,
        testingDetail: {},
    	testingDetailCollect: 0,
        testingDetailComment: {
            count: 0,
            commonCommentList: []
        },

        testingRubric: [],

        result: {
            tsqMessage: {}
        },
        resultComment: [],
        testingResultHotTestingList: [],

        profileCount: 1,
        profileCountCollect: 1,
        profileLoaded: false,
        profileTestingList: [],
        profileCollectTestingList: []
    },
    actions,
    mutations,
    getters
  })
}
