<template>
    <BaseContainer>
        <div class="classContainer">
            <v-card class="pt-2 pb-2" variant="tonal">
                <v-card-title>
                    <v-row>
                        <v-col cols="4">
                            <v-sheet color="transparent">
                                <h3 style="padding: 5px;">
                                    Dia: <v-chip variant="elevated" color="primary">{{ currentDate }}</v-chip>
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
                                                append-icon="mdi-menu-down">{{ classYear }} - "{{
                                                    classSection
                                                }}"
                                            </v-chip>
                                        </template>
                                        <v-list>
                                            <v-list-item v-for="(item, i) in myClasses" :key="i" :value="item.sc"
                                                @click="manageClassUpdate(i)">
                                                <v-list-item-title>{{ item.text }}</v-list-item-title>
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

                                    <v-chip :color="status ? 'secondary' : 'error'" variant="elevated">
                                        {{ status ? "ABIERTO" : "CERRADO" }}
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
            <v-data-table v-if="items.length > 0" :headers="headers" :items="items" class="elevation-1 border-1"
                density="compact" :search="search" hover>
                <template v-slot:top>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="400px">
                        <v-card>
                            <v-card-title>
                                <span class="text-h5 pa-5">Editar asistencia</span>
                            </v-card-title>
                            <v-divider thickness="5"></v-divider>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-card variant="text" align="start">
                                                <v-card-title class="text-decoration-underline">Nombre</v-card-title>
                                                <v-card-text class="text-lg-h6">
                                                    {{ editedItem.first_name }}
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6" align="end">
                                            <v-card variant="text">
                                                <v-card-title class="text-decoration-underline">Apellido</v-card-title>
                                                <v-card-text class="text-lg-h6">
                                                    {{ editedItem.last_name }}
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="12">
                                            <v-card variant="text">
                                                <v-card-title align="start" class="text-decoration-underline">Hora
                                                    Ingreso</v-card-title>
                                                <v-card-text>
                                                    <v-text-field v-model="editedItem.time_arrival"
                                                        type="time"></v-text-field>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="6" align="center">
                                            <v-card variant="text">
                                                <v-card-title class="text-decoration-underline">Presente</v-card-title>
                                                <v-card-text>
                                                    <v-checkbox-btn v-model="editedItem.present"
                                                        :color="editedItem.present ? 'primary' : 'surface'" />
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6" align="center">
                                            <v-card variant="text">
                                                <v-card-title class="text-decoration-underline">Tarde</v-card-title>
                                                <v-card-text>
                                                    <v-checkbox-btn v-if="editedItem.present" v-model="editedItem.late"
                                                        :color="editedItem.late ? 'primary' : 'surface'" />
                                                    <v-checkbox-btn v-else disabled />
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn class="ma-2" color="secondary" variant="tonal" @click="close">
                                    Cancel
                                </v-btn>
                                <v-btn class="ma-2" color="secondary" variant="tonal" @click="save">
                                    Guardar
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </template>
                <template v-slot:item.time_arrival="{ item }" type="time">
                    <v-text-field class="mt-5" v-model="item.value.time_arrival" readonly type="time"></v-text-field>
                </template>
                <template v-slot:item.img_encoded="{ item }">
                    <img v-if="item.value.img_encoded != null" class="attImg"
                        v-bind:src="this.decodeImage(item.value.img_encoded)" />
                    <div v-else>
                        No Image
                    </div>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon size="small" class="me-2" @click="editItem(item.raw)">
                        mdi-pencil
                    </v-icon>
                    <v-icon size="small" @click="moreInfo(item.raw)">
                        mdi-dots-horizontal-circle
                    </v-icon>
                </template>
                <template v-slot:no-data>
                    <div class="noList">
                        No data
                    </div>
                </template>
                <template v-slot:item.present="{ item }">
                    <v-checkbox-btn v-model="item.value.present" readonly
                        :color="item.value.present ? 'primary' : 'surface'" />
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
import { VDataTable } from 'vuetify/labs/VDataTable'
import BaseContainer from '@/components/BaseContainer.vue';
import { useStore } from 'vuex'
import store from 'storejs';
import { checkAuth } from '@/plugins/auth';
import { axiosClient } from '@/plugins/axiosClient';

export default {
    name: 'Attendances',
    data() {
        return {
            dialog: false,
            status: false,
            attDate: useStore().state.attDate,
            myClasses: useStore().state.myClasses,
            classId: useStore().state.classId,
            classYear: -1,
            classSection: '',

            search: '',
            headers: [
                { title: 'id', key: 'id_stud', align: 'start', width: '3%' },
                { title: 'Apellido', key: 'last_name', sortable: true, align: 'center' },
                { title: 'Nombre', key: 'first_name', align: 'center' },
                { title: 'Hora entrada', key: 'time_arrival', align: 'center', width: '10%' },
                { title: 'Foto', key: 'img_encoded', sortable: false, align: 'center', },
                { title: 'Presente', key: 'present', align: 'center', width: '3%' },
                { title: 'Tarde', key: 'late', align: 'center', width: '3%' },
                { title: 'Acciones', key: 'actions', sortable: false, align: 'end', width: '8%' },
            ],
            items: [],
            idRollCall: -1,
            editedIndex: -1,
            editedItem: {
                id_att: -1,
                id_stud: -1,
                first_name: '',
                last_name: '',
                present: false,
                late: false,
                img_encoded: '',
                time_arrival: '',
            },
        }
    },
    beforeCreate() {
        checkAuth(1)
    },
    mounted() {
        if (typeof this.myClasses == 'undefined' || Object.keys(this.myClasses).length === 0) {
            this.fetchClasses()
            return
        } else if (this.classId == -1 || this.classId == undefined) {
            let firstKey = Object.keys(this.myClasses)[0];
            this.classId = this.myClasses[firstKey].sc
            this.classSection = this.myClasses[firstKey].school_section
            this.classYear = this.myClasses[firstKey].school_year
        } else {
            this.classSection = this.myClasses[this.classId].school_section
            this.classYear = this.myClasses[this.classId].school_year
        }
        this.fetchAttendences()
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

            // This arrangement can be altered based on how we want the date's format to appear.
            let currentDate = `${day}-${month}-${year}`;
            store.commit('setDate', { date: currentDate })
        }
    },
    computed: {
        currentDate() {
            return this.$store.state.attDate
        },
    },
    watch: {
        dialog(val) {
            val || this.close()
        },
    },
    methods: {
        async fetchAttendences() {
            const accessToken = store.get('accessToken');

            try {
                let result = await axiosClient({
                    method: 'get',
                    timeout: 5000,
                    url: "/attendance",
                    params: {
                        'accessToken': accessToken,
                        'classId': this.classId,
                        'attDate': this.attDate
                    }
                })
                if (result.status == 200) {
                    this.items = result.data.attendancesRows;
                    this.status = result.data.status;
                }
            } catch (error) {
                console.log(error)
            }
        },
        async fetchClasses() {
            const storeX = useStore()
            const accessToken = store.get('accessToken');
            const userId = store.get('userId');

            try {
                let result = await axiosClient({
                    method: 'get',
                    timeout: 5000,
                    url: "/classes/employee",
                    params: {
                        'accessToken': accessToken,
                        'userId': userId
                    }
                })
                if (result.status == 200) {
                    this.myClasses = result.data.classObjs;
                    storeX.commit('setMyClasses', { myClasses: result.data.classObjs })
                    if (this.classId == -1 || this.classId == undefined) {
                        let firstKey = Object.keys(this.myClasses)[0];
                        this.classId = this.myClasses[firstKey].sc
                        this.classSection = this.myClasses[firstKey].school_section
                        this.classYear = this.myClasses[firstKey].school_year
                    } else {
                        this.classSection = this.myClasses[this.classId].school_section
                        this.classYear = this.myClasses[this.classId].school_year
                    }
                    this.fetchAttendences()
                }
            } catch (error) {
                console.log(error)
            }
        },
        manageClassUpdate(idx) {
            this.classId = this.myClasses[idx].sc
            this.classSection = this.myClasses[idx].school_section
            this.classYear = this.myClasses[idx].school_year
            this.fetchAttendences()
        },
        decodeImage(encoded) {
            return "data:image/jpg;base64," + encoded;
        },
        editItem(item) {
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedIndex = -1
            })
        },

        save() {
            Object.assign(this.items[this.editedIndex], this.editedItem)
            this.saveEdits()
            this.close()
        },
        async saveEdits() {
            const accessToken = store.get('accessToken');

            try {
                let result = await axiosClient({
                    method: 'put',
                    timeout: 2000,
                    url: "/attendance/edit",
                    headers: {
                        'content-type': 'application/json',
                    },
                    data: {
                        'accessToken': accessToken,
                        'idRollCall': this.idRollCall,
                        'idAtt': this.editedItem.id_att,
                        'idStud': this.editedItem.id_stud,
                        'timeArrival': this.editedItem.time_arrival,
                        'present': this.editedItem.present,
                        'late': this.editedItem.late
                    }
                })
                if (result.status == 200)
                    this.messages = result.data.messages;
            } catch (error) {
                console.log(error)
            }
        },
        moreInfo(item) {
            console.log(item)
        }
    },
    components: { BaseContainer, VDataTable, }
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
    margin: 5px;
    border-radius: 8px;
    padding: 5px;
    border: solid 1px;
    width: 100px;
    transition: transform .2s;
}

.attImg:hover {
    transform: scale(2);
    /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
}
</style>
