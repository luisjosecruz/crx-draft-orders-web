import { defineStore } from 'pinia';
import { useCommonStore } from '@/stores/common';
import shopify from '@/services/shopify';

interface shopifyState {
	products: [] | undefined;
	customers: [] | undefined;
}

export const useShopifyStore = defineStore('shopify', {
	state: (): shopifyState => ({
		products: undefined,
		customers: undefined,
	}),
	actions: {
		fetchCustomers(params: any) {
			const { loadingShow, loadingHide } = useCommonStore()

			loadingShow()
			return shopify
				.customers(params)
				.then((resp: any) => {
					this.customers = resp?.data;
				})
				.finally(() => loadingHide())
		},
		fetchCustomer(params: any, customer: any) {
			const { loadingShow, loadingHide } = useCommonStore()

			loadingShow()
			return shopify
				.customer(params, customer)
				.then((resp: any) => {
					console.log("Respuesta de tores/shopify.customer:", resp);
					this.customers = resp?.data
					return resp?.data;
				})
				.finally(() => loadingHide())
		},
		fetchSearchCustomer(params: any) {
			const { loadingShow, loadingHide } = useCommonStore()

			loadingShow()
			return shopify
				.searchCustomer(params)
				.then((resp: any) => {
					this.customers = resp?.data
				})
				.finally(() => loadingHide())
		},
		fetchCustomerAdd(params: any, customer: any) {
			const { loadingShow, loadingHide } = useCommonStore();
			
			loadingShow();
			return shopify
			  .customerAddress(params, customer)
			  .then((resp: any) => {
				this.customers = resp?.data;
      			return resp; 
			  })
			  .finally(() => loadingHide());
		},
		updateCustomerAddress(params: any, customer: any) {
			const { loadingShow, loadingHide } = useCommonStore();
	
			loadingShow();
			return shopify
			.updateCustomerAdd(params, customer)
			.then((resp: any) => {
				return resp;
			})
			.finally(() => loadingHide());
		},
		createCustomerAddress(params: any, customer: any) {
			const { loadingShow, loadingHide } = useCommonStore();
		  
			loadingShow();
			return shopify
			  .createCustomerAdd(params, customer)
			  .then((resp: any) => {
				return resp;
			  })
			  .finally(() => loadingHide());
		  },
		  
	}
})