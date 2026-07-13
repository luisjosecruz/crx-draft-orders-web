import { defineStore } from "pinia";

interface commonStore {
	message: messagesInfo | undefined;
	loader: boolean;
}

type messagesInfo = {
	text: string;
	type: string;
}

export const useCommonStore = defineStore('common', {
	state: (): commonStore => ({
		message: undefined,
		loader: false
	}),
	actions: {
		showMessage(payload: any) {
         this.message = payload
      },
      hideMessage() {
         this.message = undefined
      },
      loadingShow() {
         return (this.loader = true)
      },
      loadingHide() {
         return (this.loader = false)
      },
	}
})