<template>
    <BaseContainer>
        <div class="classContainer">
            <v-card class="pt-2 pb-2" variant="tonal">
                <v-card-title>
                    <v-row>
                        <v-col cols="4">
                            <v-sheet>
                                <h3 style="padding: 5px;">
                                    Dia: <v-chip variant="elevated" color="primary">{{ currentDate }}</v-chip>
                                </h3>
                            </v-sheet>
                        </v-col>
                        <v-col cols="4">
                            <v-sheet style="text-align: center;">
                                <h3 style="padding: 5px;">
                                    Curso: <v-chip variant="elevated" color="primary">{{ classYear }} - "{{ classSection
                                    }}"</v-chip>
                                </h3>
                            </v-sheet>

                        </v-col>
                        <v-col cols="4">
                            <v-sheet style="text-align: end;">
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
            <v-data-table :headers="headers" :items="items" class="elevation-1 border-1" density="compact" :search="search"
                hover>
                <template v-slot:top>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="600px">
                        <v-card>
                            <v-card-title>
                                <span class="text-h5 pa-5">Editar asistencia</span>
                            </v-card-title>
                            <v-divider thickness="5"></v-divider>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.first_name" readonly
                                                label="Nombre"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.last_name" readonly
                                                label="Apellido"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.time_arrival" label="Hora Ingreso"
                                                type="time"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <p>Presente</p>
                                            <v-checkbox-btn v-model="editedItem.present"
                                                :color="editedItem.present ? 'primary' : 'surface'" />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <p>Tarde</p>
                                            <v-checkbox-btn v-if="editedItem.present" v-model="editedItem.late"
                                                :color="editedItem.late ? 'primary' : 'surface'" />
                                            <v-checkbox-btn v-else disabled />
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
                    No data
                </template>
                <template v-slot:item.present="{ item }">
                    <v-checkbox-btn v-model="item.value.present" readonly
                        :color="item.value.present ? 'primary' : 'surface'" />
                </template>
                <template v-slot:item.late="{ item }">
                    <v-checkbox-btn v-model="item.value.late" readonly :color="item.value.late ? 'primary' : 'surface'" />
                </template>
            </v-data-table>
        </div>
    </BaseContainer>
</template>

<script>
import { VDataTable } from 'vuetify/labs/VDataTable'
import BaseContainer from '@/components/BaseContainer.vue';
import { useStore } from 'vuex'
import store from 'storejs';
import { checkAuth } from '@/plugins/auth';
import { useRouter } from 'vue-router';
import { axiosClient } from '@/plugins/axiosClient';

export default {
    name: 'Attendances',
    data() {
        return {
            dialog: false,
            status: false,
            currDate: '',
            classId: useStore().state.classId,
            classYear: useStore().state.classYear,
            classSection: useStore().state.classSection,

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
        checkAuth()
    },
    mounted() {
        if (this.classId != -1) { this.fetchAttendences() };
    },
    setup() {
        const store = useStore()
        const router = useRouter()
        const sect = store.state.classSection
        const classYear = store.state.classYear
        if (sect == "z" || classYear == -1) {
            router.push({
                name: 'Home',
            })
        }
        store.commit('setPageTitle', { title: 'Asistencias', })
        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        // This arrangement can be altered based on how we want the date's format to appear.
        let currentDate = `${day}-${month}-${year}`;
        store.commit('setDate', { date: currentDate })
    },
    computed: {
        currentDate() {
            return this.$store.state.currentDate
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
                    timeout: 2000,
                    url: "/attendence",
                    params: {
                        'accessToken': accessToken,
                        'classId': this.classId
                    }
                })
                if (result.status == 200) {
                    this.items = result.data.attendencesRows;
                    this.status = result.data.status;
                }
            } catch (error) {
                console.log(error)
            }
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
                    url: "/attendence/edit",
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
.classContainer {
    padding: 5px;
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
