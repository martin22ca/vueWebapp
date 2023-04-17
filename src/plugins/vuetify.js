/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme: {
        dark: true,
        colors: {
          background: '#0c0c0c',
          surface: '#1b1b1b',
          primary: '#13af48',
          secondary: '#6515dd',

          'on-background': '#DDDDDD', 
          'on-surface': '#DDDDDD',
          'on-primary': '#000000',
          'on-secondary': '#DDDDDD',

          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',

          'background-lighter': '#151515',

          'primary-darken': '#12913c',
          'secondary-darken': '#018786',

          'surface-lighter-1': '#232323',
          'surface-lighter-2': '#2f2f2f',
        }
      }
    }
  },
  defaults:{
    VBtn: {
      color: 'primary',
      variant: 'outlined',
      rounded: 'LG',
    },
  },
})

