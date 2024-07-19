import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { md3 } from 'vuetify/blueprints'
//import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import './assets/style.scss'

// Components
import App from './App.vue'

const customLightTheme = {
  dark: false,
  colors: {
    background: "#eee",
    surface: "#15202b",
    primary: "#3f51b5",
    secondary: "#00ccff",
    error: "#ffcc00",
  },
};

const vuetify = createVuetify({
  components,
  directives,
  theme : {
    defaultTheme : "customLightTheme",
    themes : {
      customLightTheme
    }
  },
  blueprint : md3,
  icons: {
    defaultSet: 'mdi', // This is already the default value - only for display purposes
  },

})

createApp(App).use(vuetify).mount('#app')

