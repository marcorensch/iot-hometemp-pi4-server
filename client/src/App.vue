<template>
  <div class="uk-position-cover">
    <router-view v-slot="{ Component }">
      <transition name="route" mode="out-in">
        <component :is="Component"></component>
      </transition>
    </router-view>
  </div>
</template>

<style lang="less">
  @import "../node_modules/uikit/src/less/uikit.less";
  @import "@/assets/less/main.less";

  /* Route transitions */
  .route-enter-from {
    opacity: 0;
    //transform: translateX(100px);
  }
  .route-enter-active {
    transition: all 0.5s ease-out;
  }

  .route-leave-to {
    opacity: 0;
    //transform: translateX(-100px);
  }
  .route-leave-active {
    transition: all 0.5s ease-in;
  }
</style>

<script>

import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);


export default {
  name: 'App',
}
</script>
