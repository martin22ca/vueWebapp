<template>
    <BaseContainer>
        <div class="classContainer fadeInCenter">
            <v-card class="pt-2 pb-2" variant="tonal">
                <v-card-title>
                    <v-row>
                        <v-col cols="4">
                            <v-sheet color="transparent">
                                <h3 style="padding: 5px;">
                                    Dia: <v-chip variant="elevated" color="primary" @click="goToCalendar"
                                        append-icon="mdi-menu-down">
                                        {{ currentDate }}</v-chip>
                                </h3>
                            </v-sheet>
                        </v-col>
                        <v-col cols="4">
                            <v-sheet style="text-align: center;" color="transparent">
                                <h3 style="padding: 5px;">
                                    Curso:
                                    <v-menu transition="scale-transition">
                                        <template v-slot:activator="{ props }">
                                            <v-chip v-bind:="props" variant="elevated" color="primary"
                                                append-icon="mdi-menu-down">
                                                {{ Object.keys(selectedGrade) === 0 ? 'Select' : selectedGrade.title }}
                                            </v-chip>
                                        </template>
                                        <v-list>
                                            <v-list-item v-for="(item, i) in myGrades" :key="i"
                                                @click="manageClassUpdate(item)">
                                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                </h3>
                            </v-sheet>
                        </v-col>
                        <v-col cols="4">
                            <v-sheet style="text-align: end;" color="transparent">
                                <h3 style="padding: 5px;">
                                    Estado Actual:
                                    <v-chip :color="selectedGrade.closed ? 'secondary' : 'error'" variant="elevated">
                                        {{ selectedGrade.closed ? "ABIERTO" : "CERRADO" }}
                                    </v-chip>
                                </h3>
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details
                    class="pl-5 pr-5" variant="outlined"></v-text-field>
            </v-card>
            <v-data-table v-if="attendances.length > 0" :headers="headers" :items="attendances" class="elevation-1 border-1"
                density="compact" :search="search" hover>
                <template v-slot:top>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="editDialog" max-width="90%">
                        <v-card rounded="xl" style="overflow-y: auto; padding-top: 0;">
                            <template v-slot:title>
                                <h1 style="color:rgb(var(--v-theme-secondary)); overflow-y: hidden;">
                                    Asistencia
                                </h1>
                            </template>
                            <template v-slot:append>
                                <v-btn color="secondary" @click="fetchAttendences(); editDialog = false"
                                    prepend-icon="mdi-keyboard-return" class="mt-2 ma-2">
                                    Regresar
                                </v-btn>
                            </template>
                            <AttendanceInfo/>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="deleteDialog" max-width="70%" style="position: fixed; margin-left: auto;">
                        <v-card title="Estas seguro que quieres eliminar la asistencia?" subtitle=""
                            prepend-icon="mdi-alert" align="center" class="pb-4" rounded="xl">
                            <v-card-text style="font-style: italic; padding: 2px;">
                                Esta accion no es revertible. Desea continuear?
                            </v-card-text>
                            <v-card-item class="pb-4">
                                <v-btn class="ma-2" variant="tonal" @click="dailogDel = false" color="grey">Cancelar</v-btn>
                                <v-btn class="ma-2" variant="tonal" @click="removeAtt()" color="error">Eliminar</v-btn>
                            </v-card-item>
                        </v-card>
                    </v-dialog>
                </template>
                <template v-slot:item.time_arrival="{ item }" type="time">
                    <v-text-field class="mt-5" v-model="item.value.time_arrival" readonly type="time"
                        variant="plain"></v-text-field>
                </template>
                <template v-slot:item.img_encoded="{ item }">
                    <img v-if="item.value.img_encoded != null" class="attImg"
                        v-bind:src="this.decodeImage(item.value.img_encoded)" />
                    <img v-else class="attImgP" src="@/assets/Placeholder.png" />
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon size="small" class="me-2" @click="editItem(item.raw)">
                        mdi-information
                    </v-icon>
                    <v-icon v-if="item.value.id_att != null" size="small"
                        @click="editedIndex = item.value.id_att; deleteDialog = true;">
                        mdi-trash-can
                    </v-icon>
                </template>
                <template v-slot:no-data>
                    <div class="noList">
                        No data
                    </div>
                </template>
                <template v-slot:item.certainty="{ item }">
                    <v-chip :color="getColor(item.value.certainty)">
                        <v-tooltip activator="parent" location="left" color="#000">
                            <v-card prepend-icon="mdi-information-variant" title="Distancia euclidiana"
                                subtitle="indicador de certeza" max-width="300px" variant="elevated"
                                color="surface-lighter-2" rounded="xl" class="pa-0 ma-0"
                                text="La distancia indica que tan seguro esta el sistema del reconocimiento. Los valores normales estan alrededor de 1" />
                        </v-tooltip>
                        {{ getPercentage(item.value.certainty) }}
                    </v-chip>
                </template>
                <template v-slot:item.present="{ item }">
                    <v-checkbox-btn v-model="item.value.present" readonly
                        :color="item.value.present ? 'primary' : 'surface'" />
                </template>
                <template v-slot:item.arrival="{ item }">
                    <strong>{{ item.value.arrival == null ? '-- : --' : item.value.arrival }}</strong>
                </template>
                <template v-slot:item.late="{ item }">
                    <v-checkbox-btn v-model="item.value.late" readonly :color="item.value.late ? 'primary' : 'surface'" />
                </template>
            </v-data-table>
            <v-sheet v-else style="margin: 5%;  text-align: center;" color="background">
                <v-chip size="x-large" style="font-size: x-large;">No hay estudiantes en esta clase!</v-chip>
            </v-sheet>
        </div>
    </BaseContainer>
</template>

<script>
import { useRouter } from 'vue-router';
import { VDataTable } from 'vuetify/labs/VDataTable'
import AttendanceInfo from '@/components/AttendanceInfo.vue';
import BaseContainer from '@/components/BaseContainer.vue';
import { useStore } from 'vuex'
import store from 'storejs';
import { checkAuth } from '@/services/api/admissionService';
import { fetchAttendances } from '@/services/api/attendancesService'
import { ferchGradesUser } from '@/services/api/gradesService'
import { axiosExpressClient } from '@/plugins/axiosClient';

export default {
    name: 'Attendances',
    data() {
        return {
            deleteDialog: false,
            editDialog: false,
            router: useRouter(),
            storeX: useStore(),
            attDate: useStore().state.attDate,
            myGrades: useStore().state.myClasses,
            classId: useStore().state.classId,
            selectedGrade: {},
            search: '',
            headers: [
            { title: 'id', key: 'school_number', sortable: true, align: 'start' },
                { title: 'Apellido', key: 'last_name', sortable: true, align: 'center' },
                { title: 'Nombre', key: 'first_name', align: 'center' },
                { title: 'Hora entrada', key: 'arrival', align: 'center', width: '10%' },
                { title: 'Foto', key: 'img_encoded', sortable: false, align: 'center', },
                { title: 'Distancia', key: 'certainty', sortable: false, align: 'center', width: '10%' },
                { title: 'Presente', key: 'present', align: 'center', width: '3%' },
                { title: 'Acciones', key: 'actions', sortable: false, align: 'end', width: 'fit-content' },
            ],
            attendances: [],
            editedIndex: -1,
            editedItem: {},
        }
    },
    beforeCreate() {
        checkAuth([0, 1, 3])
    },
    mounted() {
        this.fetchClasses()
    },
    setup() {
        const store = useStore()
        store.commit('setTitle', { title: 'Asistencias', icon: 'mdi-table-network' })
        const attDate = store.state.attDate
        if (attDate == '') {
            const date = new Date();
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();

            const currentDate = `${day}-${month}-${year}`;
            store.commit('setDate', { date: currentDate })
        }
    },
    computed: {
        currentDate() {
            return this.$store.state.attDate
        },
    },
    watch: {
        editDialog(val) {
            val || this.close()
        },
    },
    methods: {
        async fetchAttendences() {
            const accessToken = store.get('accessToken');
            const currentDate = this.$store.state.attDate
            this.attendances = await fetchAttendances(accessToken, this.selectedGrade.id, currentDate)
        },
        async fetchClasses() {
            const accessToken = store.get('accessToken');
            const idUser = store.get('userId');
            this.myGrades = await ferchGradesUser(accessToken, idUser)
            this.selectedGrade = this.myGrades[0]
            this.fetchAttendences()
        },
        goToCalendar() {
            this.$router.push({
                name: 'Calendar',
            })
        },
        manageClassUpdate(item) {
            this.selectedGrade = item
            this.fetchAttendences()
        },
        decodeImage(encoded) {
            return "data:image/jpg;base64," + encoded;
        },
        editItem(item) {
            this.editedItem = item
            this.editedItem['att_date'] = this.$store.state.attDate
            this.storeX.commit('setEditItem', { newEditedObj: this.editedItem })
            this.editDialog = true
        },
        close() {
            this.editDialog = false
            this.$nextTick(() => {
                this.editedIndex = -1
            })
        },
        async removeAtt() {
            const accessToken = store.get('accessToken');
            const delId = this.editedIndex
            this.editedIndex = -1
            try {
                let result = await axiosExpressClient({
                    method: 'put',
                    timeout: 5000,
                    url: "/attendance/remove",
                    params: {
                        'accessToken': accessToken,
                        'id_att': delId,
                    }
                })
                if (result.status == 200) {
                    this.fetchAttendences()
                    this.deleteDialog = false
                }
            } catch (error) {
                console.log(error)
            }
        },
        getColor(value) {
            if (value == null) return 'secondary'
            if (value == 0) return ''
            if (value > 1.5) return 'error'
            else if (value < 1.2) return 'primary'
            else return 'warning'
        }, getPercentage(value) {
            if (value == null) return 'No Hay datos'
            if (value == 0) return 'Asistencia Manual'
            return value.toFixed(2)
        }
    },
    components: { BaseContainer, VDataTable, AttendanceInfo }
}

</script>
<style>
.noList {
    text-align: center;
    padding-top: 5%;
}

.classContainer {
    margin-top: 10px;
    margin-right: 10px;
    min-height: 750px;
}

.attImg {
    background-color: rgb(var(--v-theme-surface));
    margin: 5px;
    border-radius: 8px;
    padding: 5px;
    border: solid 1px;
    width: 100px;
    transition: transform .2s;
    position: relative;
    z-index: 1;
}

.attImg:hover {
    transform: scale(2);
    overflow: unset;
    z-index: 2;
}

.attImgP {
    margin: 5px;
    border-radius: 8px;
    padding: 5px;
    border: solid 1px;
    width: 100px;
    transition: transform .2s;
    position: relative;
    z-index: 1;
}

.v-tooltip>.v-overlay__content {
    background-color: transparent !important;
}
</style>
