<template>
	<v-overlay class="align-center justify-center text-center" opacity="80%" v-model="loader" :persistent="true">
		<v-progress-circular
        color="white"
        size="90"
        indeterminate
		  width="3"
      ></v-progress-circular>
		<div class="text-center mt-10 text-white">
			Espera un momento...
		</div>
	</v-overlay>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useCommonStore } from '@/stores/common'

const { loader } = storeToRefs(useCommonStore())
</script>