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
    defaultTheme: 'darkTheme',
    themes: {
      darkTheme: {
        dark: true,
        colors: {
          background: '#090909',
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

          'primary-darken-1': '#12913c',
          'primary-darken-2': '#154f28',
          'secondary-darken': '#018786',

          'surface-lighter-1': '#232323',
          'on-surface-lighter-2': '#ffffff',
          'surface-lighter-2': '#2f2f2f',
        }
      },
      lightTheme: {
        dark: false,
        colors: {
          background: '#ffffff',
          surface: '#aacaca',
          primary: '#0077CC',
          secondary: '#8B16C6',

          'on-background': '#333333',
          'on-surface': '#333333',
          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',

          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',

          'background-lighter': '#aacaca',

          'primary-darken-1': '#0068a3',
          'primary-darken-2': '#003d5c',
          'secondary-darken': '#680b8e',

          'surface-lighter-1': '#aacaca',
          'on-surface-lighter-2': '#333333',
          'surface-lighter-2': '#aacaca',
        }
      }
    }
  },
})

