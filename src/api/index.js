
import axios from "axios"
import {serialize} from "utils"

axios.defaults.timeout = 10000
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8"

//const isProd = process.env.NODE_ENV === 'production'
// const host = 'http://api.120xinmao.com:8000/'  //'http://192.168.0.247:8000/'
 //const host = 'http://192.168.0.247:8000/'  //'http://192.168.0.247:8000/'
 // const host = 'http://127.0.0.1:9000/'
 const host = 'http://moluantongxue.com:9000/'

// let urlPrefix = typeof window === "object" ? "/depression-testing/" : host
//心理测试所有请求前缀
let urlPrefix = host

export function getResponses(url, params = {}) {
	return axios.get(urlPrefix + url, {params}).then((response) => {
		if (response.status === 200) {
			return response.data
		} else {
			return {msg: "抱歉，服务器错误"}
		}
	}).catch((error) => {
		return Promise.reject({msg: error.message})
	})
}

export function getResponse(url, params = {}) {
	return axios.post(urlPrefix + url, serialize(params)).then((response) => {
		if (response.status === 200) {
			return response.data
		} else {
			return {msg: "抱歉，服务器错误"}
		}
	}).catch((error) => {
		return Promise.reject({msg: error.message})
	})
}

export function getResponseGeneral(url, params = {}) {
	// const host = 'http://api.120xinmao.com'  //'http://192.168.0.247:8080'
	// const host = 'http://192.168.0.247:8080'  //'http://192.168.0.247:8080'
                 const host = 'http://127.0.0.1:8080'
	const urlPrefix = typeof window === "object" ? "/depression-api/" : `${host}/depression-api/`

	return axios.post(urlPrefix + url, serialize(params)).then((response) => {
		if (response.status === 200) {
			return response.data
		} else {
			return {msg: "抱歉，服务器错误"}
		}
	}).catch((error) => {
		return Promise.reject({msg: error.message})
	})
}

export function getResponseGeneralGET(url, params = {}) {
	// const host = 'http://api.120xinmao.com'  //'http://192.168.0.247:8080'
	// const host = 'http://192.168.0.247:8080'  //'http://192.168.0.247:8080'
                 const host = 'http://127.0.0.1:8080'
	const urlPrefix = typeof window === "object" ? "/depression-api/" :	 `${host}/depression-api/`

	return axios.get(urlPrefix + url).then((response) => {
		if (response.status === 200) {
			return response.data
		} else {
			return {msg: "抱歉，服务器错误"}
		}
	}).catch((error) => {
		return Promise.reject({msg: error.message})
	})
}
