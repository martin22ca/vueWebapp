<template>
    <BaseContainer>
        <div class="classesContainer fadeInCenter">
            <v-sheet width="100%">
                <v-row no-gutters>
                    <v-col>
                        <v-card color="surface-lighter-1" prepend-icon="mdi-information-variant"
                            title="Informacion del curso" subtitle="Info" class="mb-2 ">
                            <div v-if="classYear != -1">
                                <h4 style="padding-left: 20px;">
                                    Curso: <v-menu transition="scale-transition">
                                        <template v-slot:activator="{ props }">
                                            <v-chip v-if="classYear != -1" v-bind:="props" variant="elevated"
                                                color="primary" append-icon="mdi-menu-down">{{ classYear }} - "{{
                                                    classSection
                                                }}"
                                            </v-chip>
                                            <v-chip v-else v-bind:="props" variant="elevated" color="primary"
                                                append-icon="mdi-menu-down"> Select
                                            </v-chip>
                                        </template>
                                        <v-list>
                                            <v-list-item v-for="(item, i) in myClasses" :key="i" :value="item.sc"
                                                @click="fetchClassInfo(item.sc)">
                                                <v-list-item-title>{{ item.text }}</v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                </h4>
                                <h4 style="padding: 20px;">
                                    Estado Actual: <v-chip :color="classStatus ? 'secondary' : 'error'" variant="elevated">
                                        {{ classStatus ? "ABIERTO" : "CERRADO" }}
                                    </v-chip>
                                </h4>
                            </div>
                            <div v-else style="padding: 2%; ">
                                <v-chip color="primary" class="ma-2">
                                    Ningun Curso Seleccionado
                                </v-chip>
                                <v-menu transition="scale-transition">
                                    <template v-slot:activator="{ props }">
                                        <v-chip v-if="classYear != -1" v-bind:="props" variant="elevated" color="primary"
                                            append-icon="mdi-menu-down">{{ classYear }} - "{{
                                                classSection
                                            }}"
                                        </v-chip>
                                        <v-chip v-else v-bind:="props" variant="elevated" color="primary"
                                            append-icon="mdi-menu-down"> Selecionar
                                        </v-chip>
                                    </template>
                                    <v-list>
                                        <v-list-item v-for="(item, i) in myClasses" :key="i" :value="item.sc"
                                            @click="fetchClassInfo(item.sc)">
                                            <v-list-item-title>{{ item.text }} </v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </div>
                        </v-card>
                    </v-col>
                    <v-col cols="8">
                        <v-card color="surface-lighter-1" class="ml-2 mb-2" title="Buscar Estudiante" subtitle="Escribir">
                            <div style="padding-bottom: 2%">
                                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                                    hide-details class="pl-5 pr-5" variant="outlined"></v-text-field>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-sheet>
            <v-row no-gutters>
                <v-col style="display: table-cell;">
                    <v-card class="pt-2 pb-2" variant="tonal">
                        <v-card-title>
                            Tabla de estadisticas
                        </v-card-title>
                        <v-spacer></v-spacer>
                    </v-card>
                    <div v-if="items.length != 0">
                        <v-data-table v-if="studentId == -1" :headers="headers" :items="items" class="elevation-1 border-1"
                            density="compact" :search="search" hover>
                            <template v-slot:no-data>
                                No data
                            </template>
                            <template v-slot:item.percentage="{ item }">
                                <v-chip :color="getColor(item.value.present, item.value.late, item.value.total)">
                                    {{ getValue(item.value.present, item.value.late, item.value.total) }} </v-chip>
                            </template>
                        </v-data-table>
                    </div>
                    <div v-else>
                        <v-sheet style="text-align: center; font-size: xx-large; margin-top: 80px;" class="pa-2"
                            color="background">
                            Ningun Curso Seleccionado!
                        </v-sheet>
                    </div>
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
            myClasses: useStore().state.myClasses,
            classYear: -1,
            classSection: '',
            studentId: -1,
            classStatus: false,

            headers: [
                { title: 'id', key: 'id_stud', align: 'start', },
                { title: 'Dni', key: 'dni', align: 'start', },
                { title: 'Apellido', key: 'last_name', sortable: true, align: 'center' },
                { title: 'Nombre', key: 'first_name', align: 'center' },
                { title: 'Presentes', key: 'present', align: 'center', },
                { title: 'Ausentes', key: 'missing', align: 'center', },
                { title: 'Tardes', key: 'late', sortable: false, align: 'center', },
                { title: 'Registros Totales', key: 'total', align: 'center', },
                { title: 'Porcentaje', key: 'percentage', align: 'center', },
            ],
            items: [],

        }
    },
    beforeCreate() {
        checkAuth(1)
    },
    setup() {
        const store = useStore()
        store.commit('setTitle', { title: 'Analisis', icon: 'mdi-chart-line' })
    },
    mounted() {
        if (typeof this.myClasses == 'undefined' || Object.keys(this.myClasses).length === 0) {
            this.fetchClasses()
            return
        }
    },
    methods: {
        async fetchClasses() {
            const accessToken = store.get('accessToken');
            const userId = store.get('userId');

            try {
                let result = await axiosClient({
                    method: 'get',
                    timeout: 2000,
                    url: "/classes/employee",
                    params: {
                        'accessToken': accessToken,
                        'userId': userId
                    }
                })
                if (result.status == 200) {
                    this.myClasses = result.data.classObjs;
                }
            } catch (error) {
                console.log(error)
            }
        },
        async fetchClassInfo(classId) {
            this.classYear = this.myClasses[classId].school_year
            this.classSection = this.myClasses[classId].school_section
            this.classStatus = this.myClasses[classId].status
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
                }
            } catch (error) {
                console.log(error)
            }
        }, getColor(present, late, total) {
            const pre = Number(present) - Number(late)*0.5 
            const tot = Number(total)
            const percent = pre / tot * 100
            if (percent < 30) return 'red'
            else if (percent <= 50) return 'orange'
            else return 'green'
        }, getValue(present, late, total) {
            const pre = Number(present) - Number(late)*0.5
            const tot = Number(total)
            if (total == 0) return 0
            else {
                return Math.round(100 * pre / tot)
            }
        }
    },
    components: { BaseContainer, VDataTable }
}

</script>
<style>
.classesContainer {
    margin-top: 10px;
    margin-right: 10px;
    min-height: 75vh;
}
</style>
