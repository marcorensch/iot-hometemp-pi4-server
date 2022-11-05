<template>
  <div class="uk-position-cover" style="background:green">
    <!--    <img alt="Vue logo" src="../assets/logo.png">-->
    <!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';

import io from 'socket.io-client';

export default {
  name: 'HomeView',
  components: {},
  data() {
    return {
      socket: io('http://localhost:3000'),
    };
  },
  mounted() {
    console.log('HomeView mounted');
    this.connectToServer();
    this.socket.on('temperature-updated', this.temperatureUpdated);
  },
  methods: {
    temperatureUpdated(data) {
      console.log('update received');
      console.log('temperatureUpdated', data);
    },
    connectToServer() {
      console.log('connectToServer');
      // this.$socket.emit('connectToServer', 'Hello World');
      const url = 'http://localhost:3000';
      const requestOptions = {
        method: 'GET',
        headers: {},
      };
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log('data', data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
