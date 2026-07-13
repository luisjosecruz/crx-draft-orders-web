import apiClient from '@/api/client'

export default {
	/**
	 * list customers of shop
	 */
	customers(params: any) {
		return apiClient
			.get(`/shopify/customers`, { params })
			.then((resp: any) => resp.data)
	},

	/**
	 * get customer of shop by ID
	 */
	customer(params: any, customer: any) {
		return apiClient
			.get(`/shopify/customers/${customer}`, { params })
			.then((resp: any) => resp.data)
	},
	/**
	 * get customer of shop by email
	 */
	searchCustomer(params: any) {
		return apiClient
			.get(`/shopify/customer/search`, { params })
			.then((resp: any) => resp.data)
	},

	/**
	 * get api key for shop
	 */
	apiKey(shop: string) {
		return apiClient
			.get(`/shopify/shop?shop=${shop}`)
			.then((resp: any) => resp.data)
	},
	
	/* -------------------------------------------------------------------------- */
	/*                      Obtener la dirección del cliente                      */
	/* -------------------------------------------------------------------------- */
	customerAddress(params: any, customer: any) {
		if (!customer) {
			return Promise.reject(new Error("Customer ID es requerido"));
		}
		return apiClient
			.get(`/shopify/customers/${customer}/addresses`, { params })
			.then((resp: any) => resp.data)
	},

	updateCustomerAdd(params: any, customer: any) {
		console.log("Datos antes de enviar al API: ", params, customer, params.address_id);

		return apiClient
		  .put(`/shopify/customers/${customer}/addresses/${params.address_id}`, params)
		  .then((resp: any) => resp.data);
	},
	createCustomerAdd(params: any, customer: any) {
		console.log("Datos antes de enviar al API (POST): ", params, customer);
	  
		return apiClient
		  .post(`/shopify/customers/${customer}/addresses`, params)
		  .then((resp: any) => resp.data);
	  },	  
}