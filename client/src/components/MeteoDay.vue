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
      <DayTable :data="meteoDataToday" />

    </div>
    <div class="meteodatacredits nxd-text-xsmall">Wetterdaten von Meteo Schweiz.<br>Zuletzt aktualisiert: {{meteoUpdated.toLocaleDateString()}} um {{meteoUpdated.toLocaleTimeString([],{ hour: '2-digit', minute:'2-digit'})}} Uhr</div>
  </div>
</template>

<script>
import DayTable from "@/components/DayTable.vue";

export default {
  name: 'MeteoDay',
  components: {DayTable},
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
    console.log(this.meteoUpdated)
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
