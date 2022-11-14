<template>

  <div class="uk-position-relative uk-height-viewport">
    <div class="uk-position-absolute uk-position-top-right">
      <router-link :to="{name: 'settings'}" >
        <div class="statusbar-icon uk-margin-small-right" uk-scrollspy="cls:uk-animation-slide-top; delay:200;">
          <font-awesome-icon icon="xmark"/>
        </div>
      </router-link>
    </div>
    <div class="uk-margin-large-top">
      <input id="inputField" class="uk-input uk-border-rounded" :value="input" type="text" placeholder="foo" >
    </div>

  </div>
</template>

<script>


import {useInputStore} from "@/stores/InputStore";
const inputStore = useInputStore()

export default {
  name: 'KeyboardView',
  components: {
    SimpleKeyboard
  },
  props: {

  },
  data() {
    return {
      input: '',
    };
  },
  mounted() {
    const storedData = inputStore.get();
    this.input = storedData.data;
    document.querySelector('#inputField').focus();
  },
  methods: {

  }
}
</script>