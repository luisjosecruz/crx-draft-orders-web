import apiClient from '@/api/client'

export default {
	/**
	 * create draft order
	 */
	create(shop: string, data: any) {
		return apiClient
			.post(`/shopify/draft-order?shop=${shop}`, data)
			.then((resp: any) => resp.data)
	},
}