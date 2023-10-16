<template>
    <BaseContainer>
        <v-card title="Aulas" subtitle="Estado de aulas" color="surface-lighter-1" class="fadeInCenter pa-2">
            <template v-slot:append>
                <v-btn color="primary" @click="goToDaemon" prepend-icon="mdi-download-box" class="mt-0 ma-2">
                    Registrar Aula
                </v-btn>
            </template>
            <v-sheet class="ma-2" rounded="lg" min-height="75vh">
                <v-row>
                    <v-col v-for="classroom in classrooms" cols="3">
                        <v-card-item>
                            <v-card color="surface-lighter-2" class="ma-0" align="start"
                                :title="'Aula Nro: ' + classroom.class_number"
                                :subtitle="classroom.class_name != null ? classroom.class_name : 'Sin Nombre'"
                                :prepend-icon="classroom.id_default_class != null ? 'mdi-office-building' : 'mdi-office-building-remove'">
                                <v-divider thickness="3"></v-divider>
                                <v-row>
                                    <v-col>
                                        <v-menu transition="scale-transition">
                                            <template v-slot:activator="{ props }">
                                                <v-sheet rounded="lg" v-bind="props" append-icon="mdi-menu-down"
                                                    color="surface-lighter-1"
                                                    :style="{ 'border-bottom': 'solid 1px ' + (classroom.id_default_class != null ? 'rgb(var(--v-theme-primary)' : 'rgb(var(--v-theme-warning)') }"
                                                    class="pa-2 ma-2" variant="elevated" style="cursor: pointer;">
                                                    {{ classroom.id_default_class != null ? 'Curso Asignado: ' +
                                                        classroom.school_year + ':'
                                                        + classroom.school_section : 'No hay curso asignado' }}
                                                    <v-icon icon="mdi-menu" style="float: right;" />
                                                </v-sheet>
                                            </template>
                                            <v-list>
                                                <v-list-item @click="setupClass(null, classroom.id_classroom)"
                                                    v-if="classroom.id_default_class != null">
                                                    <v-list-item-title>Desasginar Clase <v-icon icon="mdi-trash-can"
                                                            class="ma-2"> </v-icon></v-list-item-title>
                                                </v-list-item>
                                                <v-list-item v-for="(item, i) in classes" :key="i" :value="item.id"
                                                    @click="setupClass(item.id, classroom.id_classroom)">
                                                    <v-list-item-title>{{ item.school_year + ':' + item.school_section
                                                    }}</v-list-item-title>
                                                </v-list-item>
                                            </v-list>
                                        </v-menu>
                                    </v-col>
                                </v-row>
                                <v-row class="mt-0">
                                    <v-col>
                                        <v-sheet rounded="lg" class="pa-2 ma-2" color="surface-lighter-1" border>
                                            IP: {{ classroom.ip_classroom }}
                                        </v-sheet>
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
            </v-sheet>
        </v-card>
    </BaseContainer>
</template>

<script>
import BaseContainer from '@/components/BaseContainer.vue';
import { checkAuth } from '@/services/api/admission';
import store from 'storejs';
import { useStore } from 'vuex'
import { axiosExpressClient } from '@/plugins/axiosClient';

export default {
    name: 'Attendances',
    data() {
        return {
            storeX: useStore(),
            classes: {},
            classrooms: []
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
        this.fetchClassrooms()
        this.fetchClasses()
    },
    methods: {
        async fetchClassrooms() {
            const accessToken = store.get('accessToken');
            try {
                let result = await axiosExpressClient({
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
        },
        async fetchClasses() {
            const accessToken = store.get('accessToken');

            try {
                let result = await axiosExpressClient({
                    method: 'get',
                    timeout: 5000,
                    url: "/classes/classroom",
                    params: {
                        'accessToken': accessToken,
                    }
                })
                if (result.status == 200) {

                    this.classes = result.data.schoolClasses;
                }
            } catch (error) {
                console.log(error)
            }
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
                return 'rgb(var(--v-theme-primary));';
            } else {
                return 'rgb(var(--v-theme-warning));';
            }
        },
        goToDaemon() {
            this.$router.push({
                name: 'Daemon',
            })
        }, async setupClass(idClass, id_classroom) {
            const accessToken = store.get('accessToken');

            try {
                let result = await axiosExpressClient({
                    method: 'put',
                    timeout: 5000,
                    url: "/classroom/class",
                    data: {
                        'accessToken': accessToken,
                        'idClass': idClass,
                        'idClassroom': id_classroom
                    }
                })
                if (result.status == 200) {
                    this.fetchClassrooms()
                    this.fetchClasses()
                }
            } catch (error) {
                console.log(error)
            }
        }
    },
    components: { BaseContainer, }
}

</script>
<style>
.noEmail {
    color: rgb(var(--v-theme-warning));
}
</style>
