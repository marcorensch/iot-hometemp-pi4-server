<template>
  <div>
    <h2 class="nxd-card-title uk-margin-remove-bottom">Sensoren</h2>
    <div class="uk-grid-small uk-child-width-1-3" uk-grid>
      <Sensor v-for="sensor in sensors" :key="sensor.id" :sensor="sensor" />
    </div>
  </div>
</template>

<script>
import Sensor from "@/components/Sensor";
export default {
  name: 'Sensors',
  components: {
    Sensor
  },
  props: {},
  data() {
    return {
      sensors: [
        {
          id: 1,
          name: 'Wohnzimmer',
          temp: '20',
          hum: '50',
        },
        {
          id: 2,
          name: 'Schlafzimmer',
          temp: '20',
          hum: '50',
        },
        {
          id: 3,
          name: 'Küche',
          temp: '20',
          hum: '50',
        },
        {
          id: 4,
          name: 'Schlafzimmer Elay fefefeeed',
          temp: '20',
          hum: '50',
        },
      ],
    };
  }
}
</script>