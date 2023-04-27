<template>
    <base-container>
        <v-sheet color="background" style="min-height: 60vh;">
            <div class="managementContainer">
                <v-row>
                    <v-col cols="2" class="pa-0">
                        <v-card title="Categoria" subtitle="Cada categoria tiene sus opciones" variant="flat"
                            rounded="false" color="surface-lighter-1" class="ml-4 mr-2 mt-2">
                            <v-list dense nav>
                                <v-list-item v-for="item in menuItems" :key="item.name" :value="item.comp" class="pa-1"
                                    rounded @click="selectComp(item.comp)">
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
                    <v-col class="pa-0" cols="10"
                        style="border-left: solid 3px; border-color: rgb(var(--v-theme-surface-lighter-2));">
                        <v-card variant="text">
                            <component class="enterAnim" :is="currentComponent"></component>
                        </v-card>
                    </v-col>
                </v-row>
            </div>
        </v-sheet>
    </base-container>
</template>
  
<script>
import { useStore } from 'vuex'
import { checkAuth } from '@/plugins/auth';
import BaseContainer from '@/components/BaseContainer.vue';
import Personnel from '@/components/Personnel/Personnel.vue';

export default {
    data: () => ({
        currentComp: -1,
        rigthComponents: {
            0: 'Classes',
            1: Personnel,
            2: 'Students',
        },
        menuItems: [
            {
                name: 'Cursos',
                icon: 'mdi-account-group',
                comp: 0,
            },
            {
                name: 'Empleados',
                icon: 'mdi-briefcase',
                comp: 1,
            },
            {
                name: 'Estudiantes',
                icon: 'mdi-account-school',
                comp: 2,
            },
        ]
    }),
    setup() {
        const store = useStore()

        store.commit('setPageTitle', { title: 'Gestion', })
    },
    beforeCreate() {
        // Call the checkAuth function here
        checkAuth(2);
    },
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
    components: { BaseContainer, Personnel }

}

</script>
  
<style>
.managementContainer {
    min-height: 75vh;
    border-radius: 10px;
    margin-top: 2%;
    padding-bottom: 2%;
    padding-left: 1%;
    margin-right: 10px;
    background: rgb(var(--v-theme-surface));
    color: rgb(var(--v-theme-on-secondary));
}

.enterAnim {
    animation: enterLeft ease-in 0.5s;
}

@keyframes enterLeft {
    0% {
        opacity: 0;
        transform: translateX(-250px);
    }

    100% {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>
  

