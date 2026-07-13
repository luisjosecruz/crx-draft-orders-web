<template>
	<v-container fluid class="fill-height mb-6">
		<v-row align="center" justify="center" no-gutters>
			<v-col cols="12" sm="4">
				<v-card class="text-center mt-6 pa-6 text-white" elevation="16" style="background-color: #170055;">
					<v-card-title>Draft Orders</v-card-title>
					<v-card-text>
						<CreatedBy />
						<VersionInfo />
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn class="bg-white text-button text-capitalize px-6" color="blue-grey-lighten" @click="redirectToShopify" elevated size="x-large">
							Comenzar una orden
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
import { Redirect } from '@shopify/app-bridge/actions'
import { initializeAppBridge } from '@/utils/shopifyAppBridge'
import CreatedBy from '@/components/Partials/CreatedBy.vue'
import VersionInfo from '@/components/Partials/VersionInfo.vue'

const app = ref<any>(null);

const redirectToShopify = () => {
	const redirect = Redirect.create(app.value)
	redirect.dispatch(Redirect.Action.APP, '/create-orders')
}

onMounted(async () => {
	app.value = await initializeAppBridge();
});
</script>