<template>
    <v-card title="Empleados" subtitle="Editar Cursos" color="surface-lighter-1" class="ma-2 mr-5">
        <v-sheet>
            <v-data-table :headers="headers" :items="items" class="elevation-1 border-1" density="compact" hover>
                <template v-slot:top>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="100vh">
                        <v-card>
                            <v-card-title>
                                <span class="text-h5 pa-5">Editar Empleado</span>
                            </v-card-title>
                            <v-divider thickness="5"></v-divider>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-card variant="text" align="start">
                                                <v-card-title class="text-decoration-underline">Nombre</v-card-title>
                                                <v-card-text class="text-lg-h6">
                                                    <v-text-field v-model="editedItem.first_name"></v-text-field>
                                                </v-card-text>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6" align="end">
                                            <v-card variant="text">
                                                <v-card-title class="text-decoration-underline">Apellido</v-card-title>
                                                <v-card-text class="text-lg-h6">
                                                    <v-text-field v-model="editedItem.last_name"></v-text-field>
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
                <template v-slot:item.actions="{ item }">
                    <v-icon size="small" class="me-2" @click="editItem(item.raw)">
                        mdi-pencil
                    </v-icon>
                </template>
                <template v-slot:no-data>
                    <div class="noList">
                        No data
                    </div>
                </template>
                <template v-slot:item.email="{ item }">
                    <div v-if="item.value.email != null"> {{ item.value.email }}</div>
                    <div v-else class="noEmail"> No email</div>
                </template>
                <template v-slot:item.id_role="{ item }">
                    {{ this.roles[item.value.id_role] }}
                </template>
            </v-data-table>
        </v-sheet>
    </v-card>
</template>

<script>
import store from 'storejs';
import { VDataTable } from 'vuetify/labs/VDataTable'
import { axiosClient } from '@/plugins/axiosClient';

export default {
    name: 'Attendances',
    data() {
        return {
            dialog: false,
            status: false,
            roles: {
                1: "Preceptor",
                2: "Administrador",
            },

            headers: [
                { title: 'id', key: 'id_cls', align: 'start', width: '3%' },
                { title: 'Año', key: 'user_name', sortable: true, align: 'center', width: '10%' },
                { title: 'Seccion', key: 'last_name', align: 'center' },
                { title: 'Preceptor Asignado', key: 'first_name', align: 'center' },
                { title: 'Editar', key: 'actions', sortable: false, align: 'end', width: '8%' },
            ],
            items: [],
            idRollCall: -1,
            editedIndex: -1,
            editedItem: {
                id_emp: -1,
                user_name: -1,
                last_name: '',
                first_name: '',
                dni: false,
                email: false,
                id_role: false,

            },
        }
    },
    mounted() {
        this.fetchEmployees()
    },
    watch: {
        dialog(val) {
            val || this.close()
        },
    },
    methods: {
        async fetchEmployees() {
            const accessToken = store.get('accessToken');

            try {
                let result = await axiosClient({
                    method: 'get',
                    timeout: 5000,
                    url: "/employees",
                    params: {
                        'accessToken': accessToken,
                    }
                })
                if (result.status == 200) {
                    this.items = result.data.employeesInfo;
                }
            } catch (error) {
                console.log(error)
            }
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
                    url: "/employees/edit",
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
    components: { VDataTable, }
}

</script>
<style>
.noEmail {
    color: rgb(var(--v-theme-warning));
}
</style>
