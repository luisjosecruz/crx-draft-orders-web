<template>
	<v-container fluid>
		<v-row justify="end">
			<v-col cols="auto" class="me-auto">
				<h3 class="text-h5">Productos</h3>
			</v-col>
			<v-col cols="auto">
				<v-btn color="primary" size="large" @click="openSelectProducts">Agregar Productos</v-btn>
			</v-col>
		</v-row>
	</v-container>
	<v-data-table :headers="headers" :items="formattedProducts" item-value="id">
		<template v-slot:item="{ item }">
			<tr>
				<td>{{ item.displayName }}</td>
				<td>${{ item.price }}</td>
				<td class="pt-2"><img :src="item.imageSrc" class="border-thin rounded-lg" :width="96" /></td>
				<td class="pt-2">1</td>
				<td>
					<v-icon size="small" @click="deleteItem(item)">mdi-delete</v-icon>
				</td>
			</tr>
		</template>
	</v-data-table>
	<v-container fluid>
		<v-row>
			<v-col class="text-end">
				<v-btn
					:disabled="selectedProducts.length <= 0"
					@click="productsHandle" 
					variant="flat"
					size="large"
					color="green"
				>Seleccionar Cliente</v-btn>
			</v-col>
		</v-row>
	</v-container>
 </template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCommonStore } from '@/stores/common'
import { useDraftOrdersStore } from '@/stores/drafts'
import { initializeAppBridge } from '@/utils/shopifyAppBridge'
import { ResourcePicker } from '@shopify/app-bridge/actions'

const emit = defineEmits(['next'])

const { showMessage } = useCommonStore()

const { setProducts } = useDraftOrdersStore()
const { selectedProducts } = storeToRefs(useDraftOrdersStore())

const headers = [
	{ title: 'Producto', align: 'left', sortable: false, key: 'title' },
	{ title: 'Precio', align: 'left', sortable: false, key: 'price' },
	{ title: 'Imagen', align: 'left', sortable: false, key: 'image' },
	{ title: 'Items', key: 'items', sortable: false },
	{ title: 'Acciones', key: 'actions', sortable: false },
]

const app = ref<any>(null)
let productPicker: any = null;

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

const deleteItem = (item: any) => {
  const updatedProducts = selectedProducts.value?.map(product => ({
    ...product,
    variants: product.variants.filter(variant => variant.id !== item.id)
  })).filter(product => product.variants.length > 0);

  setProducts(updatedProducts);
};

const productsHandle = () => {
	if (selectedProducts.value && selectedProducts.value.length > 0) {
		emit('next')
	} else {
		showMessage({ text: `Para poder continuar, es necesario agregar productos a la orden`, type: `error` })
	}
}

const openSelectProducts = async () => {
	await productPicker.dispatch(ResourcePicker.Action.OPEN);
}

onMounted(async () => {
	app.value = await initializeAppBridge();

	productPicker = ResourcePicker.create(app.value, {
	resourceType: ResourcePicker.ResourceType.Product,
	options: {
		selectMultiple: true,
		showHidden: false,
		showArchived: false,
		showDraftBadge: false
	}
	});

	productPicker.subscribe(ResourcePicker.Action.SELECT, ({ selection }) => {
	const mergedProducts = [...selectedProducts.value, ...selection].reduce((acc, product) => {
		const existingProduct = acc.find(p => p.id === product.id);
		if (existingProduct) {
			existingProduct.variants = [...existingProduct.variants, ...product.variants];
		} else {
			acc.push(product);
		}
		return acc;
	}, []);

		setProducts(mergedProducts);
	});

  if (selectedProducts.value?.length === 0 || selectedProducts.value === undefined) {
    openSelectProducts();
  }
});
</script>