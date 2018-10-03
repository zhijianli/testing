import {getResponse, getResponses, getResponseGeneral} from "api"

export default {
	getHomeData({commit}) {
		// return Promise.all([getResponse("testCenter/testScaleClass/getAllMessage"), getResponse("testCenter/testScaleInfo/getAllMessage"), getResponse("testCenter/testScaleInfo/getHot")]).then(([a, b, c]) => {
		// 	commit("setNav", a.contentList)
		// 	commit("setChoiceTestingList", b.contentList)
		// 	commit("setHotTestingList", c.contentList)
		// })
		return Promise.all([getResponses("testCenter/testScaleInfo/getHomePageMessage")

		// 	, getResponseGeneral("adBanner/list.json", {
		// 	pageIndex: 1,
		// 	pageSize: 10,
		// 	showLocation: 5
		// })

			]).then(([a, b]) => {
			commit("setNav", a.homeRecommClassList)
			commit("setChoiceTestingList", a.selectionTestList)
			commit("setHotTestingList", a.hotTestLIst)

			// commit("setBanner", b.list.filter((item) => {
			// 	return !! item.outsideLink
			// }))
		}).catch((error) => {
			console.error(error)

			return Promise.reject(error)
		})
	},

	getClassifyData({commit}) {
		return Promise.all([getResponse("testCenter/testScaleClass/getAllMessageFromFront")]).then(([a]) => {
			commit("setClassify", a.testScaleClassList)
		}).catch((error) => {
			console.error(error)

			return Promise.reject(error)
		})
	},
	getClassifyTestingList({commit}, {id}) {
		return getResponse("testCenter/testScaleInfo/getMessageFromClassPage", {testScaleClassId: id}).then((data) => {
			commit("setTestingList", data.testScaleInfoList)
		}).catch((error) => {
			console.error(error)

			return Promise.reject(error)
		})
	},

	getTestingDetail({commit}, {id, uid}) {
		const options = {
			testScaleId: id,
			userId: uid
		}

		return Promise.all([getResponse("testCenter/testScaleInfo/getMessageByIdFromFront", options), getResponse('userOperationCenter/commonComment/getAllMessage', {
			articleId: id,
			pageIndex: 1,
			pageSize: 1000
		}), getResponse("orderCenter/testScaleOrder/isHaveTestOrder", {
			relateTestScaleId: id,
			userId: uid
		})]).then(([a, b, c]) => {
			if (a.code === 0) {
				commit("setTestingDetailCollect", a.isCollected)
			} else {
				return Promise.reject({
					msg: a.msg
				})
			}
			commit("setTestingDetail", a.testScaleInfoMessage)

			//commit("setTestingDetailIsTesting", c.testScaleOrderNum > 0)

			//console.log(b)
			commit('setTestingDetailComment', b)

			commit("setTestingDetailIsTesting", c.testScaleOrderNum > 0)
		}).catch((error) => {
			console.error(error)

			return Promise.reject(error)
		})
	},

	getTestingDetailNoLogin({commit}, {id}) {
		const options = {
			testScaleId: id
		}

		return Promise.all([getResponse("testCenter/testScaleInfo/getMessageByIdFromFront", options), getResponse('userOperationCenter/commonComment/getAllMessage', {
			articleId: id,
			pageIndex: 1,
			pageSize: 1000
		})]).then(([a, b]) => {
			if (a.code === 0) {
				commit("setTestingDetailCollect", a.isCollected)
			} else {
				return Promise.reject({
					msg: a.msg
				})
			}
			commit("setTestingDetail", a.testScaleInfoMessage)

			//commit("setTestingDetailIsTesting", c.testScaleOrderNum > 0)

			//console.log(b)
			commit('setTestingDetailComment', b)

		}).catch((error) => {
			console.error(error)

			return Promise.reject(error)
		})
	},

	getTestingRubric({commit}, id) {
		return getResponse("testCenter/testScaleTitle/getAllTitleAndOption", {testScaleId: id}).then((data) => {
			commit("setTestingRubric", data.testScaleTitleList)
		}).catch((error) => {
			console.error(error)

			return Promise.reject(error)
		})
	},

	getResultData({commit}, id) {
		return Promise.all([getResponse("orderCenter/testScaleOrder/getTestResultMessage", {testScaleOrderId: id}), getResponse("testCenter/testScaleInfo/getRecommendTestScale", {testScaleOrderId: id})]).then(([a, b]) => {
			commit("setTestingResult", a.testScaleOrderMessage)
			commit("setTestingResultHotTestingList", b.recommendTestScaleList)

			getResponse('userOperationCenter/commonComment/getAllMessage', {
				articleId: a.testScaleOrderMessage.relateTestScaleId,
				pageIndex: 1,
				pageSize: 1000
			}).then((data) => {
				commit('setTestingResultComment', data)
			})

			return a
		}).catch((error) => {
			console.error(error)

			return Promise.reject(error)
		})
	},

	getProfileData({commit}, id) {
		return Promise.all([getResponse("orderCenter/testScaleOrder/getTestResultListMessage", {
			userId: id,
			pageIndex: 1,
			pageSize: 9999
		}), getResponse("testCenter/testScaleInfo/getCollectionTestList", {
			mid: id,
			pageIndex: 1,
			pageSize: 9999
		})]).then(([a, b]) => {
			commit("setProfileCount", a.testScaleOrderList.length)
			commit("setProfileCountCollect", b.collectionTestList.length)

			commit("setProfileLoaded", true)
			commit("setProfileTestingList", a.testScaleOrderList)

			commit("setProfileCollectTestingList", b.collectionTestList)
		}).catch((error) => {
			console.error(error)

			return Promise.reject(error)
		})
	},
}
