<template>
    <BaseContainer>
        <div class="classesContainer fadeInCenter">
            <v-sheet width="100%" color="transparent">
                <v-row no-gutters>
                    <div style="display: flex; flex-wrap: wrap; width: 100%">
                        <v-col class="pa-0 mb-2" >
                            <v-card class="pb-8" color="surface-lighter-1" prepend-icon="mdi-information-variant"
                                title="Información del curso" subtitle="Info">
                                <div v-if="!(Object.keys(selectedGrade) == 0)">
                                    <h4 style="padding-left: 20px;">
                                        Curso: <v-menu transition="scale-transition">
                                            <template v-slot:activator="{ props }">
                                                <v-chip v-if="!(Object.keys(selectedGrade) == 0)" v-bind:="props"
                                                    variant="elevated" color="primary" append-icon="mdi-menu-down">
                                                    {{ Object.keys(selectedGrade) == 0 ? 'Select' : selectedGrade.title }}
                                                </v-chip>
                                            </template>
                                            <v-list>
                                                <v-list-item v-for="(item, i) in myGrades" @click="fetchClassInfo(item)">
                                                    <v-list-item-title>{{ item.title }} </v-list-item-title>
                                                </v-list-item>
                                            </v-list>
                                        </v-menu>
                                    </h4>
                                </div>
                                <div v-else style="padding: 2%; display: flex; flex-direction: column;">
                                    <v-chip color="primary" class="ma-2">
                                        Ningun Curso Seleccionado
                                    </v-chip>
                                    <v-menu transition="scale-transition">
                                        <template v-slot:activator="{ props }">
                                            <v-chip class="ma-2" v-bind:="props" variant="elevated" color="primary"
                                                append-icon="mdi-menu-down">
                                                {{ Object.keys(selectedGrade) == 0 ? 'Seleccionar Curso' :
                                                    selectedGrade.title }}
                                            </v-chip>
                                        </template>
                                        <v-list>
                                            <v-list-item v-for="(item, i) in myGrades" @click="fetchClassInfo(item)">
                                                <v-list-item-title>{{ item.title }} </v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                </div>
                            </v-card>
                        </v-col>
                        <v-col cols="8" class="pa-0">
                            <v-card color="surface-lighter-1" class="ml-2 mb-2" title="Buscar Estudiante"
                                subtitle="Escribir">
                                <div style="padding-bottom: 2%">
                                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                                        hide-details class="pl-5 pr-5" variant="outlined"></v-text-field>
                                </div>
                            </v-card>
                        </v-col>
                    </div>
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
                            <template v-slot:item.missing="{ item }">
                                {{ item.value.total - item.value.present }}
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
import { checkAuth } from '@/services/api/admissionService';
import { ferchGradesUser, fetchGradeInfo } from '@/services/api/gradesService'
import BaseContainer from '@/components/BaseContainer.vue';

export default {
    name: 'Classes',
    data() {
        return {
            search: '',
            dialog: false,
            currDate: '',
            myGrades: [],
            selectedGrade: {},
            studentId: -1,

            headers: [
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
        checkAuth([0, 1, 3])
    },
    setup() {
        const store = useStore()
        store.commit('setTitle', { title: 'Análisis', icon: 'mdi-chart-line' })
    },
    mounted() {
        if (typeof this.myGrades == 'undefined' || Object.keys(this.myGrades).length === 0) {
            this.fetchClasses()
            return
        }
    },
    methods: {
        async fetchClasses() {
            const accessToken = store.get('accessToken');
            const idUser = store.get('userId');
            this.myGrades = await ferchGradesUser(accessToken, idUser)
            this.fetchClassInfo(this.myGrades[0])
        },
        async fetchClassInfo(item) {
            this.selectedGrade = item
            console.log(this.selectedGrade.title)
            const accessToken = store.get('accessToken');
            this.items = await fetchGradeInfo(accessToken, item.id)
        }, getColor(present, late, total) {
            const pre = Number(present) - Number(late) * 0.5
            const tot = Number(total)
            const percent = pre / tot * 100
            if (percent < 30) return 'red'
            else if (percent <= 50) return 'orange'
            else return 'green'
        }, getValue(present, late, total) {
            const pre = Number(present) - Number(late) * 0.5
            const tot = Number(total)
            if (total == 0) return 0
            else {
                return Math.round(100 * pre / tot)
            }
        },
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
