<template>
  <div id="nxd-meteo-forecast">
    <Statusbar view="forecast"/>

    <div class="content-container uk-padding-small uk-overflow-hidden uk-cover-container"
         uk-height-viewport="offset-top:true;"
         :style="{ backgroundImage: 'url(' + bgimage + ')' }">
      <video id="backgroundVideo" :src="bgvideo" autoplay muted playsinline uk-cover></video>
      <div v-if="dataReady" class="uk-position-relative">
        <div v-if="meteodata && forecast" uk-slider>
          <ul class="uk-slider-items uk-child-width-1-1 uk-grid uk-grid-small">
            <li v-for="day in forecast" :key="day.local_date_time">
              <div class="uk-card uk-card-small uk-border-rounded nxd-dashboard-card uk-card-body uk-position-relative">
                <h2 class="locationName" v-if="locationName">Vorhersage für {{ locationName }}</h2>
                <h3 class="uk-h4 uk-margin-remove">
                  {{ new Date(day.local_date_time).toLocaleDateString([], {weekday: 'long'}) }}</h3>
                <div class="uk-text-small">{{
                    new Date(day.local_date_time).toLocaleDateString([], {
                      day: 'numeric',
                      month: '2-digit',
                      year: 'numeric'
                    })
                  }}</div>
                <div class="uk-position-top-right">
                  <div class="weather-icon-container" uk-scrollspy="cls:uk-animation-fade; repeat:true;">
                    <img class="weather-icon" :src="require(`@/assets/images/weather/${day.SYMBOL_CODE}.png`)"/>
                  </div>
                </div>

                <div class="uk-width-2-5 uk-margin-top">
                  <DayTable :data="day"/>
                </div>

                <div class="forecast-hour-container uk-margin-top uk-text-small uk-padding-small uk-border-rounded uk-position-relative ">
                  <div class="uk-flex uk-flex-between">
                    <div class="hour-item-container uk-position-relative" :class="{empty: !hour}"
                         v-for="(hour, index) of day.hour" :key="index">
                      <template v-if="hour">
                        <div class="uk-text-center">{{ hour.timestring }} Uhr</div>
                        <div class="forecast-hour-icon-container uk-padding-small">
                          <img class="forecast-hour-icon"
                               :src="require(`@/assets/images/weather/${hour.SYMBOL_CODE}.png`)"/>
                        </div>
                        <div class="nxd-forecast-hour-temperatures uk-width-auto" style="font-size: 10px; opacity: .6">
                          <div class="uk-display-inline-block"><font-awesome-icon icon="temperature-arrow-up" class="uk-margin-small-right"/>{{ hour.TTH_C }}&#8451;</div>
                          <div class="uk-display-inline-block"><font-awesome-icon icon="temperature-arrow-down" class="uk-margin-small-right"/>{{ hour.TTL_C }}&#8451;</div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>

              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
// @ is an alias to /src
import io from 'socket.io-client';
import {useMeteoDataStore} from '@/stores/MeteoDataStore';
import MeteoDay from "@/components/MeteoDay";
import Statusbar from "@/components/Statusbar";
import DayTable from "@/components/DayTable";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  name: 'ForecastView',
  components: {FontAwesomeIcon, DayTable, Statusbar, MeteoDay},

  data() {
    return {
      dataReady: false,
      socket: io('http://localhost:3000'),
      bgimage: require('@/assets/images/backgrounds/rain/max-bender-1YHXFeOYpN0-unsplash.jpg'),
      bgvideo: require('@/assets/videos/rain.mp4'),
      meteodata: null,
      meteoDataStore: useMeteoDataStore(),
      forecast: null,
      locationName: null,
    };
  },
  async mounted() {
    this.meteodata = this.meteoDataStore.get();
    console.log(this.meteodata);
    if (!this.meteodata) {
      console.log('no meteodata found, getting from server');
      await this.getMeteoData();
    }
    this.setForecastDays();
    this.setLocationName();

    this.dataReady = true;
  },
  methods: {
    async getMeteoData() {
      console.log('connectToServer');
      const url = 'http://localhost:3000';
      const requestOptions = {
        method: 'GET',
        headers: {},
      };
      return fetch(url, requestOptions)
          .then((response) => response.json())
          .then((data) => {
            this.meteoDataStore.set(JSON.parse(data.forecast));
            this.meteodata = this.meteoDataStore.get();
          })
          .catch((error) => {
            console.error(error);
          });
    },

    setLocationName() {
      this.locationName = this.meteodata.geolocation.default_name;
    },
    setForecastDays(days) {
      let forecast = [];
      if (this.meteodata.forecast.day) {
        let loop = 0;
        forecast = this.meteodata.forecast.day.filter((day, index) => {
          loop++;
          if (!days || (days && loop <= days)) {
            day.hour = this.getDayHours(day.local_date_time, this.meteodata.forecast.hour);
            return true;
          }
          return false;
        })
      }
      this.forecast = forecast;

    },

    getDayHours(day, hours) {
      let dayHours = hours.filter(hour => {
        if (new Date(hour.local_date_time).toLocaleDateString() === new Date(day).toLocaleDateString()) {
          hour.timestring = new Date(hour.local_date_time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });
          return true;
        }
      })
      if (dayHours.length < 8) {
        dayHours[7] = null;
      }
      return dayHours;
    },

    setBackgroundVideo(chanceOfRain) {

    },

  },
};
</script>

<style type="text/css" scoped>
.nxd-dashboard-card{
  height: auto !important;
}
</style>