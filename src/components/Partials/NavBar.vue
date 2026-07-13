<template>
	<v-tabs v-model="activeTab" bg-color="blue-grey-darken-4" fixed-tabs>
		<v-tab 
			v-for="(item, i) in options"
			:key="i"
			:value="item.route"
			@click="handleClick(item.route, item.path)"
		>
			{{ item.label }}
		</v-tab>
	</v-tabs>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Redirect } from '@shopify/app-bridge/actions'
import { initializeAppBridge } from '@/utils/shopifyAppBridge'

interface Props {
	options: Array<{ label: string, route: string, path: string }>
}

withDefaults(defineProps<Props>(), {})

const route = useRoute()
const router = useRouter()

const app = ref<any>(null)
const activeTab = ref(route.path)

const handleClick = (to: string, path: string) => {
	router.push({ name: to, query: route.query})

	const redirect = Redirect.create(app.value)
	redirect.dispatch(Redirect.Action.APP, `${path}`)
}

watch(route, (newRoute) => {
	activeTab.value = newRoute.path;
})

onMounted(async() => {
	app.value = await initializeAppBridge()
})
</script>