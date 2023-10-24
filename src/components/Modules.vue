<template>
    <v-row>
        <v-col v-for="aiModule in modules" :cols="modulesNum">
            <v-card-item>
                <v-card color="surface-lighter-2" class="ma-0" align="start"
                    :title="'Modulo Nro: ' + aiModule.module_number"
                    :subtitle="aiModule.class_name != null ? aiModule.class_name : 'Modulo IA'"
                    prepend-icon='mdi-office-building'>
                    <v-divider thickness="3"></v-divider>
                    <v-row class="mt-0">
                        <v-col>
                            <v-sheet color="surface-lighter-1" class="pa-2 ma-1"
                                :style="aiModule.online ? 'border-bottom: solid 1px rgb(var(--v-theme-primary))' : 'border-bottom: solid 1px rgb(var(--v-theme-warning))'">
                                <div class="moduleText">
                                    <strong>Estado:</strong> {{ aiModule.online ? 'Online' : 'Offline' }}
                                </div>
                            </v-sheet>
                        </v-col>
                    </v-row>
                    <v-row class="mt-0">
                        <v-col>
                            <v-sheet color="surface-lighter-1" class="pa-2 ma-1" :style="{
                                'border-bottom': aiModule.online ? 'solid 1px rgb(var(--v-theme-primary))' : 'solid 1px rgb(var(--v-theme-warning))'
                            }">
                                <div class="moduleText">
                                    <strong>Ultima conexión:</strong> {{ aiModule.online ? 'Ahora' :
                                        getStatus(aiModule.online_date)
                                    }}
                                </div>
                            </v-sheet>
                        </v-col>
                    </v-row>
                    <v-row class="mt-0">
                        <v-col>
                            <v-sheet rounded class="pa-2 ma-1" color="surface-lighter-1" border>
                                <div class="moduleText">
                                    <strong>IP:</strong> {{ aiModule.ip_module }}
                                </div>
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-card>
            </v-card-item>
        </v-col>
    </v-row>
</template>

<script>
import { checkAuth } from '@/services/api/admissionService';
import { fetchModules } from '@/services/api/modulesService'
import store from 'storejs';
import { useStore } from 'vuex'

export default {
    name: 'Attendances',
    data() {
        return {
            storeX: useStore(),
            modules: []
        }
    },
    props: {
        modulesNum: Number
    },
    beforeCreate() {
        checkAuth([0, 1, 2, 3])
    },
    setup() {
        const storeX = useStore()
        storeX.commit('setTitle', { title: 'Modulos IA', icon: 'mdi-domain' })
    },
    mounted() {
        this.getModules()
    },
    methods: {
        async getModules() {
            const accessToken = store.get('accessToken');
            this.modules = await fetchModules(accessToken);
        },
        getStatus(classStatus) {
            const today = new Date();
            const lastOnline = new Date(classStatus);

            // Set both dates to the same time of day (midnight)
            today.setHours(0, 0, 0, 0);
            lastOnline.setHours(0, 0, 0, 0);

            const timeDiff = today.getTime() - lastOnline.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

            if (daysDiff === 0) {
                return 'Hoy';
            } else {
                return `Hace ${daysDiff} dia${daysDiff > 1 ? 's' : ''}`;
            }
        },
    },
}
</script>
<style>
.noEmail {
    color: rgb(var(--v-theme-warning));
}

.moduleText {
    font-size: 1.7vh;
}
</style>