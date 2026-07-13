import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from '@/App.vue'
import router from '@/router'

import Default from '@/layouts/Default.vue'

const app = createApp(App)

app.component('default-layout', Default)

app.use(createVuetify({
	icons: {
		defaultSet: 'mdi',
	},
	components,
	directives,
})).use(createPinia()).use(router)

app.mount('#app')
