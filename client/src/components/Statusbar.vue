<template>
  <div id="nxd-statusbar">
    <div class="uk-flex uk-flex-middle uk-child-width-expand">
      <div><span id="datetime"> {{ currentDateTimeString }}</span></div>
      <div></div>
      <div>
        <div class="uk-grid-small uk-flex uk-flex-right">
          <router-link v-if="view !== 'dashboard'" :to="{'name': 'dashboard'}">
            <div class="statusbar-icon">
              <font-awesome-icon icon="house"/>
            </div>
          </router-link>

          <router-link v-if="view !== 'settings'" :to="{'name': 'settings'}">
            <div class="statusbar-icon">
              <font-awesome-icon icon="cog"/>
            </div>
          </router-link>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Statusbar',
  components: {},
  props: {
    view: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      currentDateTimeString: '',
    };
  },
  mounted() {
    this.updateDateTime();
    setInterval(this.updateDateTime, 60000);
  },
  methods: {
    updateDateTime() {
      const date = new Date();
      this.currentDateTimeString = date.toLocaleString([], {weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'}) + " Uhr";
    },
  },
}
</script>