// import apiClient from '@/api/client'
import { defineStore } from 'pinia'
import auth from '@/services/auth'
import shopify from '@/services/shopify'
import { useCommonStore } from '@/stores/common'

interface authState {
	apiKey: string | undefined;
	shop: string | undefined;
}

export const useAuthStore = defineStore('auth', {
	state: (): authState => ({
		apiKey: localStorage.getItem('api_key') || undefined,
		shop: localStorage.getItem('shop') || undefined,
	}),
	actions: {
		setAuthData(data: any) {
			this.apiKey = data?.apiKey;
			this.shop = data?.shop;
			localStorage.setItem('api_key', this.apiKey);
			localStorage.setItem('shop', this.shop);

			location.reload();
		},
		clearAuth() {
			this.$reset()
			localStorage.removeItem('api_key')
			localStorage.removeItem('shop')
			location.reload()
		},
		getShopDetails(shop: string) {
			const { loadingShow, loadingHide } = useCommonStore()

			loadingShow()
			return shopify
				.apiKey(shop)
				.then(async (resp: any) => {
					await this.setAuthData(resp?.data)
				})
				.finally(() => loadingHide())
		}
	}
})