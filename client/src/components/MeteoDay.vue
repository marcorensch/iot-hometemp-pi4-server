<template>
  <div>
    <h2 class="nxd-card-title uk-margin-remove-bottom">{{ meteoLocation.default_name }}</h2>
    <span class="">{{ meteoLocation.alarm_region_name }}</span>
    <div class="current uk-width-1-2">
      <div class="uk-padding-small uk-padding-remove-horizontal uk-position-relative uk-position-z-index">
        <span class="nxd-current-temp">{{ meteoDataHour.TTT_C }}&#8451;</span>
      </div>
    </div>
    <img class="uk-position-absolute uk-position-z-index nxd-dashboard-weather-image"
         :src="require(`@/assets/images/weather/${meteoDataHour.SYMBOL_CODE}.png`)">
    <div class="nxd-day-data">
      <h5 class="today-header">Heute:</h5>
      <div class="uk-child-width-1-2 uk-grid-small uk-text-small" uk-grid>
        <div>
          <ul class="uk-list uk-list-divider">
            <li>
              <font-awesome-icon icon="cloud-sun-rain" class="uk-margin-small-right" />{{ meteoDataToday.PROBPCP_PERCENT }}%
            </li>
            <li>
              <font-awesome-icon icon="temperature-arrow-up" class="uk-margin-small-right"/>{{ meteoDataToday.TX_C }}&#8451;
            </li>
            <li>
              <font-awesome-icon icon="temperature-arrow-down" class="uk-margin-small-right"/>{{ meteoDataToday.TN_C }}&#8451;
            </li>
          </ul>
        </div>
        <div>
          <ul class="uk-list uk-list-divider">
            <li>
              <font-awesome-icon icon="wind" class="uk-margin-small-right" />{{ meteoDataToday.FF_KMH }}km/h
            </li>
            <li>
              <font-awesome-icon icon="sun" class="uk-margin-small-right"/>{{ sunrise }}
            </li>
            <li>
              <font-awesome-icon icon="moon" class="uk-margin-small-right"/>{{ sunset }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="meteodatacredits nxd-text-xsmall">Wetterdaten von Meteo Schweiz.<br>Zuletzt aktualisiert: {{meteoUpdated.toLocaleDateString()}} um {{meteoUpdated.toLocaleTimeString()}}</div>
  </div>
</template>

<script>
export default {
  name: 'MeteoDay',
  components: {},
  props: {
    meteoDataToday: Object,
    meteoDataHour: Object,
    meteoLocation: Object,
    meteoUpdated: Date,
},
  data() {
    return {
      sunrise: null,
      sunset: null,
    };
  },
  computed: {},
  mounted() {
    this.sunset = this.createTimeString(this.meteoDataToday.SUNSET);
    this.sunrise = this.createTimeString(this.meteoDataToday.SUNRISE);

    console.log(this.meteoDataHour);
  },
  methods: {
    createTimeString(timeString){
      if(Number(timeString) < 1000){
        timeString = "0" + Number(timeString);
      }
      return String(timeString).substring(0,2) + ":" + String(timeString).substring(2,5) + " Uhr";
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
