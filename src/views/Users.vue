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
                    <v-btn color="primary" @click="getUsers(); registerDialog = false" prepend-icon="mdi-keyboard-return">
                        Regresar
                    </v-btn>
                </template>
                <RegisterUser />
            </v-card>
        </v-dialog>
        <v-card title="Empleados" subtitle="Editar información de los empleados" color="surface-lighter-1"
            class="pa-2 fadeInCenter mr-2">
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
                                    <v-btn color="secondary" @click="getUsers(); dialog = false"
                                        prepend-icon="mdi-keyboard-return" class="mt-0 ma-2">
                                        Regresar
                                    </v-btn>
                                </template>
                                <UpdateUser />
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
                    <template v-slot:item.active="{ item }">
                        <v-checkbox v-model="item.value.active" readonly></v-checkbox>
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
                    <template v-slot:item.actions="{ item }">
                        <v-icon icon="mdi-pencil" class="me-2 h-20" @click="editItem(item.raw)" />
                        <v-icon v-if="item.value.active" icon="mdi-cancel" class="me-2" color="warning"
                            @click="changeUserState(item.raw, false)" />
                        <v-icon v-if="!item.value.active" icon="mdi-check" class="me-2" color="success"
                            @click="changeUserState(item.raw, true)" />
                        <v-icon v-if="!item.value.active" icon="mdi-trash-can" class="me-2" color="error"
                            @click="dailogDel = true; this.itemToDelete = item.raw" />
                    </template>
                </v-data-table>
            </v-sheet>
        </v-card>
    </BaseContainer>
</template>

<script>
import store from 'storejs';
import { checkAuth } from '@/services/api/admissionService';
import { useStore } from 'vuex'
import BaseContainer from '@/components/BaseContainer.vue';
import { VDataTable } from 'vuetify/labs/VDataTable'
import { fetchUsers, changeState, deleteUser } from '@/services/api/usersService'
import UpdateUser from '@/components/Users/UpdateUser.vue';
import RegisterUser from '@/components/Users/RegisterUser.vue';

export default {
    name: 'Attendances',
    data() {
        return {
            dialog: false,
            storeX: useStore(),
            dailogDel: false,
            registerDialog: false,
            status: false,
            headers: [
                { title: 'Apellido', key: 'last_name', align: 'start', width: 'auto' },
                { title: 'Nombre', key: 'first_name', align: 'center', width: 'auto' },
                { title: 'DNI', key: 'dni', align: 'center', width: 'auto' },
                { title: 'Email', key: 'email', align: 'center' },
                { title: 'Rol', key: 'value', align: 'center', width: 'auto' },
                { title: 'Estado', key: 'active', align: 'center', width: '4%' },
                { title: 'Editar', key: 'actions', sortable: false, align: 'end', width: 'auto' },
            ],
            items: [],
            itemToDelete: {},
            editedItem: {},
        }
    },
    beforeCreate() {
        checkAuth([0, 1, 2])
    },
    setup() {
        const storeX = useStore()
        storeX.commit('setTitle', { title: 'Empleados', icon: 'mdi-briefcase' })
    },
    mounted() {
        this.getUsers()
    },
    watch: {
        dialog(newVal) {
            this.getUsers()
        }
    },
    methods: {
        async getUsers() {
            const accessToken = store.get('accessToken');
            this.items = await fetchUsers(accessToken)
        },
        async changeUserState(item, status) {
            const accessToken = store.get('accessToken');
            item.active = status
            await changeState(accessToken, item.id_user, status)
        },
        editItem(item) {
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.storeX.commit('setEditItem', { newEditedObj: this.editedItem })

            this.dialog = true
        },
        async deleteItem() {
            const accessToken = store.get('accessToken');
            if (await deleteUser(accessToken, this.itemToDelete.id_user)) {
                this.items.splice(this.items.indexOf(this.itemToDelete), 1)
                this.dailogDel = false
            }
        }
    },
    components: { VDataTable, BaseContainer, UpdateUser, RegisterUser }
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
