<template>
  <v-row>
    <v-col cols="auto">
      <SideBar />
    </v-col>
    <v-col>
      <div class="containerB">
        <TopBar />
        
        <slot></slot>
        <Footer />
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
.gradient {
  height: 100vh;

}

.containerB {
  flex-direction: column;
  width: 100%;
  background-color: rgb(var(--v-theme-backgound));
}

.text {
  font-size: 16px;
  line-height: 1.5;
}

.bottom-section {
  display: flex;
  border-radius: 5%;
  height: calc(100% - 112px);
  /* subtract top section height and padding */
}

.subBase {
  font-size: 15px;
  font-weight: 300;
  font-style: italic;
  padding-left: 45px;
  margin-bottom: 10px;
}
</style>
