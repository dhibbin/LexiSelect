
import 'vuetify/dist/vuetify.min.css'
//import 'prism-theme-vars/base.css'

import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { md2 } from 'vuetify/blueprints'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import './assets/style.css'



// Components
import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
  theme : {
    defaultTheme : "dark"
  },
  blueprint : md2,
  icons: {
    defaultSet: 'mdi', // This is already the default value - only for display purposes
  },
})

createApp(App).use(vuetify).mount('#app')

