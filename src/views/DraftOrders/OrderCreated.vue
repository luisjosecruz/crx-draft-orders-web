<template>
	<v-container fluid class="fill-height mb-6">
		<v-row align="center" justify="center" no-gutters>
			<v-col cols="12" sm="6">
				<v-card class="text-center mt-6 pa-6 text-white" elevation="16">
					<v-card-title class="text-h4 text-green">La orden preliminar se creó con éxito</v-card-title>
					<v-card-text class="mt-6">
						<v-icon class="text-h1" color="green" size="x-large">mdi-cart-check</v-icon>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn class="bg-green text-button text-capitalize px-6" color="blue-grey-lighten" @click="redirectTo" elevated size="x-large">
							Ver el detalle de la orden creada
						</v-btn>
						<v-spacer></v-spacer>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Redirect } from '@shopify/app-bridge/actions'
import { initializeAppBridge } from '@/utils/shopifyAppBridge'

const app = ref<any>(null);

const route = useRoute()

const redirectTo = () => {
	const redirect = Redirect.create(app.value)
	redirect.dispatch(Redirect.Action.ADMIN_PATH, `/draft_orders/${route.query.draft_order_id}`)
}

onMounted(async () => {
	app.value = await initializeAppBridge();
});
</script>