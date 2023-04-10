<template>
  <div class="containerB">
    <TopBar />
    <v-sheet class="pl-5 pb-3" prepend-icon="mdi-account" color="surface">
      <h2 style="padding-left: 5px;"> <v-icon icon="mdi-account" class="pr-2"/>{{ this.firstName }}, {{ this.lastName }}</h2>
      <h3 class="subBase"> {{ this.email }}</h3>
    </v-sheet>
    <SideBar />
    <slot></slot>
    <Footer />
  </div>
</template>

<script>
import store from 'storejs';
import SideBar from '@/components/SideBar.vue';
import TopBar from './TopBar.vue';
import Footer from './Footer.vue';

export default {
  name: 'BaseContainer',
  data: () => ({
    firstName: store.get('first_name'),
    lastName: store.get('last_name'),
    email: store.get('email'),
  }),
  beforeCreate() {
    // Call the checkAuth function here
  },
  setup() { },
  components: { SideBar, TopBar, Footer },
}

</script>

<style>
.containerB {
  padding-left: 100px;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: rgb(var(--v-theme-surface));

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
