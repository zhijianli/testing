import Vue from "vue"

export default {
	setSuffix(state, value) {
		state.suffix = value
	},
	setUid(state, value) {
		state.uid = value
	},

	setBanner(state, list) {
		state.banner = list
	},
	setNav(state, list) {
		state.nav = list
	},
	setChoiceTestingList(state, list) {
		state.choiceTestingList = list
	},
	setHotTestingList(state, list) {
		state.hotTestingList = list
	},

	setClassify(state, list) {
		state.classify = list
	},
	setTestingList(state, list) {
		state.testingList = list
	},

	setTestingDetail(state, detail) {
		state.testingDetail = detail
	},
	setTestingDetailIsTesting(state, value) {
		state.testingDetailIsTesting = value
	},
	setTestingDetailCollect(state, detail) {
		state.testingDetailCollect = detail
	},
	setTestingDetailComment(state, value) {
		state.testingDetailComment = value
	},
	addComment(state, value) {
		state.testingDetailComment = {
			count: state.testingDetailComment.count,
			commonCommentList: [value, ... state.testingDetailComment.commonCommentList]
		}
	},

	setTestingRubric(state, data) {
		state.testingRubric = data
	},

	setTestingResult(state, result) {
		state.result = result
	},
	setTestingResultComment(state, result) {
		state.resultComment = result
	},
	setTestingResultHotTestingList(state, list) {
		state.testingResultHotTestingList = list
	},

	setProfileLoaded(state, value) {
		state.profileLoaded = value
	},
	setProfileCount(state, value) {
		state.profileCount = value
	},
	setProfileCountCollect(state, value) {
		state.profileCountCollect = value
	},
	setProfileTestingList(state, value) {
		state.profileTestingList = value
	},
	setProfileCollectTestingList(state, value) {
		state.profileCollectTestingList = value
	}
}