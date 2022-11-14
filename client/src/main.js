import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faCheck,
    faCloudSunRain,
    faCog,
    faCogs,
    faDroplet,
    faHouse,
    faMoon,
    faServer,
    faSun,
    faTemperatureArrowDown,
    faTemperatureArrowUp,
    faTemperatureQuarter,
    faTemperatureThreeQuarters,
    faWind,
    faXmark
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const pinia = createPinia();

library.add(faCheck, faServer, faXmark,faHouse, faCogs, faCog, faTemperatureQuarter, faTemperatureThreeQuarters, faTemperatureArrowUp, faTemperatureArrowDown, faSun, faMoon, faCloudSunRain, faWind, faDroplet);

createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(router).use(pinia).mount('#app')
