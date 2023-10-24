<template>
    <BaseContainer>
        <v-card title="MODULOS IA" subtitle="Estado de Modulos de IA" color="surface-lighter-1" class="fadeInCenter pa-2 mr-2">
            <template v-slot:append>
                <v-btn color="primary" @click="goToDaemon" prepend-icon="mdi-download-box" class="mt-0 ma-2">
                    Registrar modulo
                </v-btn>
            </template>
            <v-sheet class="ma-2" rounded="lg" min-height="50vh">
                <Modules :modules-num="4"/>
            </v-sheet>
        </v-card>
    </BaseContainer>
</template>

<script>
import BaseContainer from '@/components/BaseContainer.vue';
import { checkAuth } from '@/services/api/admissionService';
import { fetchModules } from '@/services/api/modulesService'
import Modules from '@/components/Modules.vue';
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
        goToDaemon() {
            this.$router.push({
                name: 'aiApp',
            })
        },
    },
    components: { BaseContainer, Modules}
}

</script>
<style>
.noEmail {
    color: rgb(var(--v-theme-warning));
}

.moduleText {
    font-size: 1.6vh;
}
</style>
