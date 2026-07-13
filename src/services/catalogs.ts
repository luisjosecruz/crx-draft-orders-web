import apiClient from '@/api/client'

export default {
	/**
	 * list countries
	 */
	countries(params?: any) {
		return apiClient
			.get(`/shopify/countries`, { params })
			.then((resp: any) => resp.data)
	},

	/**
	 * list provinces
	 */
	provinces(country: string) {
		return apiClient
			.get(`/shopify/provinces/${country}`)
			.then((resp: any) => resp.data)
	},

	/**
	 * list districts
	 */
	districts(country: string, province?: string) {
		return apiClient
			.get(`/shopify/districts/${country}?province=${province}`)
			.then((resp: any) => resp.data)
	},

	/**
	 * list towns
	 */
	towns(district: string) {
		return apiClient
			.get(`/shopify/towns/${district}`)
			.then((resp: any) => resp.data)
	},

	neighborhood(town: string) {
		return apiClient
			.get(`/shopify/neighborhood/${town}`)
			.then((resp: any) => resp.data)
	},

	/**
	 * list employees
	 */
	employees() {
		return apiClient
			.get(`/shopify/employees`)
			.then((resp: any) => resp.data)
	},
}