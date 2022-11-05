<template>
  <div class="uk-position-cover" style="background:green">
    <!--    <img alt="Vue logo" src="../assets/logo.png">-->
    <!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'HomeView',
  components: {},
  mounted() {
    console.log('HomeView mounted');
    this.connectToServer();
  },
  methods: {
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
