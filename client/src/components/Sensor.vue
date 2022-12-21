<template>
  <div>
    <div class="sensor-item-container uk-padding-small ">
      <div class="uk-width-1-1 uk-text-truncate uk-text-center">
        <span class="nxd-sensor-title">{{ sensor.name }}</span>
      </div>
      <div class="uk-text-center sensor-data uk-margin-top">
        <div>
          <div class="sensor-temp">
            <font-awesome-icon icon="temperature-three-quarters" class="uk-margin-small-right"/>
            {{ sensor.temp }}&#8451;
          </div>
        </div>

        <div>
          <div class="sensor-hum">
            <font-awesome-icon icon="droplet" class="uk-margin-small-right"/>
            {{ sensor.hum }}&nbsp;%
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'Sensors',
  components: {},
  props: {
    sensor: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  }
}
</script>