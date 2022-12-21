import { defineStore } from "pinia";
export const useSensorStore = defineStore("SensorData", {
    state: () => {
        return {
            sensorData: null,
        }
    },
    actions: {
        set(data) {
            this.sensorData = data;
        },
        get() {
            return this.sensorData;
        }
    }
});
