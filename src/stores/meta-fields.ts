import { defineStore } from 'pinia'
import { useCommonStore } from '@/stores/common'
import metaFields from '@/services/meta-fields'
import type { Meta } from '@/types/meta'
import type { MetaField } from '@/types/meta-field'

interface metaFieldState {
	metaField: MetaField | undefined;
	metaFields: MetaField[] | undefined;
	metaFieldsMeta: Meta | undefined;
}

export const useMetaFieldsStore = defineStore('meta_fields', {
	state: (): metaFieldState => ({
		metaField: undefined,
		metaFields: undefined,
		metaFieldsMeta: undefined,
	}),
	actions: {
		fetchMetaField(meta_field_uuid: string) {
			const { loadingShow, loadingHide } = useCommonStore();

			loadingShow()
			return metaFields
				.get(meta_field_uuid)
				.then((resp: any) => {
					this.metaField = resp?.data;
				})
				.finally(() => loadingHide())
		},
		fetchMetaFields(query?: any) {
			const { loadingShow, loadingHide } = useCommonStore()

			loadingShow()
			return metaFields
				.list(query)
				.then((resp: any) => {
					this.metaFields = resp?.data;
					this.metaFieldsMeta = resp?.meta;
				})
				.finally(() => loadingHide())
		},
		createMetaField(shop: string, data: any) {
			return metaFields.store(shop, { ...data })
		},
		updateMetaField(meta_field_uuid: string, data: any) {
			return metaFields.update(meta_field_uuid, data)
		},
		deleteMetaField(meta_field_uuid: string) {
			const { loadingShow, loadingHide, showMessage } = useCommonStore()

			loadingShow()
			return metaFields
				.delete(meta_field_uuid)
				.then((resp: any) => {
					showMessage({ text: resp?.meta?.message, type: 'success' })
				})
				.finally(() => loadingHide())
		}
	}
})