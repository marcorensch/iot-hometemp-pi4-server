<template>
  <div id="nxd-statusbar">
    <div class="uk-flex uk-child-width-expand">
      <div></div>
      <div>
        <div class="uk-grid-small uk-flex uk-flex-right">
          <router-link v-if="view === 'dashboard'" :to="{'name': 'settings'}">
            <div class="statusbar-icon">
              <font-awesome-icon icon="cog"/>
            </div>
          </router-link>
          <router-link v-if="view === 'settings'" :to="{'name': 'dashboard'}">
            <div class="statusbar-icon">
              <font-awesome-icon icon="house"/>
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
    return {};
  }
}
</script>