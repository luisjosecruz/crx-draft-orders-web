<template>
	<v-dialog v-model="modalActive" width="auto">
		<v-card min-width="620" max-width="960" :prepend-icon="`mdi-${type}`" :title="title" :text="message?.text">
			<template v-slot:actions>
				<v-btn class="bg-red ms-auto px-6" @click="closeHandler">Cerrar</v-btn>
			</template>
		</v-card>
	</v-dialog>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCommonStore } from '@/stores/common'

const { message } = storeToRefs(useCommonStore())
const { hideMessage } = useCommonStore()

const modalActive = computed(() => (message.value ? true : false))
const type = computed(() => {
  let value = null
  switch (message.value?.type) {
    case 'error':
      value = 'alert-circle'
      break
    case 'info':
      value = 'information-variant-circle'
      break
    default:
      value = 'message-alert'
      break
  }

  return value
})

const title = computed(() => {
  let value = null
  switch (message.value?.type) {
    case 'error':
      value = 'Oooops'
      break
    case 'info':
      value = 'Info'
      break
    default:
      value = 'Importante'
      break
  }

  return value
})

const closeHandler = () => {
	hideMessage()
}
</script>