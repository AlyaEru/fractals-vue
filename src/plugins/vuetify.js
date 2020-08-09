import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      dark: {
        background: '#00a86b'
      },
      light: {
        background: 'F7F6F4'
      }
    }
  }
})
