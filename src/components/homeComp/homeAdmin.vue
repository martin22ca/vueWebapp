<template>
    <h3><v-icon icon="mdi-table-network" class="pa-8" />Modulos</h3>
    <Modules :modulesNum="6"/>
</template>

<script>
import Modules from '../Modules.vue';
export default {
    name: 'homeAdmin',
    components: { Modules }

}

</script>
  
<style>
.daemonContainer {
    display: flex;
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    margin-top: 5%;

}
</style>
  