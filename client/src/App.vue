<template>
  <div class="uk-position-cover" style="background:green">
    <div id="nxd-statusbar">
      <div class="uk-flex uk-child-width-expand">
        <div></div>
        <div>
          <div class="uk-grid-small uk-flex uk-flex-right">
            <div class="statusbar-icon">
              <font-awesome-icon icon="cog" />
            </div>
            <div class="statusbar-icon">
              <font-awesome-icon icon="cog" />
            </div>
          </div>
        </div>
      </div>


    </div>
    <router-view/>
  </div>
</template>

<style lang="less">
  @import "../node_modules/uikit/src/less/uikit.less";
  @import "@/assets/less/main.less";
</style>

<script>

import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);

export default {
  name: 'App',
}
</script>
