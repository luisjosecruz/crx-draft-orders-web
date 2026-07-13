import { defineStore } from 'pinia';
import draftOrders from '@/services/draft-orders';

interface draftOrderState {
	selectedProducts: any[];
	selectedCustomer: Object | undefined;
	selectedMetaFields: Array<{ namespace: string, key: string, value: string }>;
}

export const useDraftOrdersStore = defineStore('draft_orders', {
	state: (): draftOrderState => ({
		selectedProducts: [],
		selectedCustomer: undefined,
		selectedMetaFields: []
	}),
	actions: {
		setProducts(products: any[]) {
			this.selectedProducts = products;
		},
		setCustomer(payload: any) {
			return (this.selectedCustomer = payload)
		},
		setMetaFields(metaFields: Array<{ namespace: string, key: string, value: string }>) {
			return (this.selectedMetaFields = metaFields)
		},
		clearStore() {
			this.$reset()
		},
		createDraftOrder(shop: any) {
			const processedProducts = this.selectedProducts.flatMap(product =>
				product.variants.map(variant => ({
				  ...variant,
				  productId: product.id,
				  productTitle: product.title,
				  imageSrc: product.images?.[0]?.originalSrc || ''
				}))
			 );

			 const processedMetaFields = this.selectedMetaFields.map(field => {
				if (field.key === 'employeeId' && typeof field.value === 'object' && field.value !== null && 'employee_code' in field.value) {
					return {
						...field,
						value: field.value?.employee_code,
					};
				} else if (typeof field.value === 'object' && field.value !== null && 'name' in field.value) {
					return {
						...field,
						value: field.value?.name,
					};
				}
				return field;
			});

			return draftOrders
				.create(shop, {
					products: processedProducts,
					customer: this.selectedCustomer,
					meta_fields: processedMetaFields
				})
		}
	}
})