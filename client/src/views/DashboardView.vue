<template>

    <div class="content-container uk-padding-small uk-overflow-auto"
         uk-height-viewport="offset-top:true;"
         style="background:red">
      <div class="">
        <div class="uk-grid-small uk-child-width-1-3 uk-grid-match" uk-grid>
          <div>
            <div class="uk-card uk-card-body">
              <h3 class="uk-card-title">Card title</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
// @ is an alias to /src
// import DashboardView from '@/components/DashboardView.vue';

import io from 'socket.io-client';

export default {
  name: 'DashboardView',
  components: {},
  data() {
    return {
      socket: io('http://localhost:3000'),
    };
  },
  mounted() {
    console.log('Dashboard mounted');
    this.connectToServer();
    this.socket.on('temperature-updated', this.temperatureUpdated);
    this.socket.emit('get-settings');
    this.socket.on('current-settings', (settings) => {
      console.log('settings', settings);
    });
  },
  methods: {
    temperatureUpdated(data) {
      console.log('update received');
      console.log('temperatureUpdated', data);
    },
    connectToServer() {
      console.log('connectToServer');
      // this.$socket.emit('connectToServer', 'Hello World');
      const url = 'http://localhost:3000';
      const requestOptions = {
        method: 'GET',
        headers: {},
      };
      fetch(url, requestOptions)
          .then((response) => response.json())
          .then((data) => {
            let jsonData = null;
            if (Object.prototype.hasOwnProperty.call(data, 'forecast')) {
              jsonData = JSON.parse(data.forecast);
              localStorage.setItem('meteoDataCache', data.forecast);
            } else {
              jsonData = localStorage.getItem('meteoDataCache');
            }

            this.forecast = Object.prototype.hasOwnProperty.call(jsonData, 'forecast') ? jsonData.forecast : false;
            this.geolocation = Object.prototype.hasOwnProperty.call(jsonData, 'geolocation') ? jsonData.geolocation : false;

            console.log('data', this.forecast);
            console.log('data', this.geolocation);
          })
          .catch((error) => {
            console.error(error);
          });
    },
  },
};
</script>

<style lang="less">

</style>
