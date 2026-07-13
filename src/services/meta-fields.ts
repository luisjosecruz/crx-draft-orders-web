import apiClient from '@/api/client'

export default {
	/**
	 * list meta fields
	 */
	list(params?: any) {
		return apiClient
			.get(`/meta-fields`, { params })
			.then((resp: any) => resp.data)
	},

	/**
	 * store meta field to shop
	 */
	store(shop: string, data: any) {
		return apiClient
			.post(`/meta-field?shop=${shop}`, data)
			.then((resp: any) => resp.data)
	},

	/**
	 * get meta field by uuid
	 */
	get(uuid: string) {
		return apiClient
			.get(`/meta-field/${uuid}`)
			.then((resp: any) => resp.data)
	},

	/**
	 * update meta field by uuid
	 */
	update(uuid: string, data: any) {
		return apiClient
			.put(`/meta-field/${uuid}`, data)
			.then((resp: any) => resp.data)
	},

	/**
	 * delete meta field by uuid
	 */
	delete(uuid: string) {
		return apiClient
			.delete(`/meta-field/${uuid}`)
			.then((resp: any) => resp.data)
	}
}