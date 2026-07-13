<template>
	<v-container class="fill-screen pa-0" fluid>
		<v-row>
			<v-col cols="12">
				<NavBar :options="navBarOptions" />
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
				<router-view />
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts" setup>
import NavBar from '@/components/Partials/NavBar.vue'

const navBarOptions = [
	{ label: 'Inicio', route: 'root', path: '/' },
	{ label: 'Crear Pedido', route: 'create-order', path: 'create-orders' }
]
</script>