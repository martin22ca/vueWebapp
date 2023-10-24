<template>
    <BaseContainer>
        <v-dialog v-model="registerDialog" max-width="100vh" min-width="70vw">
            <v-card rounded="xl">
                <template v-slot:title>
                    <h1 style="color:rgb(var(--v-theme-primary));">
                        Registrar Alumno
                    </h1>
                </template>
                <template v-slot:append>
                    <v-btn color="primary" @click="; registerDialog = false" prepend-icon="mdi-keyboard-return"
                        class="mt-0 ma-2">
                        Regresar
                    </v-btn>
                </template>
                <RegisterStudent />
            </v-card>
        </v-dialog>
        <div v-if="!faceRecognition" style="margin-right: 10px;">
            <v-card title="Estudiantes" subtitle="Editar información de los Estudiantes" color="surface-lighter-1"
                class="pa-2 fadeInCenter">
                <template v-slot:append>
                    <v-btn color="primary" @click="registerDialog = true" prepend-icon="mdi-plus" class="mt-0 ma-2">
                        Registrar Alumno
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
                                        @click="currentGradeId = item.value; currentClass = item.text; getStudents()">
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
                    <v-data-table v-if="items.length > 0" :headers="headers" :items="items" class="elevation-1 border-1"
                        hover>
                        <template v-slot:top>
                            <v-divider class="mx-4" inset vertical></v-divider>
                            <v-spacer></v-spacer>
                            <v-dialog v-model="dialog" max-width="100vh" style="position: fixed; margin-left: auto;"
                                min-width="70vw">
                                <v-card rounded="xl">
                                    <template v-slot:title>
                                        <h1 style="color:rgb(var(--v-theme-secondary));">
                                            Modificar Estudiante
                                        </h1>
                                    </template>
                                    <template v-slot:append>
                                        <v-btn color="secondary" @click="getStudents(); dialog = false"
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
                            <v-icon size="small" class="me-2" @click="editItem(item.raw)">
                                mdi-information
                            </v-icon>
                            <v-icon size="small" class="me-2" color="warning"
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
                        <template v-slot:item.value="{ item }">
                            <v-btn :color="item.value.color" variant="tonal" @click="enableFaceRecog(item.raw)">
                                <v-tooltip activator="parent" location="left">
                                    <v-card prepend-icon="mdi-information-variant" :title="item.value.value" rounded="xl"
                                        :text="item.value.description" max-width="25vw" :color="item.value.color"
                                        class="pa-0 ma-0" />
                                </v-tooltip>
                                {{ item.value.value }}
                            </v-btn>
                        </template>
                    </v-data-table>
                    <div v-else>
                        <v-card variant="elevated">
                            <v-card-title>
                                <v-icon icon="mdi-information-variant" />
                                No hay alumnos en el curso: {{ currentClass }}
                            </v-card-title>
                            <v-card-subtitle> Selecione otra clase o asigne alumnos</v-card-subtitle>
                        </v-card>
                    </div>
                </v-sheet>
            </v-card>
        </div>
        <AISetup :get-back="getBack" v-else />
    </BaseContainer>
</template>

<script>
import store from 'storejs';
import { useStore } from 'vuex'
import { checkAuth } from '@/services/api/admissionService';
import BaseContainer from '@/components/BaseContainer.vue';
import { VDataTable } from 'vuetify/labs/VDataTable'
import { axiosExpressClient } from '@/plugins/axiosClient';
import { ferchGradesUser } from '@/services/api/gradesService'
import { fetchStudents } from '@/services/api/studentsService'
import UpdateStudent from '@/components/StudentManage/UpdateStudent.vue';
import RegisterStudent from '@/components/StudentManage/RegisterStudent.vue';
import AISetup from '@/components/faceRecog/AISetup.vue'

export default {
    name: 'Students',
    data() {
        return {
            dialog: false,
            storeX: useStore(),
            dailogDel: false,
            registerDialog: false,
            myClasses: [],
            currentClass: '',
            currentGradeId: -1,
            faceRecognition: false,
            headers: [
                { title: 'Legajo', key: 'school_number', align: 'start', width: '10%' },
                { title: 'DNI', key: 'dni', align: 'center' },
                { title: 'Apellido', key: 'last_name', align: 'center' },
                { title: 'Nombre', key: 'first_name', align: 'center' },
                { title: 'Reconocimiento', key: 'value', align: 'center' },
                { title: 'Editar', key: 'actions', sortable: false, align: 'end' },
            ],
            items: [],
            editedItem: {},
        }
    },
    mounted() {
        this.getGrades()
    },
    beforeCreate() {
        checkAuth([0, 1, 3])
    },
    setup() {
        const storeX = useStore()
        storeX.commit('setTitle', { title: 'Alumnos', icon: 'mdi-school' })
    },
    methods: {
        async getStudents() {
            const accessToken = store.get('accessToken');
            this.items = await fetchStudents(accessToken, this.currentGradeId)
        },
        async getGrades() {
            const accessToken = store.get('accessToken');
            const idUser = store.get('userId');

            const results = await ferchGradesUser(accessToken, idUser)
            this.myClasses = results.map(item => ({
                text: item.school_year + ' "' + item.school_section + '"',
                year: item.school_year,
                section: item.school_section,
                status: item.closed,
                value: item.id,
            }))
            this.currentClass = this.myClasses[0].text
            this.currentGradeId = this.myClasses[0].value
            this.getStudents()
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
                let result = await axiosExpressClient({
                    method: 'put',
                    timeout: 5000,
                    url: "/students/remove",
                    params: {
                        'accessToken': accessToken,
                        'idStud': this.deleteItemIdx,
                    }
                })
                if (result.status == 200) {
                    this.getStudents()
                    this.dailogDel = false
                }
            } catch (error) {
                console.log(error)
            }
        },
        enableFaceRecog(item) {
            this.faceRecognition = true
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.storeX.commit('setEditItem', { newEditedObj: this.editedItem })
        }, getBack() {
            this.faceRecognition = !this.faceRecognition
            this.getStudents()
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
