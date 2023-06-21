<template>
    <BaseContainer>
        <v-dialog v-model="registerDialog" max-width="100vh">
            <v-card rounded="xl">
                <template v-slot:title>
                    <h1 style="color:rgb(var(--v-theme-primary));">
                        Registrar Estudiante
                    </h1>
                </template>
                <template v-slot:append>
                    <v-btn color="primary" @click="fetchStudents(); registerDialog = false"
                        prepend-icon="mdi-keyboard-return" class="mt-0 ma-2">
                        Regresar
                    </v-btn>
                </template>
                <RegisterStudent />
            </v-card>
        </v-dialog>
        <v-card v-if="currentStudId == -1" title="Estudiantes" subtitle="Editar informacion de los Estudiantes"
            color="surface-lighter-1" class="pa-2">
            <template v-slot:append>
                <v-btn color="primary" @click="registerDialog = true" prepend-icon="mdi-plus" class="mt-0 ma-2">
                    Registrar Estudiante
                </v-btn>
            </template>
            <v-card-item>
                <v-row>
                    <v-col>
                        Selecionar Curso:
                        <v-menu transition="scale-transition">
                            <template v-slot:activator="{ props }">
                                <v-chip v-if="currentClass != ''" v-bind:="props" variant="elevated" color="primary"
                                    append-icon="mdi-menu-down">{{ currentClass }}
                                </v-chip>
                                <v-chip v-else v-bind:="props" variant="elevated" color="primary"
                                    append-icon="mdi-menu-down">
                                    Select
                                </v-chip>
                            </template>
                            <v-list>
                                <v-list-item v-for="item in  myClasses " value="value"
                                    @click="currentClassId = item.sc; currentClass = item.text; fetchStudents()">
                                    <v-list-item-title>{{ item.text }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-col>
                    <v-col class="text-end">
                    </v-col>
                </v-row>
            </v-card-item>
            <v-sheet>
                <v-data-table v-if="items.length > 0" :headers="headers" :items="items" class="elevation-1 border-1" hover>
                    <template v-slot:top>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="100vh" style="position: fixed; margin-left: auto;">
                            <v-card rounded="xl">
                                <template v-slot:title>
                                    <h1 style="color:rgb(var(--v-theme-secondary));">
                                        Modificar Estudiante
                                    </h1>
                                </template>
                                <template v-slot:append>
                                    <v-btn color="secondary" @click="fetchStudents(); dialog = false"
                                        prepend-icon="mdi-keyboard-return" class="mt-0 ma-2">
                                        Regresar
                                    </v-btn>
                                </template>
                                <UpdateStudent />
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="dailogDel" max-width="57vh" style="position: fixed; margin-left: auto;">
                            <v-card title="Estas seguro que quiere eliminar al estudiante?"
                                subtitle="Esta accion no es revertible." prepend-icon="mdi-alert" align="center"
                                class="pb-4" rounded="xl">
                                <v-card-item class="pb-4">
                                    <v-btn class="ma-2" variant="tonal" @click=" dailogDel = false"
                                        color="grey">Cancelar</v-btn>
                                    <v-btn class="ma-2" variant="tonal" @click=" deleteItem()"
                                        color="error">Eliminar</v-btn>
                                </v-card-item>
                            </v-card>
                        </v-dialog>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-icon size="small" class="me-2" @click=" editItem(item.raw)">
                            mdi-pencil
                        </v-icon>
                        <v-icon size="small" class="me-2"
                            @click=" dailogDel = true; this.deleteItemIdx = item.value.id_stud">
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
                    <template v-slot:item.status="{ item }">
                        <v-btn v-if="item.value.status != null" :color="this.recogStatus[item.value.status].color"
                            variant="tonal" @click=" enableFaceRecog(item.raw)">
                            <v-tooltip activator="parent" location="left">
                                <v-card prepend-icon="mdi-information-variant" title="Registrado" rounded="xl"
                                    :subtitle="this.recogStatus[item.value.status].info"
                                    :color="this.recogStatus[item.value.status].color" class="pa-0 ma-0" />
                            </v-tooltip>
                            {{ this.recogStatus[item.value.status].text }}
                        </v-btn>
                        <v-btn v-else class="ma-1" color="warning" variant="tonal" @click=" enableFaceRecog(item.raw)">
                            <v-tooltip activator="parent" location="left">
                                <v-card prepend-icon="mdi-information-variant" title="No Habilitado" rounded="xl"
                                    color="warning" subtitle="Para habiliar, debe registre 10 fotos del estudiante." />
                            </v-tooltip>
                            Habilitar
                        </v-btn>
                    </template>
                </v-data-table>
                <div v-else>
                    <v-card variant="elevated">
                        <v-card-title> <v-icon icon="mdi-information-variant" /> No hay alumnos en el curso: {{
                            currentClass
                        }}</v-card-title>
                        <v-card-subtitle> Selecione otra clase o asigne alumnos</v-card-subtitle>
                        <v-card-item>
                        </v-card-item>
                    </v-card>
                </div>
            </v-sheet>
        </v-card>
        <v-card v-else title="Reconocimiento Facial" subtitle="Control" class="ma-2 mr-5" prepend-icon="mdi-image">
            <template v-slot:append>
                <v-btn @click=" currentStudId = -1; fetchStudents()" prepend-icon="mdi-arrow-left" color="primary">
                    Regresar
                </v-btn>
            </template>
            <AISetup />
        </v-card>
    </BaseContainer>
</template>

<script>
import store from 'storejs';
import { useStore } from 'vuex'
import { checkAuth } from '@/plugins/auth';
import BaseContainer from '@/components/BaseContainer.vue';
import { VDataTable } from 'vuetify/labs/VDataTable'
import { axiosClient } from '@/plugins/axiosClient';
import UpdateStudent from '@/components/StudentManage/UpdateStudent.vue';
import RegisterStudent from '@/components/StudentManage/RegisterStudent.vue';
import AISetup from '@/components/faceRecog/AISetup.vue'

export default {
    name: 'Attendances',
    data() {
        return {
            dialog: false,
            storeX: useStore(),
            dailogDel: false,
            registerDialog: false,
            myClasses: [],
            currentClass: '',
            currentClassId: -1,
            currentStudId: -1,
            recogStatus: {
                1: { text: 'Trabajando', color: 'secondary', info: 'El sitema esta validando las fotos.' },
                2: { text: 'Habilitado', color: 'primary', info: 'El sitema ya registro las fotos en el sistema.' },
                3: { text: 'Error', color: 'error', info: 'Hubo un error en el sistema se deben registrar las fotos otra vez.' },
            },
            headers: [
                { title: 'id', key: 'id_stud', align: 'start', width: '3%' },
                { title: 'Apellido', key: 'last_name', align: 'center' },
                { title: 'Nombre', key: 'first_name', align: 'center' },
                { title: 'Email', key: 'email', align: 'center' },
                { title: 'DNI', key: 'dni', align: 'center', width: '8%' },
                { title: 'Reconocimiento', key: 'status', align: 'center' },
                { title: 'Editar', key: 'actions', sortable: false, align: 'end' },
            ],
            items: [],
            editedItem: {},
        }
    },
    mounted() {
        this.fetchClasses()
    },
    beforeCreate() {
        checkAuth([1, 3])
    },
    setup() {
        const storeX = useStore()
        storeX.commit('setTitle', { title: 'Alumnos', icon: 'mdi-school' })
    },
    watch: {
        dialog(newVal) {
            this.fetchStudents()
        }
    },
    methods: {
        async fetchStudents() {
            const accessToken = store.get('accessToken');
            try {
                let response = await axiosClient({
                    method: 'get',
                    timeout: 5000,
                    url: "/students",
                    params: {
                        'accessToken': accessToken,
                        'idClass': this.currentClassId,
                    }
                })
                if (response.status == 200) {
                    this.items = response.data.students;
                }
            } catch (error) {
                console.log(error)
            }
        },
        async fetchClasses() {
            const accessToken = store.get('accessToken');
            const userId = store.get('userId');

            try {
                let response = await axiosClient({
                    method: 'get',
                    timeout: 2000,
                    url: "/classes/employee",
                    params: {
                        'accessToken': accessToken,
                        'userId': userId,
                    }
                })
                if (response.status == 200) {
                    this.myClasses = response.data.classObjs
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
                    url: "/students/remove",
                    params: {
                        'accessToken': accessToken,
                        'idStud': this.deleteItemIdx,
                    }
                })
                if (result.status == 200) {
                    this.fetchStudents()
                    this.dailogDel = false
                }
            } catch (error) {
                console.log(error)
            }
        },
        enableFaceRecog(item) {
            this.currentStudId = item.id_stud
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            console.log(this.editedItem)
            this.storeX.commit('setEditItem', { newEditedObj: this.editedItem })
        }
    },
    components: { BaseContainer, VDataTable, UpdateStudent, RegisterStudent, AISetup }
}

</script>
<style>
.noEmail {
    color: rgb(var(--v-theme-warning));
}

.v-tooltip>.v-overlay__content {
    background-color: transparent !important;
}
</style>
