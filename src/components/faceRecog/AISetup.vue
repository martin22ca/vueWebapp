<template>
    <v-sheet class="fadeInCenter">
        <v-row>
            <v-col cols="4" class="ml-3">
                <v-col>
                    <v-sheet style="border-bottom: solid 1px;" class="pa-2">
                        ID: <v-chip>{{ student.id_stud }}</v-chip>
                    </v-sheet>
                    <v-sheet style="border-bottom: solid 1px;" class="pa-2">
                        Nombre: <v-chip>{{ student.first_name }}</v-chip>
                    </v-sheet>
                    <v-sheet style="border-bottom: solid 1px;" class="pa-2">
                        Apellido: <v-chip>{{ student.last_name }}</v-chip>
                    </v-sheet>
                    <v-sheet class="pa-2" style="border-bottom: solid 1px;">
                        Estado Reconocimiento:
                        <v-chip v-if="student.id_status != null" :color="this.recogStatus[student.id_status].color">
                            {{ this.recogStatus[student.id_status].text }}
                        </v-chip>
                        <v-chip v-else color="warning">
                            No Habilitado
                        </v-chip>
                    </v-sheet>
                    <v-sheet style="border-bottom: solid 1px;" class="pa-2">
                        Limpiar fotos:
                        <v-chip v-if="student.id_status != null" prepend-icon="mdi-trash-can" color="primary"
                            variant="tonal" @click="cleanPrevious()" style="cursor: pointer;">
                            Limpiar
                        </v-chip>
                        <v-chip v-else color="warning" variant="tonal">
                            No Habilitado
                        </v-chip>
                    </v-sheet>
                </v-col>
            </v-col>
            <v-col>
                <v-card variant="outlined" min-height="50vh" class="ma-2 pa-2">
                    <v-row>
                        <v-col v-if="!camera" align="center">
                            <v-btn @click="camera = true" color="primary" class="mt-6" clas>Habilitar Camara</v-btn>
                        </v-col>
                        <v-col v-else>
                            <OpenCamera />
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-sheet>
</template>

<script>
import store from 'storejs';
import { useStore } from 'vuex'
import OpenCamera from './OpenCamera.vue';
import { axiosExpressClient } from '@/plugins/axiosClient';

export default {
    name: "AiSetup",
    components: { OpenCamera },
    data: () => ({
        camera: false,
        student: useStore().state.editedObj,
        recogStatus: {
            1: { text: 'Error', color: 'error', info: 'Hubo un error en el sistema se deben registrar las fotos otra vez.' },
            2: { text: 'Trabajando', color: 'secondary', info: 'El sitema esta validando las fotos.' },
            3: { text: 'Activo', color: 'primary', info: 'El sitema ya registro las fotos en el sistema' },
        },
    }),
    mounted() {
        console.log(this.student)
    },
    methods: {
        async cleanPrevious() {
            const accessToken = store.get('accessToken');

            try {
                let result = await axiosExpressClient({
                    method: 'put',
                    timeout: 5000,
                    url: "/students/removeAi",
                    data: {
                        'accessToken': accessToken,
                        'idStud': this.student.id_stud,
                    }
                })
                if (result.status == 200) {
                    this.items = result.data.attendancesRows;
                    this.status = result.data.status;
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
}

</script>

<style></style>