/**
 * author: Eric Bravo
 * email: eric@iterando.mx
 */

import createApp from '@shopify/app-bridge'
import { getSessionToken } from '@shopify/app-bridge-utils'
import axios from 'axios'

// Access the VITE_API_BASE_URL environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function initializeAppBridge() {
	const host = new URLSearchParams(window.location.search).get('host');
	const shop = new URLSearchParams(window.location.search).get('shop');

	if (!host || !shop) {
		throw new Error(`Host or shop parameter is missing in the URL.`);
	}

	// Fetch the api_key dynamically from the API
	const apiKey = await getApiKey(shop);

	if (!apiKey) {
		throw new Error(`API key not found for shop: ${shop}`);
	}

	const app = createApp({
		apiKey,
		host,
		shop,
		forceRedirect: false, // for staging and production change to true
	});

	return app;
}

export async function getAppBridgeSessionToken(app: any) {
	try {
		return await getSessionToken(app);
	} catch (error) {
		console.error(`Error getting session token:`, error);
	}
}

export async function getApiKey(shop: any): Promise<string | null> {
	try {
		// Use the VITE_API_BASE_URL env variable in the API request
		const response = await axios.get(`${API_BASE_URL}/shopify/shop`, {
			params: {
				shop: shop,
			},
		});

		// Assuming the response structure matches what you provided
		if (response.data?.meta?.code === 200 && response.data?.data?.api_key) {
			return response.data.data.api_key;
		} else {
			console.error(`Failed to fetch API key for shop: ${shop}`);
			return null;
		}
	} catch (error) {
		console.error(`Error fetching API key:`, error);
		return null;
	}
}