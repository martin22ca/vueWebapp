<template>
    <v-dialog v-model="registerDialog" max-width="100vh">
        <RegisterClasses />
    </v-dialog>
    <v-card title="Cursos" subtitle="Editar Cursos" color="surface-lighter-1" class="ma-2 mr-5">
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
                        <template v-if="dialog">
                            <update-classes />
                        </template>
                    </v-dialog>
                    <v-dialog v-model="dailogDel" max-width="55vh" style="position: fixed; margin-left: auto;">
                        <v-card title="Estas seguro que quiere eliminar el curso?" subtitle=""
                            prepend-icon="mdi-alert" align="center" class="pb-4">
                            <v-card-text style="font-style: italic; padding: 2px;">
                                Esta accion eliminara los estudiantes dentro del curso. 
                            </v-card-text>
                            <v-card-text style="font-style: italic; padding: 5px;">
                                Desea continuear?
                            </v-card-text>
                            <v-card-item class="pb-4">
                                <v-btn class="ma-2" variant="tonal" @click="dailogDel = false" color="grey">Cancelar</v-btn>
                                <v-btn class="ma-2" variant="tonal" @click="deleteItem()" color="error">Eliminar</v-btn>
                            </v-card-item>

                        </v-card>
                    </v-dialog>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon size="small" class="me-2" @click="editItem(item.raw)">
                        mdi-pencil
                    </v-icon>
                    <v-icon size="small" class="me-2" @click="dailogDel = true; this.deleteItemIdx = item.value.id_cls">
                        mdi-trash-can
                    </v-icon>
                </template>
                <template v-slot:no-data>
                    <div class="noList">
                        No data
                    </div>
                </template>
                <template v-slot:item.preceptor=" { item } ">
                    <div v-if=" item.value.preceptor != null "> {{ item.value.preceptor }}</div>
                    <div v-else class="noEmail"> Ningun preceptor asociado</div>
                </template>
            </v-data-table>
        </v-sheet>
    </v-card>
</template>

<script>
import store from 'storejs';
import { useStore } from 'vuex'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { axiosClient } from '@/plugins/axiosClient';
import UpdateClasses from './UpdateClasses.vue';
import RegisterClasses from './RegisterClasses.vue';

export default {
    name: 'Attendances',
    data() {
        return {
            storeX: useStore(),
            dialog: false,
            registerDialog: false,
            dailogDel: false,
            deleteItemIdx: -1,

            headers: [
                { title: 'id', key: 'id_cls', align: 'start', width: '3%' },
                { title: 'Año', key: 'school_year', sortable: true, align: 'center', width: '10%' },
                { title: 'Seccion', key: 'school_section', align: 'center' },
                { title: 'Preceptor Asignado', key: 'preceptor', align: 'center' },
                { title: 'Editar', key: 'actions', sortable: false, align: 'end' },
            ],
            items: [],
            editedItem: {},
        }
    },
    mounted() {
        this.fetchClasses()
    },
    watch: {
        dialog(newVal) {
            this.fetchClasses()
        },
    },
    methods: {
        async fetchClasses() {
            const accessToken = store.get('accessToken');

            try {
                let result = await axiosClient({
                    method: 'get',
                    timeout: 5000,
                    url: "/classes/person",
                    params: {
                        'accessToken': accessToken,
                    }
                })
                if (result.status == 200) {

                    this.items = result.data.schoolClasses
                }
            } catch (error) {
                console.log(error)
            }
        },
        async editItem(item) {

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
                    url: "/classes/remove",
                    params: {
                        'accessToken': accessToken,
                        'idClass': this.deleteItemIdx,
                    }
                })
                if (result.status == 200) {
                    this.fetchClasses()
                    this.dailogDel = false
                }
            } catch (error) {
                console.log(error)
            }
        }
    },
    components: { VDataTable, UpdateClasses, RegisterClasses }
}

</script>
<style>
.noEmail {
    color: rgb(var(--v-theme-warning));
}
</style>
