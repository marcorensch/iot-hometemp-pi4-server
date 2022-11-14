<template>
  <div>
    <Statusbar view="settings"/>
    <div class="settings-container uk-padding-small uk-overflow-hidden"
         uk-height-viewport="offset-top:true;">
      <h1>
        <font-awesome-icon icon="cogs"/>
        Einstellungen
      </h1>

      <!-- This is the nav containing the toggling elements -->
      <ul uk-tab>
        <li><a href="#">
          <font-awesome-icon icon="server"/>
          Sensoren</a></li>
        <li><a href="#">
          <font-awesome-icon icon="cloud-sun-rain"/>
          Meteo</a></li>
      </ul>

      <!-- This is the container of the content items -->
      <ul class="uk-switcher">
        <li>
          <h4>Sensoren</h4>
          <div class="uk-height-small uk-overflow-auto" style="padding-right: 50px;" uk-margin>

            <div v-for="(sensor, index) of sensorsFound" :key="index">
              <div class="uk-card uk-card-default uk-card-body uk-card-small" @click="toggleSelectedSensor(sensor)">
                <div class="uk-flex uk-flex-middle">
                  <div class="uk-width-expand">
                    <div class="sensor-label">{{sensor.label || "Unbenannt"}}</div>
                    <div class="sensor-id uk-text-meta"><span>Sensor Gruppe {{sensor.topicId}}</span></div>
                  </div>
                  <div>
                    <font-awesome-icon icon="check" :class="{'uk-text-success': sensor.selected }"/>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </li>
        <li>
          <h4>Meteo</h4>

        </li>
      </ul>

      <form class="uk-form-stacked">

      </form>
      <div class="uk-margin-top">
        <button @click="saveSettings" class="uk-button nxd-button-success">Speichern</button>
      </div>
    </div>
    <div id="keyboardSpacer" class="uk-hidden" style="height: 230px;"></div>
  </div>

</template>

<script>
import Statusbar from "@/components/Statusbar";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

import {useInputStore} from "@/stores/InputStore";
import io from 'socket.io-client';

import SimpleKeyboard from "@/components/SimpleKeyboard";

export default {
  name: 'SettingsView',
  components: {
    FontAwesomeIcon,
    Statusbar,
    SimpleKeyboard
  },
  props: {},
  data() {
    return {
      socket: io('http://localhost:3000'),
      savedSettings: {},
      sensorsFound: [],
      inputStore: useInputStore(),
    };
  },
  mounted() {
    this.getSavedSettings();
    this.getSensors();
  },
  methods: {
    toggleSelectedSensor(sensor) {
      console.log(sensor);
      console.log("toggleSelectedSensor");
      sensor.selected = !sensor.selected;
    },
    getSensors() {
      this.socket.emit('get:sensors');
      this.socket.on('stored:sensors', (sensors) => {
        for (const sensor of sensors) {
          const topicArr = sensor.topic.split('/')
          sensor.selected = false;
          sensor.topicId = topicArr[topicArr.length - 1];
          sensor.label= "";
          this.sensorsFound.push(sensor);
        }
      });
    },
    saveSettings() {
      const fields = document.querySelectorAll("input");
      for (const field of fields) {
        this.savedSettings[field.id] = field.value;
      }
      console.log(this.savedSettings);
      this.socket.emit('store:settings', this.savedSettings);
    },
    getSavedSettings() {
      this.socket.emit('get:settings');
      this.socket.on('stored:settings', (settings) => {
        this.savedSettings = settings;
        Object.keys(this.savedSettings).forEach(key => {
          console.log(key, this.savedSettings[key]);
          if (document.querySelector(`#${key}`) !== null) {
            document.querySelector(`#${key}`).value = this.savedSettings[key];
          }
        });
        const inputStoreData = this.inputStore.get();
        console.log(inputStoreData);
        if (inputStoreData.target !== null) {
          this.savedSettings[inputStoreData.target] = inputStoreData.data;
          document.querySelector(`#${inputStoreData.target}`).value = inputStoreData.data;
        }
      });
    },
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
