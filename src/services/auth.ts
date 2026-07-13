import apiClient from '@/api/client'

export default {
	/**
	 * webhook redirect
	 */
	redirect(params: any) {
		return apiClient
			.get(`/shopify/redirect`, { params })
			.then((resp: any) => resp.data)
	},
}