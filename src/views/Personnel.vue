<template>
    <BaseContainer>
        <v-dialog v-model="registerDialog">
            <v-card rounded="xl">
                <template v-slot:title>
                    <h1 style="color:rgb(var(--v-theme-primary));">
                        Registrar Empleado
                    </h1>
                </template>
                <template v-slot:append>
                    <v-btn color="primary" @click="fetchEmployees(); registerDialog = false"
                        prepend-icon="mdi-keyboard-return">
                        Regresar
                    </v-btn>
                </template>
                <Register />
            </v-card>
        </v-dialog>
        <v-card title="Empleados" subtitle="Editar información de los empleados" color="surface-lighter-1"
            class="pa-2 fadeInCenter">
            <template v-slot:append>
                <v-btn color="primary" @click="registerDialog = true" prepend-icon="mdi-plus" class="mt-0 ma-2">
                    Registrar Empleado
                </v-btn>
            </template>
            <v-sheet>
                <v-data-table :headers="headers" :items="items" class="elevation-1 border-1" density="compact" hover>
                    <template v-slot:top>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="90%" style="position: fixed; margin-left: auto;">
                            <v-card rounded="xl">
                                <template v-slot:title>
                                    <h1 style="color:rgb(var(--v-theme-secondary));">
                                        Modificar Empleado
                                    </h1>
                                </template>
                                <template v-slot:append>
                                    <v-btn color="secondary" @click="fetchEmployees(); dialog = false"
                                        prepend-icon="mdi-keyboard-return" class="mt-0 ma-2">
                                        Regresar
                                    </v-btn>
                                </template>
                                <UpdatePersonnel />
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="dailogDel" max-width="55vh" style="position: fixed; margin-left: auto;">
                            <v-card title="Estas seguro que quiere eliminar este empleado?"
                                subtitle="Esta accion no es revertible." prepend-icon="mdi-alert" align="center"
                                class="pb-4" rounded="xl">
                                <v-card-item class="pb-4">
                                    <v-btn class="ma-2" variant="tonal" @click="dailogDel = false"
                                        color="grey">Cancelar</v-btn>
                                    <v-btn class="ma-2" variant="tonal" @click="deleteItem()" color="error">Eliminar</v-btn>
                                </v-card-item>
                            </v-card>
                        </v-dialog>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-icon size="small" class="me-2" @click="editItem(item.raw)">
                            mdi-pencil
                        </v-icon>
                        <v-icon size="small" class="me-2" @click="dailogDel = true; this.deleteItemIdx = item.value.id_emp">
                            mdi-trash-can
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
    </BaseContainer>
</template>

<script>
import store from 'storejs';
import { checkAuth } from '@/plugins/auth';
import { useStore } from 'vuex'
import BaseContainer from '@/components/BaseContainer.vue';
import { VDataTable } from 'vuetify/labs/VDataTable'
import { axiosClient } from '@/plugins/axiosClient';
import UpdatePersonnel from '@/components/Personnel/UpdatePersonnel.vue';
import Register from '@/components/Personnel/Register.vue';

export default {
    name: 'Attendances',
    data() {
        return {
            dialog: false,
            storeX: useStore(),
            dailogDel: false,
            registerDialog: false,
            status: false,
            roles: {
                1: "Preceptor",
                2: "Administrador",
                3: "Owner"
            },
            headers: [
                { title: 'Apellido', key: 'last_name', align: 'center', width: '15%' },
                { title: 'Nombre', key: 'first_name', align: 'center', width: '15%' },
                { title: 'DNI', key: 'dni', align: 'center', width: '8%' },
                { title: 'Email', key: 'email', align: 'center' },
                { title: 'Rol', key: 'id_role', align: 'center', width: '3%' },
                { title: 'Editar', key: 'actions', sortable: false, align: 'end' },
            ],
            items: [],
            deleteItemIdx: -1,
            editedItem: {},
        }
    },
    beforeCreate() {
        checkAuth([2, 3])
    },
    setup() {
        const storeX = useStore()
        storeX.commit('setTitle', { title: 'Empleados', icon: 'mdi-briefcase' })
    },
    mounted() {
        this.fetchEmployees()
    },
    watch: {
        dialog(newVal) {
            this.fetchEmployees()
        }
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
            this.storeX.commit('setEditItem', { newEditedObj: this.editedItem })

            this.dialog = true
        },
        async deleteItem() {
            const accessToken = store.get('accessToken');

            try {
                let result = await axiosClient({
                    method: 'put',
                    timeout: 5000,
                    url: "/employees/remove",
                    params: {
                        'accessToken': accessToken,
                        'idEmp': this.deleteItemIdx,
                    }
                })
                if (result.status == 200) {
                    this.fetchEmployees()
                    this.dailogDel = false
                }
            } catch (error) {
                console.log(error)
            }
        }
    },
    components: { VDataTable, BaseContainer, UpdatePersonnel, Register }
}

</script>
<style>
.noEmail {
    color: rgb(var(--v-theme-warning));
}

.v-container {
    max-width: 100%;
}
</style>
