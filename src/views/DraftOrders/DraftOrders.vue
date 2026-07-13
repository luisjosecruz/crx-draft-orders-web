<template>
	<v-container>
		<v-row>
			<v-col>
				<v-stepper
					v-model="step"
					hide-actions
				>
					<template v-slot:default="{ prev, next }">
						<v-stepper-header>
							<template v-for="(n, i) in items" :key="`${i}-step`">
								<v-stepper-item
									:complete="step > i"
									:step="n"
									:value="i+1"
								>
									{{ n.label }}
								</v-stepper-item>
								<v-divider
									v-if="i < items.length - 1"
									:key="i"
								></v-divider>
							</template>
						</v-stepper-header>

						<v-stepper-window>
							<v-stepper-window-item
								v-for="(n, i) in items"
								:key="`${i}-content`"
								:value="i"
							>
								<component
									:is="items[step].component"
									@next="nextStep"
									@prev="prevStep"
								/>
							</v-stepper-window-item>
						</v-stepper-window>
					</template>
				</v-stepper>
			</v-col>
		</v-row>
	</v-container>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import ClientForm from '@/views/DraftOrders/components/ClientForm.vue'
import OrderSummary from '@/views/DraftOrders/components/OrderSummary.vue'
import ProductsTable from '@/views/DraftOrders/components/ProductsTable.vue'

const items = [
	{ label: 'Productos', component: ProductsTable },
	{ label: 'Cliente', component: ClientForm },
	{ label: 'Revisar Orden', component: OrderSummary }
];

const step = ref(0)

const nextStep = () => {
	if (step.value < items.length - 1) {
		step.value++
	}
}

const prevStep = () => {
	if (step.value > 0) {
		step.value--
	}
}
</script>