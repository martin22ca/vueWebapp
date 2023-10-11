<template>
  <v-row class="ma-0">
    <v-col cols="auto" >
      <SideBar />
    </v-col>
    <v-col class="ma-0 pa-0">
      <div class="containerB">
        <TopBar />
        <slot></slot>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import SideBar from '@/components/SideBar.vue';
import TopBar from './TopBar.vue';
import Footer from './Footer.vue';

export default {
  name: 'BaseContainer',

  setup() { },
  components: { SideBar, TopBar, Footer },
}

</script>

<style>

.containerB {
  flex-direction: column;
  width: 100%;
  background-color: rgb(var(--v-theme-backgound));
}

.text {
  font-size: 16px;
  line-height: 1.5;
}

</style>
