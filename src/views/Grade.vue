<template>
    <BaseContainer>
        <v-dialog v-model="registerDialog" max-width="100vh">
            <v-card rounded="xl">
                <template v-slot:title>
                    <h1 style="color:rgb(var(--v-theme-primary));">
                        Registrar Curso
                    </h1>
                </template>
                <template v-slot:append>
                    <v-btn color="primary" @click="getGrades(); registerDialog = false" prepend-icon="mdi-keyboard-return"
                        class="mt-0 ma-2">
                        Regresar
                    </v-btn>
                </template>
                <RegisterGrade />
            </v-card>
        </v-dialog>
        <v-card title="Cursos" subtitle="Editar Cursos" color="surface-lighter-1" class="fadeInCenter pa-2">
            <template v-slot:append>
                <v-btn color="primary" @click="registerDialog = true" prepend-icon="mdi-plus" class="mt-0 ma-2">
                    Registrar Curso
                </v-btn>
            </template>
            <v-sheet>
                <v-data-table :headers="headers" :items="items" class="elevation-1 border-1" density="compact" hover>
                    <template v-slot:top>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="100vh" style="position: fixed; margin-left: auto;">
                            <v-card rounded="xl">
                                <template v-slot:title>
                                    <h1 style="color:rgb(var(--v-theme-secondary));">
                                        Modificar Curso
                                    </h1>
                                </template>
                                <template v-slot:append>
                                    <v-btn color="secondary" @click="getGrades(); dialog = false"
                                        prepend-icon="mdi-keyboard-return" class="mt-0 ma-2">
                                        Regresar
                                    </v-btn>
                                </template>
                                <UpdateGrade />
                            </v-card>
                        </v-dialog>
                        <v-dialog v-model="dailogDel" max-width="55vh" style="position: fixed; margin-left: auto;">
                            <v-card title="Estas seguro que quiere eliminar el curso?" subtitle="" prepend-icon="mdi-alert"
                                align="center" class="pb-4" rounded="xl">
                                <v-card-text style="font-style: italic; padding: 2px;">
                                    Esta accion eliminara los estudiantes dentro del curso.
                                </v-card-text>
                                <v-card-text style="font-style: italic; padding: 5px;">
                                    Desea continuear?
                                </v-card-text>
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
                        <v-icon size="small" class="me-2" @click="dailogDel = true; this.itemToDelete = item.raw">
                            mdi-trash-can
                        </v-icon>
                    </template>
                    <template v-slot:no-data>
                        <div class="noList">
                            No data
                        </div>
                    </template>
                    <template v-slot:item.user="{ item }">
                        <div v-if="item.value.id_user != null"> {{ item.value.user }}</div>
                        <div v-else class="noEmail"> Ningun preceptor asociado</div>
                    </template>
                </v-data-table>
            </v-sheet>
        </v-card>
    </BaseContainer>
</template>

<script>
import { ferchGrades, deleteGrade } from '@/services/api/gradesService'
import BaseContainer from '@/components/BaseContainer.vue';
import { checkAuth } from '@/services/api/admissionService';
import store from 'storejs';
import { useStore } from 'vuex'
import { VDataTable } from 'vuetify/labs/VDataTable'
import UpdateGrade from '@/components/ClassManage/UpdateGrade.vue';
import RegisterGrade from '@/components/ClassManage/RegisterGrade.vue';

export default {
    name: 'Attendances',
    data() {
        return {
            storeX: useStore(),
            dialog: false,
            registerDialog: false,
            dailogDel: false,
            itemToDelete: {},

            headers: [
                { title: 'Año', key: 'school_year', sortable: true, align: 'start', width: '5%' },
                { title: 'Seccion', key: 'school_section', align: 'center', width: '5%' },
                { title: 'Preceptor Asignado', key: 'user', align: 'center' },
                { title: 'Editar', key: 'actions', sortable: false, align: 'end' },
            ],
            items: [],
            editedItem: {},
        }
    },
    beforeCreate() {
        checkAuth([0, 2, 3])
    },
    setup() {
        const storeX = useStore()
        storeX.commit('setTitle', { title: 'Cursos', icon: 'mdi-google-classroom' })
    },
    mounted() {
        this.getGrades()
    },
    watch: {
        dialog(newVal) {
            this.getGrades()
        },
    },
    methods: {
        async getGrades() {
            const accessToken = store.get('accessToken');
            this.items = await ferchGrades(accessToken)
        },
        async editItem(item) {
            this.editedIndex = this.items.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.storeX.commit('setEditItem', { newEditedObj: this.editedItem })
            this.dialog = true
        },
        async deleteItem() {
            const accessToken = store.get('accessToken');
            if (await deleteGrade(accessToken, this.itemToDelete.id_grade)) {
                this.items.splice(this.items.indexOf(this.itemToDelete), 1)
                this.dailogDel = false
            }
            console.log(this.items)
        }
    },
    components: { BaseContainer, VDataTable, UpdateGrade, RegisterGrade }
}

</script>
<style>
.noEmail {
    color: rgb(var(--v-theme-warning));
}
</style>
