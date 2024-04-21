import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Upline from './components/UpLine.vue'
import Header from './components/Header.vue'

const app = createApp(App)

app.component('Upline', Upline)
app.component('Header', Header)

app.mount('#app')
