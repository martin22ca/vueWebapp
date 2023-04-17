<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
  //
</script>
<style>
@font-face {
  font-family: "Monserrat";
  src: local("Monserrat"), url(./fonts/Montserrat-VariableFont_wght.ttf) format("truetype");
}
@font-face {
  font-family: "Dongle";
  src: local("Dongle"), url(./fonts/Dongle-Regular.ttf) format("truetype");
}
@font-face {
  font-family: "Raleway";
  src: local("Raleway"), url(./fonts/Raleway-VariableFont_wght.ttf) format("truetype");
}

#app {
  font-family: "Raleway", Helvetica, Arial;

}
</style>
