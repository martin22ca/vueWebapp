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
          background: '#FFFFFF',
          surface: '#F2F2F2',
          primary: '#13af48',
          secondary: '#6515dd',
          
          'on-background': '#000000',
          'on-surface': '#000000',
          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
          
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          
          'background-lighter': '#F5F5F5',
          
          
          'primary-darken-1': '#17e35e',
          'primary-darken-2': '#0E8335',
          'secondary-darken': '#01526C',
          
          'surface-lighter-1': '#E0E0E0',
          'on-surface-lighter-2': '#000000',
          'surface-lighter-2': '#E0E0E0',
        }
      }
    }
  },
})

