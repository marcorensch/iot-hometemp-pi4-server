<template>
  <div>
    <h2 class="nxd-card-title uk-margin-remove-bottom">Sensoren</h2>
    <div class="uk-grid-small uk-child-width-1-2" uk-grid>
      <Sensor v-for="sensor in sensors" :key="sensor.id" :sensor="sensor"/>
    </div>
  </div>
</template>

<script>
import Sensor from "@/components/Sensor";
import axios from "axios";

export default {
  name: 'Sensors',
  components: {
    Sensor
  },
  props: {},
  data() {
    return {
      sensors: null,
    }
  },
  mounted() {
    this.getListOfSensors();

  },
  methods: {
    getListOfSensors() {
      axios.get('http://localhost:3000/sensors').then(async (response) => {
        console.log(response.data);
        let i = 0;
        this.sensors = response.data.map((sensor) => {
          return {
            id: i++,
            name: sensor.sensor_id,
            temp: 0,
            hum: 0,
          }
        });
      }).then(() => {
        for (const sensor of this.sensors) {
          console.log(sensor.name);
          this.getLastSensorData(sensor);
        }
      });
    },
    getLastSensorData(sensor) {
      axios.get('http://localhost:3000/sensor/last', {
        params: {
          sensor_id: sensor.name
        }
      }).then((response) => {
        sensor.temp = response.data.temp;
        sensor.hum = response.data.hum;
      })
    },
  },
}
</script>