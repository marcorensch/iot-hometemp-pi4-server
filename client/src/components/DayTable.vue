<template>
  <div class="nxd-day-table uk-child-width-1-2 uk-grid-small uk-text-small" uk-grid>
    <div>
      <ul class="uk-list uk-list-divider">
        <li>
          <font-awesome-icon icon="cloud-sun-rain" class="uk-margin-small-right" />{{ data.PROBPCP_PERCENT }}%
        </li>
        <li>
          <font-awesome-icon icon="temperature-arrow-up" class="uk-margin-small-right"/>{{ data.TX_C }}&#8451;
        </li>
        <li>
          <font-awesome-icon icon="temperature-arrow-down" class="uk-margin-small-right"/>{{ data.TN_C }}&#8451;
        </li>
      </ul>
    </div>
    <div>
      <ul class="uk-list uk-list-divider">
        <li>
          <font-awesome-icon icon="wind" class="uk-margin-small-right" />{{ data.FF_KMH }}km/h
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
</template>

<script>
export default {
  name: "DayTable.vue",
  props: {
    data: Object,
  },
  data() {
    return {
      sunrise: null,
      sunset: null,
    };
  },
  mounted() {
    this.sunset = this.createTimeString(this.data.SUNSET);
    this.sunrise = this.createTimeString(this.data.SUNRISE);
  },
  methods:{
    createTimeString(timeString){
      if(Number(timeString) < 1000){
        timeString = "0" + Number(timeString);
      }
      return String(timeString).substring(0,2) + ":" + String(timeString).substring(2,5) + " Uhr";
    }
  }
}
</script>