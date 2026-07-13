<template>
	<v-container fluid>
		<v-row no-gutters>
			<v-col cols="12" class="mb-6">
				<v-card>
					<v-card-title class="text-small">Información del cliente</v-card-title>
					<v-card-text>
						<v-container fluid>
							<v-row>
								<v-col cols="6">
									<v-container>
										<v-row no-gutters v-for="(field, index) in customerDetails" :key="index">
											<v-col cols="4" class="pa-0 font-weight-bold">{{ field.label }}</v-col>
											<v-col cols="auto" class="pa-0">{{ field.value }}</v-col>
										</v-row>
									</v-container>
								</v-col>
								<v-col cols="6">
									<v-row v-for="(field, i) in selectedMetaFields" :key="i">
										<v-col cols="4" class="pa-0 font-weight-bold">{{ field?.display_name }}</v-col>
										<v-col cols="auto" class="pa-0">
												{{ typeof field.value === 'object' && field.value !== null && 'name' in field.value ? field.value.name : field.value }}
										</v-col>
									</v-row>
								</v-col>
							</v-row>
						</v-container>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col cols="12">
				<v-card>
					<v-card-title class="text-small">Productos para el pedido</v-card-title>
					<v-card-text>
						<v-data-table :headers="headers" :items="formattedProducts" item-value="id" :hide-default-footer="true" color="green">
							<template v-slot:item="{ item }">
								<tr>
									<td>{{ item.displayName }}</td>
									<td>${{ item.price }}</td>
									<td class="pt-2"><img :src="item.imageSrc" class="border-thin rounded-lg" :width="96" /></td>
									<td>1</td>
								</tr>
							</template>
						</v-data-table>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
	<v-container fluid>
		<v-row>
			<v-col class="text-start">
				<v-btn
					@click="$emit('prev')"
					variant="flat"
					size="large"
					color="pink"
				>
					Seleccionar cliente
				</v-btn>
			</v-col>
			<v-col class="text-end">
				<v-btn
					@click="handleCreateDraftOrder"
					variant="flat"
					size="large"
					color="green"
				>
					Crear pedido
				</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia'
import { useCommonStore } from '@/stores/common';
import { useDraftOrdersStore } from '@/stores/drafts'
import { COMMONS } from '@/constants/commons';

const route = useRoute()
const router = useRouter()

const { loadingShow, loadingHide } = useCommonStore()
const { createDraftOrder } = useDraftOrdersStore()
const { selectedProducts, selectedCustomer, selectedMetaFields } = storeToRefs(useDraftOrdersStore())

const headers = [
	{ title: 'Producto', align: 'left', sortable: false, key: 'title' },
	{ title: 'Precio', align: 'left', sortable: false, key: 'price' },
	{ title: 'Imagen', align: 'left', sortable: false, key: 'image' },
	{ title: 'Items', key: 'items', sortable: false },
]

const customerDetails = computed(() => {
	const countryCode = selectedCustomer.value?.default_address?.country_code || 'CR'
	const labels = COMMONS.LABELS[countryCode] || COMMONS.LABELS['CR']

	return [
		{ label: labels.client, value: `${selectedCustomer.value?.first_name || selectedCustomer.value?.default_address?.first_name} ${selectedCustomer.value?.last_name || selectedCustomer.value?.default_address?.last_name}` },
		{ label: labels.address, value: `${selectedCustomer.value?.default_address?.address1 || '.'} ${selectedCustomer.value?.default_address?.address2 || '.'}` },
		{ label: labels.country, value: selectedCustomer.value?.default_address?.country || '.' },
		...(labels.province ? [{ label: labels.province, value: selectedCustomer.value?.default_address?.province || '.' }] : []),
		{ label: labels.city, value: selectedCustomer.value?.default_address?.city || '.' },
		{ label: labels.email, value: selectedCustomer.value?.email || '.' },
	];
})

const formattedProducts = computed(() => {
  return selectedProducts.value?.flatMap(product =>
    product.variants.map(variant => ({
      id: variant.id,
      productId: product.id,
      displayName: `${product.title} - ${variant.title}`,
      price: variant.price,
      imageSrc: product.images?.[0]?.originalSrc || '',
      ...variant
    }))
  );
});

const handleCreateDraftOrder = async () => {
	loadingShow()

	await createDraftOrder(route.query?.shop)
		.then((resp: any) => {
			const updatedQuery = {
				...route.query,
				draft_order_id: resp?.data?.id
			}

			router.push({ name: 'order-created', query: updatedQuery })
		})
		.finally(() => loadingHide())
}
</script>