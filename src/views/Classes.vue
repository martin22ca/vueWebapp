<template>
    <BaseContainer>
        <div class="classesContainer">
            <v-row no-gutters>
                <v-col>
                    <v-card color="surface-lighter-1" class="ma-2" title="Class info" subtitle="Subtitle">
                        <div v-if="classId.sc != -1" style="padding: 2%; ">
                            <h4 style="padding: 5px;">

                                Curso: <v-chip variant="elevated" color="primary">{{ classYear }} - "{{ classSection }}"</v-chip>
                            </h4>
                            <h4 style="padding: 5px;">
                                Estado Actul: <v-chip :color="classStatus ? 'secondary' : 'error'" variant="elevated">
                                    {{ classStatus ? "ABIERTO" : "CERRADO" }}
                                </v-chip>
                            </h4>
                        </div>
                        <div v-else style="padding: 2%; ">
                            <v-chip color="primary" class="ma-2">
                                Ningun Curso Seleccionado
                            </v-chip>
                        </div>
                    </v-card>
                </v-col>
                <v-col cols="8">
                    <v-card color="surface-lighter-1" class="ma-2" title="Seleccionar Curso"
                        subtitle="Seleccione Clase para obtener info">
                        <div style="padding-left: 2%; padding-bottom: 2%; padding-right: 2%;">
                            <v-select v-model="classId" :items="selectItems" label="Select" item-title="text"
                                item-value="sc" single-line :on-update:model-value="fetchClassInfo(classId)"></v-select>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col>
                    <v-card class="pt-2 pb-2" variant="tonal">
                        <v-card-title>
                            Tabla de estadisticas
                        </v-card-title>
                        <v-spacer></v-spacer>
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details
                            class="pl-5 pr-5" variant="outlined"></v-text-field>
                    </v-card>
                    <v-data-table :headers="headers" :items="items" class="elevation-1 border-1" density="compact"
                        :search="search" hover>
                        <template v-slot:no-data>
                            No data
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </div>
    </BaseContainer>
</template>

<script>
import { VDataTable } from 'vuetify/labs/VDataTable'
import store from 'storejs';
import { useStore } from 'vuex'
import { checkAuth } from '@/plugins/auth';
import { axiosClient } from '@/plugins/axiosClient';
import BaseContainer from '@/components/BaseContainer.vue';

export default {
    name: 'Classes',
    data() {
        return {
            search: '',
            dialog: false,
            currDate: '',
            selectItems: [],
            classId: { sc: -1, text: "Select" },
            classYear: '',
            classSection: '',
            classStatus: false,

            headers: [
                { title: 'id', key: 'id_stud', align: 'start', },
                { title: 'Dni', key: 'dni', align: 'start', },
                { title: 'Apellido', key: 'last_name', sortable: true, align: 'center' },
                { title: 'Nombre', key: 'first_name', align: 'center' },
                { title: 'Ausentes', key: 'present', align: 'center', },
                { title: 'Tardes', key: 'late', sortable: false, align: 'center', },
                { title: 'Registros Totales', key: 'total', align: 'center', },
                { title: 'Promedio', key: '', align: 'center', },
            ],
            items: [],

        }
    },
    beforeCreate() {
        checkAuth()
    },
    setup() {
        const store = useStore()
        store.commit('setPageTitle', { title: 'Classes', subtitle: 'Analitica de Clases' })
    },
    mounted() {
        this.fetchClasses()
    },
    methods: {
        async fetchClasses() {
            const accessToken = store.get('accessToken');
            const userId = store.get('userId');

            try {
                let result = await axiosClient({
                    method: 'get',
                    timeout: 2000,
                    url: "/classes",
                    params: {
                        'accessToken': accessToken,
                        'userId': userId
                    }
                })
                if (result.status == 200) {
                    this.selectItems = result.data.schoolClasses;
                }
            } catch (error) {
                console.log(error)
            }
        },
        async fetchClassInfo(classId) {
            const accessToken = store.get('accessToken');

            try {
                let result = await axiosClient({
                    method: 'get',
                    timeout: 2000,
                    url: "/classes/info",
                    params: {
                        'accessToken': accessToken,
                        'classId': classId
                    }
                })
                if (result.status == 200) {
                    this.items = result.data.classInfo;
                    this.classYear = result.data.scInfo.school_year
                    this.classSection = result.data.scInfo.school_section
                    this.classStatus = result.data.scInfo.status
                }
            } catch (error) {
                console.log(error)
            }
        },
    },
    components: { BaseContainer, VDataTable }
}

</script>
<style></style>
