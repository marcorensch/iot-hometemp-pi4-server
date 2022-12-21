<template>
  <div>
    <Statusbar view="sensordetails"/>
    <div v-if="sensor?.data" class="settings-container uk-padding-small uk-overflow-hidden"
         uk-height-viewport="offset-top:true;">
      <h1>
        <font-awesome-icon icon="cogs"/>
        {{ sensor.name }}
      </h1>
    </div>

  </div>

</template>

<script>
import Statusbar from "@/components/Statusbar";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

import { useSensorStore } from "@/stores/SensorStore";

import io from 'socket.io-client';
import {useInputStore} from "@/stores/InputStore";

export default {
  name: 'SettingsView',
  components: {
    FontAwesomeIcon,
    Statusbar
  },
  props: {

  },
  data() {
    return {
      socket: io('http://localhost:3000'),
      savedSettings: {},
      sensorStore: useSensorStore(),
      sensor: null,
    };
  },
  mounted() {
    this.getSensorHistory();
    this.sensor = this.sensorStore.get();
    this.socket.on('sensorHistory', (data) => {
      this.sensor.data = data;
    });
  },
  methods: {
    getSensorHistory() {
      if(this.sensor) {
        console.log('getSensorHistory', this.sensor.name);
      }
      // this.socket.emit('getSensorHistory', this.sensor_id);
    }
  }
}
</script>
<style>
.settings-container {
  background-color: #e3e3e3;
  color: #262626;
}

.nxd-button-success {
  background-color: #00a80e;
  color: #fff;
}
</style>
