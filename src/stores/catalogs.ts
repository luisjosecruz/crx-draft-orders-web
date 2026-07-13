import { defineStore } from 'pinia'
import { useCommonStore } from '@/stores/common'
import catalogs from '@/services/catalogs'

interface catalogsState {
	countries: [] | undefined;
	provinces: [] | undefined;
	districts: [] | undefined;
	towns: [] | undefined;
	neighborhood: [] | undefined;
	employees: [] | undefined;
}

export const useCatalogsStore = defineStore('catalogs', {
	state: (): catalogsState => ({
		countries: undefined,
		provinces: undefined,
		districts: undefined,
		towns: undefined,
		neighborhood: undefined,
		employees: undefined,
	}),
	actions: {
		fetchCountries() {
			const { loadingShow, loadingHide } = useCommonStore();

			loadingShow()
			return catalogs
				.countries()
				.then((resp: any) => {
					this.countries = resp?.data;
				})
				.finally(() => loadingHide())
		},
		fetchProvinces(country: string) {
			const { loadingShow, loadingHide } = useCommonStore();

			loadingShow()
			return catalogs
				.provinces(country)
				.then((resp: any) => {
					this.provinces = resp?.data;
				})
				.finally(() => loadingHide())
		},
		fetchDistricts(country: string, province?: string) {
			const { loadingShow, loadingHide } = useCommonStore();

			loadingShow()
			return catalogs
				.districts(country, province)
				.then((resp: any) => {
					this.districts = resp?.data;
				})
				.finally(() => loadingHide())
		},
		fetchTowns(district: string) {
			const { loadingShow, loadingHide } = useCommonStore();

			loadingShow()
			return catalogs
				.towns(district)
				.then((resp: any) => {
					this.towns = resp?.data;
				})
				.finally(() => loadingHide())
		},
		fetchNeighborhood(town: string) {
			const { loadingShow, loadingHide } = useCommonStore();
			loadingShow()
			return catalogs
				.neighborhood(town)
				.then((resp: any) => {
					this.neighborhood = resp?.data;
				})
				.finally(() => loadingHide())
		},
		fetchEmployees() {
			const { loadingShow, loadingHide } = useCommonStore()

			loadingShow()
			return catalogs
				.employees()
				.then((resp: any) => {
					this.employees = resp?.data
				})
				.finally(() => loadingHide())
		},
	}
})