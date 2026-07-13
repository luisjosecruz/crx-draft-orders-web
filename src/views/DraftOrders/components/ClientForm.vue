<template>
	<v-container fluid>
		<v-row justify="end">
			<v-col cols="auto" class="me-auto">
				<h3 class="text-h5">Cliente</h3>
			</v-col>
			<v-col cols="auto">
				<v-dialog max-width="600">
					<template v-slot:activator="{ props: activatorProps }">
						<!-- <v-btn v-if="selectedCustomer && selectedCustomer.id" color="teal" size="large" class="mr-3" @click="redirectToEditCustomers">Modificar cliente</v-btn> -->
						<v-btn v-if="selectedCustomer && selectedCustomer.id" color="teal" size="large" class="mr-3" @click="openEditModal(selectedCustomer.id)">Modificar cliente</v-btn>
						<v-btn color="teal" size="large" class="mr-3" @click="redirectToCustomers">Crear cliente</v-btn>
						<v-btn v-bind="activatorProps" color="primary" @click="handleClearCustomerSelector" size="large">Seleccionar Cliente</v-btn>
						<v-dialog v-model="isEditModalOpen" max-width="800">
							<v-card>
								<v-card-title class="text-h5">Editar dirección del cliente</v-card-title>
								<v-card-text>

									<v-form v-if="formData" ref="editForm" @submit.prevent="saveCustomerAddress(selectedCustomer.id)">
										<v-select
										v-model="formData.country"
										:label="'País'"
										:items="countries"
										item-title="name"
										item-value="code"
										:rules="[value => !!value || 'Este campo es obligatorio']"
										@update:model-value="newValue => onCountryChange(newValue)"
										dense
										/>
										<v-row>
											<v-col cols="6"><v-text-field v-model="formData.firstName" label="Nombre" required></v-text-field></v-col>
											<v-col cols="6"><v-text-field v-model="formData.lastName" label="Apellido" required ></v-text-field></v-col>
										</v-row>
										<v-text-field v-model="formData.company" label="Empresa"></v-text-field>
										<v-text-field v-model="formData.address1" label="Dirección" required></v-text-field>
										<v-text-field v-model="formData.address2" label="Apartamento, local, etc."></v-text-field>
										<v-row>
											<v-col cols="6"><v-text-field v-model="formData.city" label="Ciudad" required></v-text-field></v-col>
											<v-col cols="6"><v-text-field v-model="formData.zip" label="Código postal"></v-text-field></v-col>
										</v-row>

										<template v-if="hasDepartmentData">
											<v-select
											v-model="formData.state"
											:label="'Departamento / Provincia'"
											:items="departmentOptions"
											item-title="name"
											item-value="code"
											:rules="[value => !!value || 'Este campo es obligatorio']"
											dense
											/>
										</template>
										<template v-else>
											<v-text-field
											v-model="formData.state"
											:label="'Departamento / Provincia'"
											:rules="[value => !!value || 'Este campo es obligatorio']"
											dense
											/>
										</template>

										<!-- <v-text-field v-model="formData.state" label="Departamento"></v-text-field> -->
										<v-text-field v-model="formData.phone" label="Teléfono" required></v-text-field>
									</v-form>

								</v-card-text>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="grey" text @click="isEditModalOpen = false">Cancelar</v-btn>
									<v-btn color="primary" text @click="saveCustomerAddress(selectedCustomer.id)">Guardar</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</template>

					<template v-slot:default="{ isActive }">
						<v-card title="Seleccionar cliente">
							<v-card-text>
								<p class="mb-3">
									Si el cliente no aparece en la lista, usa el campo de texto
									para buscarlo por <strong>correo electrónico</strong> o por <strong>Id</strong> de cliente.
									Presiona la lupa y posteriormente seleccionalo en la lista.
								</p>
								<v-text-field v-model="searchEmail" label="Correo electrónico" clearable
									placeholder="john@doe.com" append-inner-icon="mdi-magnify" type="email"
									@click:clear="handleClearCustomerSelector"
									@click:append-inner="searchCustomer"></v-text-field>

								<v-text-field v-model="searchCustomerId" label="Id del cliente" clearable
									placeholder="12345678910112233" append-inner-icon="mdi-magnify" :maxlength="20"
									@click:clear="handleClearCustomerSelector"
									@click:append-inner="getCustomerById"></v-text-field>

								<v-autocomplete label="Selecciona un cliente" v-model="customer" :items="customers"
									:item-title="(item) =>
											`${item.id} - ${item.first_name} ${item.last_name}`
										" item-value="id" item-props :return-object="true"></v-autocomplete>
							</v-card-text>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn text="Cerrar sin seleccionar" @click="isActive.value = false; clearCustomerHandler();" color="teal"></v-btn>
								<v-btn text="Seleccionar" @click="isActive.value = false; selectCustomerHandler();"></v-btn>
							</v-card-actions>
						</v-card>
					</template>
				</v-dialog>
			</v-col>
		</v-row>
	</v-container>
	<v-container fluid v-if="selectedCustomer">
		<v-row no-gutters>
			<v-col cols="12">
				<v-card class="">
					<v-card-title class="mb-3 text-small">Información del cliente</v-card-title>
					<v-card-text>
						<v-container fluid class="pa-2">
							<v-row no-gutters>
								<v-col cols="6" class="pa-0">
									<v-container>
										<template v-for="(field, index) in customerDetails" :key="index">
											<v-row no-gutters v-if="field.value">
												<v-col cols="4" class="pa-0 font-weight-bold">{{field.label}}</v-col>
												<v-col cols="auto" class="pa-0">{{field.value}}</v-col>
											</v-row>
										</template>
									</v-container>
								</v-col>
								<!-- Fixed custom fields -->
								<v-col cols="6" class="pa-0">
									<v-container>
										<v-row no-gutters>
											<v-col cols="12" v-for="(field, index) in mandatoryMetaFields" :key="index"
												class="pa-0 py-1">
												<v-select v-if="
													field.key !== 'customerId' &&
													field.key !== 'employeeId'
												" v-model="field.value" :label="field.display_name" :rules="[
							(value) => !!value || 'Este campo es obligatorio',
						]" :items="getFieldOptions(field)" item-title="name" :item-value="field.key === 'distrito' ||
								field.key === 'department'
								? 'code'
								: 'id'
							" @update:model-value="(newValue) => onFieldChange(field, newValue)
							" return-object dense required></v-select>

												<v-text-field v-else-if="field.key === 'customerId'"
													v-model="field.value" :label="field.display_name" :rules="[
														(value) => !!value || 'Este campo es obligatorio',
													]" :max-length="18" @input="
							updateValue(field.namespace, field.key, field.value)
							" @keypress="isAlphaNumeric($event)" dense required></v-text-field>

												<v-autocomplete v-else v-model="field.value" :label="field.display_name"
													:rules="[
														(value) => !!value || 'Este campo es obligatorio',
													]" :items="employees" :item-title="(item) => `${item.employee_code} - ${item.name}`
							" item-value="employee_code" item-props :return-object="true" @update:model-value="(newValue) => onFieldChange(field, newValue)
							" dense required></v-autocomplete>
											</v-col>
										</v-row>
									</v-container>
								</v-col>
							</v-row>
						</v-container>
					</v-card-text>
				</v-card>
			</v-col>
			<!-- custom fields from API -->
			<v-col>
				<v-container>
					<v-form ref="form" @submit.prevent="handleSubmit">
						<v-row no-gutters>
							<v-col cols="12" v-for="(field, index) in metaFields" :key="index">
								<v-text-field v-model="field.value" :label="field.display_name"
									:rules="[(value) => !!value || 'Este campo es obligatorio']"
									:data-namespace="field.namespace" :data-key="field.key"
									@input="updateValue(field.namespace, field.key, field.value)" dense
									required></v-text-field>
							</v-col>
						</v-row>
					</v-form>
				</v-container>
			</v-col>
		</v-row>
	</v-container>
	<v-container fluid v-else>
		<v-row no-gutters>
			<v-col>
				<v-card>
					<v-card-text class="pa-10">
						<h3>No se ha seleccionado un cliente</h3>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
	<v-container fluid>
		<v-row no-gutters>
			<v-col class="text-start">
				<v-btn @click="$emit('prev')" variant="flat" size="large" color="pink">Seleccionar productos</v-btn>
			</v-col>
			<v-col class="text-end">
				<v-btn @click="handleSubmit" variant="flat" size="large" color="green">Ver resumen del pedido</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { CONSTANTS } from "@/constants";
import { useCommonStore } from "@/stores/common";
import { useShopifyStore } from "@/stores/shopify";
import { useCatalogsStore } from "@/stores/catalogs";
import { useDraftOrdersStore } from "@/stores/drafts";
import { Redirect } from "@shopify/app-bridge/actions";
import { useMetaFieldsStore } from "@/stores/meta-fields";
import { initializeAppBridge } from "@/utils/shopifyAppBridge";
import { COMMONS } from "@/constants/commons";

const route = useRoute();

const emit = defineEmits(["next", "prev"]);

const { showMessage } = useCommonStore();

const { fetchDistricts, fetchTowns, fetchNeighborhood, fetchEmployees } = useCatalogsStore();
const { districts, towns, neighborhood, employees } = storeToRefs(useCatalogsStore());

const { fetchCustomers, fetchCustomer, fetchSearchCustomer, fetchCustomerAdd, updateCustomerAddress, createCustomerAddress } = useShopifyStore();
const { customers } = storeToRefs(useShopifyStore());

const { setCustomer, setMetaFields } = useDraftOrdersStore();
const { selectedCustomer, selectedMetaFields } = storeToRefs(
	useDraftOrdersStore()
);

const { fetchMetaFields } = useMetaFieldsStore();
const { metaFields } = storeToRefs(useMetaFieldsStore());

const app = ref<any>(null);
const customer = ref();
const mandatoryMetaFields = ref([]);
console.log("mandatoryMetaFields");
console.log(mandatoryMetaFields);
const clientForm = ref();
const searchEmail = ref();
const searchCustomerId = ref();

const customerDetails = computed(() => {
	const countryCode = selectedCustomer.value?.default_address?.country_code || "CR";
	const labels = COMMONS.LABELS[countryCode] || COMMONS.LABELS["CR"];

	return [
		{
			label: labels.client,
			value: `${selectedCustomer.value?.first_name || selectedCustomer.value?.default_address.first_name} ${selectedCustomer.value?.last_name || selectedCustomer.value?.default_address.last_name}`,
		},
		{
			label: labels.address,
			value: `${selectedCustomer.value?.default_address?.address1 || "."} ${selectedCustomer.value?.default_address?.address2 || "."}`,
		},
		{
			label: labels.country,
			value: selectedCustomer.value?.default_address?.country || ".",
		},
		...(labels.province
			? [
				{
					label: labels.province,
					value: selectedCustomer.value?.default_address?.province || ".",
				},
			]
			: []),
		{
			label: labels.city,
			value: selectedCustomer.value?.default_address?.city || ".",
		},
		{ 
			label: labels.email, 
			value: selectedCustomer.value?.email || "." 
		},
	];
});

const redirectToCustomers = () => {
	const redirect = Redirect.create(app.value);
	redirect.dispatch(Redirect.Action.ADMIN_PATH, {
		path: "/customers/new",
		newContext: true,
	});
};

/* -------------------------------------------------------------------------- */
/*                    Redireccionar a la ficha del cliente                    */
/* -------------------------------------------------------------------------- */
const redirectToEditCustomers = () => {
	console.log("Modificar Cliente");
	console.log(selectedCustomer.value?.first_name);
	console.log(selectedCustomer.value?.id);
	const redirect = Redirect.create(app.value);
	redirect.dispatch(Redirect.Action.ADMIN_PATH, {
		path: "/customers/" + selectedCustomer.value?.id,
		newContext: true,
	});
};

const getFieldOptions = (field: any) => {
	console.log("getFieldOptions");
	console.log(field);
	const country = selectedCustomer.value?.default_address?.country_code;
	console.log("getFieldOptions key: " +field.key);
	switch (field.key) {
		case "municipio":
			if (country === "GT" || country === "SV") {
				return Array.isArray(districts.value)
					? districts.value.map((d) => ({
						id: d.id,
						name: d.name,
						code: d.code,
					}))
					: [];
			} else {
				return Array.isArray(towns.value)
					? towns.value.map((t) => ({ id: t.id, name: t.name }))
					: [];
			}
			break;
		case "canton":
		case "department":
			if (country === "CR" || country === "HN" || country === "NI") {
				return Array.isArray(districts.value)
					? districts.value.map((d) => ({
						id: d.id,
						name: d.name,
						code: d.code,
					}))
					: [];
			}
			break;
		case "distrito":
			if (country === "PA") {
				console.log(districts);
				return Array.isArray(districts.value)
					? districts.value.map((d) => ({ id: d.id, name: d.name, code: d.code, }))
					: [];
			} else {
				return Array.isArray(towns.value)
					? towns.value.map((t) => ({ id: t.id, name: t.name }))
					: [];
			}
			break;
		case "corregimiento":
			return Array.isArray(towns.value)
				? towns.value.map((c) => ({id: c.id, name: c.name, }))
				: [];
			break;
		case "barrio":
			return Array.isArray(neighborhood.value)
				? neighborhood.value.map((n) => ({ id: n.id, name: n.name, }))
				: [];
			break;
		case "employeeId":
			return Array.isArray(employees.value)
				? employees.value.map((t) => ({ id: t.employee_code, name: t.name }))
				: [];
			break;
		default:
			return [];
	}
};

const onFieldChange = async (field: any, newValue: any) => {
	field.value = newValue;
	const country = selectedCustomer.value?.default_address?.country_code;
	if (field.key === "department" || field.key === "canton") {
		clearDependentFields();
		if (country === "CR" || country === "HN" || country === "NI") {
			await fetchTowns(newValue.code);
		}
	} else if (field.key === "municipio" || field.key === "distrito") {
		if (country === "GT" || country === "SV" || country === "PA") {
			await fetchTowns(newValue.code);
		}
	} else if (field.key === "corregimiento") {
		if (country === "PA") {
			await fetchNeighborhood(newValue.id);
		}
	}

	updateValue(field.namespace, field.key, newValue);
};

const handleClearCustomerSelector = async () => {
	searchEmail.value = null;
	searchCustomerId.value = null;
	await fetchCustomers(route.query);
};

const searchCustomer = async () => {
	if (
		searchEmail.value != null &&
		searchEmail.value != undefined &&
		searchEmail.value != ""
	) {
		await fetchSearchCustomer({ email: searchEmail.value, ...route.query });
	} else {
		showMessage({
			text: `Es necesario ingresar un correo electrónico.`,
			type: "error",
		});
	}
};

const getCustomerById = async () => {
	if (
		searchCustomerId.value != null &&
		searchCustomerId.value != undefined &&
		searchCustomerId.value != ""
	) {
		await fetchCustomer(route.query, searchCustomerId.value);
	} else {
		showMessage({
			text: `Es necesario ingresar un ID de Cliente.`,
			type: "error",
		});
	}
};

const clearDependentFields = () => {
	towns.value = [];
};

const updateValue = (namespace: string, key: string, value: string) => {
	const index = selectedMetaFields.value.findIndex(
		(field) => field.namespace === namespace && field.key === key
	);

	if (index !== -1) {
		selectedMetaFields.value[index].value = value;
	} else {
		selectedMetaFields.value.push({ namespace, key, value });
	}
};

const handleSubmit = async () => {
	const form = clientForm.value?.$refs.form;
	const isFormValid = form ? await form.validate() : true;

	const areFixedFieldsValid = mandatoryMetaFields.value.every(
		(field) => field.value
	);

	if (isFormValid && areFixedFieldsValid && selectedCustomer.value) {
		// Create a map to ensure fields are unique by their `namespace` and `key`
		const fieldMap = new Map<string, any>();

		// Add existing selectedMetaFields to the map
		selectedMetaFields.value.forEach((field) => {
			const key = `${field.namespace}:${field.key}`;
			fieldMap.set(key, field);
		});

		// Add mandatoryMetaFields to the map (this will overwrite duplicates)
		mandatoryMetaFields.value.forEach((field) => {
			const key = `${field.namespace}:${field.key}`;
			fieldMap.set(key, field);
		});

		// Convert the map back to an array
		const mergedFields = Array.from(fieldMap.values());

		// Update the selectedMetaFields state
		setMetaFields(mergedFields);

		emit("next");
	} else {
		showMessage({
			text: `Para poder continuar, es necesario agregar un cliente a la orden, y llenar los datos faltantes.`,
			type: `error`,
		});
	}
};

const selectCustomerHandler = async () => {
	setCustomer(customer.value);

	mandatoryMetaFields.value = CONSTANTS[customer.value.default_address?.country_code] || [];
	console.log("Country: " + customer.value.default_address?.country_code);
	console.log("Province_code: " + customer.value.default_address?.province_code);
	await fetchDistricts(
		customer.value.default_address?.country_code,
		customer.value.default_address?.province_code
	);
};

const clearCustomerHandler = () => {
	customer.value = null;
	setCustomer(customer.value);
};

const isAlphaNumeric = (e) => {
	let char = String.fromCharCode(e.keyCode);
	if (/^[A-Za-v0-9]+$/.test(char)) return true;

	e.preventDefault();
};

onMounted(async () => {
	app.value = await initializeAppBridge();

	await fetchCustomers(route.query);
	await fetchMetaFields(route.query);
	await fetchEmployees();

	// Ensure each metaField has a `value` property, even if initially empty.
	metaFields.value = metaFields.value.map((field) => ({
		...field,
		value: field.value || "",
	}));

	if (selectedCustomer.value !== undefined && selectedCustomer.value !== null) {
		const countryCode = selectedCustomer.value.default_address?.country_code;

		mandatoryMetaFields.value = CONSTANTS[countryCode];

		if (countryCode) {
			await fetchDistricts(
				countryCode,
				selectedCustomer.value?.default_address?.province_code
			);
		}
	}
});


/* -------------------------------------------------------------------------- */
/*                        Power By: Luis José Cruz Mart                       */
/* -------------------------------------------------------------------------- */
const fetchUpdatedCustomerDetails = async (customerId) => {	
	try {
        const updatedCustomer = await fetchCustomer(route.query, customerId);
        console.log("Fetched Customer: ", updatedCustomer);

        if (!updatedCustomer || updatedCustomer.length === 0) {
            throw new Error("No se obtuvieron detalles actualizados...");
        }

        selectedCustomer.value = updatedCustomer[0];
        console.log("Cliente actualizado fetchUpdatedCustomerDetails:", selectedCustomer.value);

		const countryCode = selectedCustomer.value.default_address?.country_code;
        // mandatoryMetaFields.value = CONSTANTS[countryCode] || [];
        mandatoryMetaFields.value = (CONSTANTS[countryCode] || []).map((field) => ({
            ...field,
            value: "",
        }));

        if (countryCode) {
            await fetchDistricts(
                countryCode,
                selectedCustomer.value.default_address?.province_code
            );
        }

    } catch (error) {
        console.error("Error al obtener los detalles actualizados en fetchUpdatedCustomerDetails:", error);
    }
};

const formData = reactive({
  firstName: '',
  lastName: '',
  company: '',
  address1: '',
  address2: '',
  city: '',
  zip: '',
  state: '',
  phone: '',
  country: '', 
  id: '',
});

const countries = [
	{ code: "SV", name: "El Salvador" },
	{ code: "GT", name: "Guatemala" },
	{ code: "HN", name: "Honduras" },
	{ code: "CR", name: "Costa Rica" },
	{ code: "NI", name: "Nicaragua" },
	{ code: "PA", name: "Panamá" },
	{ code: "CO", name: "Colombia" },
	{ code: "US", name: "Estados Unidos" },
	{ code: "MX", name: "México" },
	{ code: "AR", name: "Argentina" },
	{ code: "CU", name: "Cuba" },
	{ code: "BO", name: "Bolivia" },
	{ code: "CL", name: "Chile" },
	{ code: "BR", name: "Brasil" },
	{ code: "CA", name: "Canadá" },
	{ code: "EC", name: "Ecuador" },
	{ code: "PY", name: "Paraguay" },
	{ code: "UY", name: "Uruguay" },
	{ code: "DO", name: "República Dominicana" },
	{ code: "VE", name: "Venezuela" },
	{ code: "PE", name: "Perú" },
];

const onCountryChange = (newValue) => {
  	console.log('País actualizado:', newValue);

	if (!departmentData[newValue]) {
		formData.state = ""; 
	}
};

const saveCustomerAddress = async (customerId) => {
	console.log('Formulario enviado:', formData);

	try {
		const payload = {
			...route.query,
			address: {
				first_name: formData.firstName,
				last_name: formData.lastName,
				company: formData.company,
				address1: formData.address1,
				address2: formData.address2,
				city: formData.city,
				zip: formData.zip,
				province: formData.state,
				phone: formData.phone,
				country: formData.country,
			},
			address_id: formData.id,
		};

		console.log("Payload: ", payload);
		let response;

		if (formData.id) {
			response = await updateCustomerAddress(payload, customerId);
			showMessage({ text: "Dirección actualizada exitosamente", type: "success" });
		} else {
			response = await createCustomerAddress(payload, customerId);
			showMessage({ text: "Dirección creada exitosamente", type: "success" });
		}
		
		console.log('Response: ', response);

		await fetchUpdatedCustomerDetails(customerId);
		
		isEditModalOpen.value = false;
	} catch (error) {
		console.error('Error al guardar la dirección:', error);
		showMessage({ text: "Error al actualizar la dirección", type: "error" });
	}
};

let isEditModalOpen = ref(false);

const openEditModal = async (customerId) => {
  await fetchCustomerAddress(customerId);
  isEditModalOpen.value = true;
};

const fetchCustomerAddress = async (customerId) => {
  try {
    const response = await fetchCustomerAdd(route.query, customerId);

    if (!response) {
      throw new Error("Error al obtener la dirección del cliente");
    }

    const address = response?.default_address;
    console.log("Dirección: ", address);
	
    if (address) {
		const country = countries.find(c => c.code === address.country_code);
		formData.country = country ? country.code : "";
		formData.firstName = address.first_name || "";
		formData.lastName = address.last_name || "";
		formData.company = address.company || "";
		formData.address1 = address.address1 || "";
		formData.address2 = address.address2 || "";
		formData.city = address.city || "";
		formData.zip = address.zip || "";
		formData.state = address.province || "";
		formData.phone = address.phone || "";
		formData.id = address.id || "";
    } else {
      showMessage({
        text: "No se encontró dirección para este cliente.",
        type: "error",
      });
    }
  } catch (error) {
    console.error("Error al obtener la dirección del cliente:", error);
    showMessage({
      text: "Error al cargar la dirección del cliente.",
      type: "error",
    });
  }
};


const departmentData = {
  SV: [
    { code: "Ahuachapán", name: "Ahuachapán" },
    { code: "Cabañas", name: "Cabañas" },
    { code: "Chalatenango", name: "Chalatenango" },
    { code: "Cuscatlán", name: "Cuscatlán" },
    { code: "La Libertad", name: "La Libertad" },
    { code: "La Paz", name: "La Paz" },
    { code: "La Unión", name: "La Unión" },
    { code: "Morazán", name: "Morazán" },
    { code: "San Miguel", name: "San Miguel" },
    { code: "San Salvador", name: "San Salvador" },
    { code: "San Vicente", name: "San Vicente" },
    { code: "Santa Ana", name: "Santa Ana" },
    { code: "Sonsonate", name: "Sonsonate" },
    { code: "Usulután", name: "Usulután" },
  ],
  GT: [
    { code: "Alta Verapaz", name: "Alta Verapaz" },
    { code: "Baja Verapaz", name: "Baja Verapaz" },
    { code: "Chimaltenango", name: "Chimaltenango" },
    { code: "Chiquimula", name: "Chiquimula" },
    { code: "El Progreso", name: "El Progreso" },
    { code: "Escuintla", name: "Escuintla" },
    { code: "Guatemala", name: "Guatemala" },
    { code: "Huehuetenango", name: "Huehuetenango" },
    { code: "Izabal", name: "Izabal" },
    { code: "Jalapa", name: "Jalapa" },
    { code: "Jutiapa", name: "Jutiapa" },
    { code: "Petén", name: "Petén" },
    { code: "Quetzaltenango", name: "Quetzaltenango" },
    { code: "Quiché", name: "Quiché" },
    { code: "Retalhuleu", name: "Retalhuleu" },
    { code: "Sacatepéquez", name: "Sacatepéquez" },
    { code: "San Marcos", name: "San Marcos" },
    { code: "Santa Rosa", name: "Santa Rosa" },
    { code: "Solola", name: "Solola" },
    { code: "Suchitepéquez", name: "Suchitepéquez" },
    { code: "Totonicapán", name: "Totonicapán" },
    { code: "Zacapa", name: "Zacapa" },
  ],
  HN: [
    { code: "Atlántida", name: "Atlántida" },
    { code: "Choluteca", name: "Choluteca" },
    { code: "Colón", name: "Colón" },
    { code: "Comayagua", name: "Comayagua" },
    { code: "Copán", name: "Copán" },
    { code: "Cortés", name: "Cortés" },
    { code: "El Paraíso", name: "El Paraíso" },
    { code: "Francisco Morazán", name: "Francisco Morazán" },
    { code: "Gracias a Dios", name: "Gracias a Dios" },
    { code: "Intibucá", name: "Intibucá" },
    { code: "Islas de la Bahía", name: "Islas de la Bahía" },
    { code: "La Paz", name: "La Paz" },
    { code: "Lempira", name: "Lempira" },
    { code: "Ocotepeque", name: "Ocotepeque" },
    { code: "Olancho", name: "Olancho" },
    { code: "Santa Bárbara", name: "Santa Bárbara" },
    { code: "Valle", name: "Valle" },
    { code: "Yoro", name: "Yoro" },
  ],
  NI: [
    { code: "Boaco", name: "Boaco" },
    { code: "Carazo", name: "Carazo" },
    { code: "Chinandega", name: "Chinandega" },
    { code: "Chontales", name: "Chontales" },
    { code: "Estelí", name: "Estelí" },
    { code: "Granada", name: "Granada" },
    { code: "Jinotega", name: "Jinotega" },
    { code: "León", name: "León" },
    { code: "Madriz", name: "Madriz" },
    { code: "Managua", name: "Managua" },
    { code: "Masaya", name: "Masaya" },
    { code: "Matagalpa", name: "Matagalpa" },
    { code: "Nueva Segovia", name: "Nueva Segovia" },
    { code: "Rivas", name: "Rivas" },
    { code: "Río San Juan", name: "Río San Juan" },
    { code: "Región Autónoma de la Costa Caribe Norte", name: "Región Autónoma de la Costa Caribe Norte" },
    { code: "Región Autónoma de la Costa Caribe Sur", name: "Región Autónoma de la Costa Caribe Sur" },
  ],
  CR: [
    { code: "San José", name: "San José" },
    { code: "Alajuela", name: "Alajuela" },
    { code: "Cartago", name: "Cartago" },
    { code: "Heredia", name: "Heredia" },
    { code: "Guanacaste", name: "Guanacaste" },
    { code: "Puntarenas", name: "Puntarenas" },
    { code: "Limón", name: "Limón" },
  ],
  PA: [
    { code: "BOCAS DEL TORO", name: "BOCAS DEL TORO" },
    { code: "CHIRIQUI", name: "Chiriqui" },
    { code: "COCLE", name: "Cocle" },
    { code: "COLON", name: "Colon" },
    { code: "COMARCA EMBERA", name: "Comarca Embera" },
    { code: "COMARCA KUNA YALA", name: "Comarca Kuna Yala" },
    { code: "COMARCA NGOBE BUGLE", name: "Comarca Ngobe Bugle" },
	{ code: "DARIEN", name: "Darien" },
	{ code: "HERRERA", name: "Herrera" },
	{ code: "LOS SANTOS", name: "Los Santos" },
	{ code: "PANAMA", name: "Panama" },
	{ code: "PANAMA OESTE", name: "Panama Oeste" },
	{ code: "VERAGUAS", name: "Veraguas" },
  ],
};

const departmentOptions = computed(() => {
    return departmentData[formData.country] || [];
});

const hasDepartmentData = computed(() => departmentOptions.value.length > 0);
</script>
