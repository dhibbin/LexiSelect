//import './assets/style.css'
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
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  }
})

createApp(App).use(vuetify).mount('#app')

