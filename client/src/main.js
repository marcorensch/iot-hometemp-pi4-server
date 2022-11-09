import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCog, faCogs } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCogs, faCog);

createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(router).mount('#app')
