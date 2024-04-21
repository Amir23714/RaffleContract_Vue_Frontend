import "./assets/main.css";

import { createApp } from "vue";
const App = require("./App.vue");
const Upline = require("./components/Upline.vue");
const Header = require("./components/Header.vue");

const app = createApp(App);

app.component("Upline", Upline);
app.component("Header", Header);

app.mount("#app");
