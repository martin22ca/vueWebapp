<template>
    <h3><v-icon icon="mdi-table-network" class="pa-8" />Estado Cursos</h3>
    <v-row>
        <v-col v-for="classroom in classrooms" cols="4">
            <v-card-item>
                <v-card color="surface-lighter-2" class="ma-0" align="start" :title="'Aula Nro: ' + classroom.class_number"
                    :subtitle="classroom.class_name != null ? classroom.class_name : 'Sin Nombre'"
                    :prepend-icon="classroom.id_default_class != null ? 'mdi-office-building' : 'mdi-office-building-remove'">
                    <v-divider thickness="3"></v-divider>
                    <v-row>
                        <v-col>
                            <v-menu transition="scale-transition">
                                <template v-slot:activator="{ props }">
                                    <v-sheet rounded="lg" v-bind="props" color="surface-lighter-1"
                                        :style="{ 'border-bottom': 'solid 1px ' + (classroom.id_default_class != null ? 'rgb(var(--v-theme-primary)' : 'rgb(var(--v-theme-warning)') }"
                                        class="pa-2 ma-2" variant="elevated">
                                        {{ classroom.id_default_class != null ? 'Curso Asignado: ' +
                                            classroom.school_year + ':'
                                            + classroom.school_section : 'No hay curso asignado' }}
                                    </v-sheet>
                                </template>
                            </v-menu>
                        </v-col>
                    </v-row>
                    <v-row class="mt-0">
                        <v-col>
                            <v-sheet rounded="lg" color="surface-lighter-1" class="pa-2 ma-2"
                                :style="'border-bottom: solid 1px ' + (getColor(classroom.last_online))">
                                Estado: {{ getStatus(classroom.last_online) }}</v-sheet>
                        </v-col>
                    </v-row>
                </v-card>
            </v-card-item>
        </v-col>
    </v-row>
</template>

<script>
import store from 'storejs';
import { axiosClient } from '@/plugins/axiosClient';
import BaseContainer from '@/components/BaseContainer.vue';

export default {
    name: 'homeAdmin',
    data: () => ({
        classrooms: []
    }),
    methods: {
        async checkCursos() {
            const accessToken = store.get('accessToken');
            try {
                let result = await axiosClient({
                    method: 'get',
                    timeout: 2000,
                    url: "/classroom",
                    params: {
                        'accessToken': accessToken,
                        'clientIp': window.location.hostname
                    }
                })
                if (result) {
                    this.classrooms = result.data.classrooms;
                }
            } catch (error) {
                console.log(error)
            }
        }, getStatus(classStatus) {
            const today = new Date();
            const lastOnline = new Date(classStatus);

            // Set both dates to the same time of day (midnight)
            today.setHours(0, 0, 0, 0);
            lastOnline.setHours(0, 0, 0, 0);

            const timeDiff = today.getTime() - lastOnline.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

            if (daysDiff === 0) {
                return 'Online';
            } else {
                return `Ultima conexión: hace ${daysDiff} dia${daysDiff > 1 ? 's' : ''}`;
            }
        }, getColor(classStatus) {
            const today = new Date();
            const lastOnline = new Date(classStatus);

            // Set both dates to the same time of day (midnight)
            today.setHours(0, 0, 0, 0);
            lastOnline.setHours(0, 0, 0, 0);

            const timeDiff = today.getTime() - lastOnline.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

            if (daysDiff === 0) {
                return 'primary';
            } else {
                return 'secondary';
            }
        }
    },
    mounted() {
        this.checkCursos();
    },
    components: { BaseContainer }

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
  