<template>
    <div>
      <Statusbar view="dashboard" />

      <div class="content-container uk-padding-small uk-overflow-hidden uk-cover-container"
           uk-height-viewport="offset-top:true;"
           :style="{ backgroundImage: 'url(' + bgimage + ')' }">
        <video :src="bgvideo" autoplay loop muted playsinline uk-cover></video>
        <div>
          <div class="uk-grid-small uk-child-width-1-3 uk-grid-match" uk-grid>
            <div uk-scrollspy="cls: uk-animation-slide-left;">
              <div class="uk-card uk-card-small uk-border-rounded nxd-dashboard-card uk-card-body">
                <MeteoDay v-if="meteoDataHour&&meteoDataToday&&geolocation" :meteo-updated="lastUpdated" :meteo-data-today="meteoDataToday" :meteo-data-hour="meteoDataHour" :meteo-location="geolocation" />
              </div>
            </div>
            <div class="uk-width-expand" uk-scrollspy="cls: uk-animation-slide-right;">
              <div class="uk-card uk-card-small uk-border-rounded nxd-dashboard-card uk-card-body">
                <Sensors />
              </div>
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
import MeteoDay from "@/components/MeteoDay";
import Sensors from "@/components/Sensors";
import Statusbar from "@/components/Statusbar";

export default {
  name: 'DashboardView',
  components: {Statusbar, Sensors, MeteoDay},
  data() {
    return {
      socket: io('http://localhost:3000'),
      meteoDataToday: null,
      meteoDataHour:null,
      geolocation: null,
      lastUpdated: null,
      updateIntervalMs: 300000,
      bgimage: require('@/assets/images/backgrounds/rain/max-bender-1YHXFeOYpN0-unsplash.jpg'),
      bgvideo: require('@/assets/videos/rain.mp4'),
    };
  },
  mounted() {
    console.log('Dashboard mounted');
    this.getMeteoData();
    this.socket.on('temperature-updated', this.temperatureUpdated);

    console.log('Dashboard mounted update Interval set to ' + this.updateIntervalMs / 1000 / 60 + 'minutes');
    this.startUpdateTimer(this.updateIntervalMs);
  },
  methods: {
    startUpdateTimer(interval) {
      setTimeout(() => {
        console.log('update timer');
        // Your logic here
        this.getMeteoData();
        this.startUpdateTimer(interval);
      }, interval);
    },
    setBackgroundVideo(chanceOfRain){

    },
    temperatureUpdated(data) {
      console.log('update received');
      console.log('temperatureUpdated', data);
    },
    getMeteoData() {
      console.log('connectToServer');
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


            this.lastUpdated = new Date(Number(data.created));
            this.forecast = Object.prototype.hasOwnProperty.call(jsonData, 'forecast') ? jsonData.forecast : false;
            this.geolocation = Object.prototype.hasOwnProperty.call(jsonData, 'geolocation') ? jsonData.geolocation : false;

            if(this.forecast) {
              const meteoDataDays = this.forecast.day;
              const today = new Date();
              const todayDate = today.getDate();
              const lastHourTime = today.getTime() - (60 * 60 * 1000);
              for (const meteoDataDay of meteoDataDays) {
                const meteoDataDayDate = new Date(meteoDataDay.local_date_time);
                if(meteoDataDayDate.getDate() === todayDate) {
                  this.meteoDataToday = meteoDataDay;
                  break;
                }
              }

              const meteoDataHourly = this.forecast['60minutes'];

              for(const meteoDataHour of meteoDataHourly) {
                const meteoDataHourDate = new Date(meteoDataHour.local_date_time);
                if(meteoDataHourDate.getTime() > lastHourTime) {
                  this.meteoDataHour = meteoDataHour;
                  break;
                }
              }
            }
            this.setBackgroundVideo(this.meteoDataToday.PROBPCP_PERCENT);
          })
          .catch((error) => {
            console.error(error);
          });
    },
  },
};
</script>

<style lang="less">
.content-container{
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-color: rgba(0,0,0,0.5);
  color: white;
}
</style>
