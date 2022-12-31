<template>
  <div>
    <Statusbar view="sensordetails"/>
    <div v-if="sensor?.data" class="content-container uk-padding-small uk-overflow-hidden"
         uk-height-viewport="offset-top:true;"
         :style="{ backgroundImage: 'url(' + bgimage + ')' }">
      <div class="uk-card uk-card-small uk-border-rounded nxd-dashboard-card uk-card-body">


        <h1 class="uk-h3">
          <font-awesome-icon icon="temperature-three-quarters" class="uk-margin-small-right"/>
          {{ sensor.name }}
        </h1>

        <Linechart class="uk-position-relative uk-height-medium" v-if="sensor.data" :chartData="sensor.data"/>
      </div>
    </div>

  </div>

</template>

<script>
import Statusbar from "@/components/Statusbar";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

import {useSensorStore} from "@/stores/SensorStore";
import Linechart from "@/components/Linechart";

import io from 'socket.io-client';

export default {
  name: 'SettingsView',
  components: {
    FontAwesomeIcon,
    Statusbar,
    Linechart
  },
  props: {},
  data() {
    return {
      socket: io('http://localhost:3000'),
      savedSettings: {},
      sensorStore: useSensorStore(),
      bgimage: require('@/assets/images/backgrounds/rain/max-bender-1YHXFeOYpN0-unsplash.jpg'),
      bgvideo: require('@/assets/videos/rain.mp4'),
      sensor: null,
    };
  },
  mounted() {
    this.sensor = this.sensorStore.get();
    this.sensor.data = null;
    this.getSensorHistory();
    this.socket.on('stored:sensorHistory', (data) => {
      const dates = data.map((item) => {
        const date = new Date(item.created)
        const hour = date.toLocaleTimeString("de-DE", {timeZone: "Europe/Berlin", hour: '2-digit', minute: '2-digit'})
        const day = date.toLocaleDateString("de-DE", {timeZone: "Europe/Berlin", day: '2-digit', month: '2-digit'})
        return `${day} ${hour}`
      });

      const temperatures = data.map((item) => item.temperature);
      const humidities = data.map((item) => item.humidity);


      this.sensor.data = {
        labels: dates.reverse(),
        datasets: [
          {
            label: 'Temperatur',
            data: temperatures.reverse(),
            fill: 'rgba(169,34,34,.5)',
            borderColor: 'rgb(169,34,34)',
            tension: .1
          },
          {
            label: 'Luftfeuchtigkeit',
            data: humidities.reverse(),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      }
    });
  },
  methods: {
    getSensorHistory() {
      if (this.sensor) {
        console.log('getSensorHistory', this.sensor.name);
      }
      this.socket.emit('get:getSensorHistory', this.sensor.name);
    }
  }
}
</script>
<style>
.content-container {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}
</style>
