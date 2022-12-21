import { defineStore } from "pinia";
export const useMeteoDataStore = defineStore("MeteoData", {
    state: () => {
        return {
            meteoData: null,
        }
    },
    actions: {
        set(data) {
            this.meteoData = data;
        },
        get() {
            return this.meteoData;
        }
    }
});
