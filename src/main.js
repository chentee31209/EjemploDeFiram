import { createApp } from 'vue'
import App from './App.vue'
import VueCryptojs from 'vue-cryptojs'
import axios from 'axios'
import VueAxios from 'vue-axios'

 createApp(App).use(VueCryptojs).use(VueAxios, axios).mount('#app')
