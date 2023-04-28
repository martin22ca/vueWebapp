<template>
    <v-row>
        <v-col cols="3">
            <v-card title="Empleados" variant="flat" rounded="false" color="surface-lighter-1" class="ma-2">
                <v-list dense nav>
                    <v-list-item v-for="item in menuItems" :key="item.name" :value="item.comp" class="pa-1" rounded
                        @click="selectComp(item.comp)">
                        <v-card :title="item.name" variant="outlined"
                            :color="currentComp == item.comp ? 'primary' : 'undefined'">
                            <template v-slot:prepend>
                                <v-icon :icon="item.icon" size="large" />
                            </template>
                        </v-card>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-col>
        <v-col class="pa-2 pl-0 " cols="9">
            <v-card variant="text" class="ma-0">
                <component class="enterAnim" :is="currentComponent"></component>
            </v-card>
        </v-col>
    </v-row>
</template>
  
<script>
import Register from './Register.vue';
import editPersonnel from './EditPersonnel.vue';

export default {
    data: () => ({
        currentComp: -1,
        rigthComponents: {
            0: Register,
            1: editPersonnel,
        },
        menuItems: [
            {
                name: 'Registrar ',
                icon: 'mdi-plus',
                comp: 0,
            },
            {
                name: 'Editar',
                icon: 'mdi-briefcase',
                comp: 1,
            },
        ]
    }),
    methods: {
        selectComp(comp) {
            this.currentComp = comp
        },
    },
    computed: {
        currentComponent() {
            return this.rigthComponents[this.currentComp]
        }
    },
    components: { Register, editPersonnel }

}
</script>

<style></style>
  

