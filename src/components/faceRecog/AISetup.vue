<template>
    <v-card title="Reconocimiento Facial" subtitle="Control" prepend-icon="mdi-image">
        <template v-slot:append>
            <v-btn @click="getBack()" prepend-icon="mdi-arrow-left" color="primary">
                Regresar
            </v-btn>
        </template>
        <v-sheet class="fadeInCenter">
            <v-row>
                <v-col cols="4" class="ml-3">
                    <v-col>
                        <v-sheet style="border-bottom: solid 1px;" class="pa-2">
                            <v-row>
                                <v-col>
                                    ID:
                                </v-col>
                                <v-col>
                                    <v-chip style="float: right;">{{ student.id_stud }}</v-chip>
                                </v-col>
                            </v-row>
                        </v-sheet>
                        <v-sheet style="border-bottom: solid 1px;" class="pa-2">
                            <v-row>
                                <v-col>
                                    Estudiante:
                                </v-col>
                                <v-col>
                                    <v-chip style="float: right;">{{ student.last_name + ', ' + student.first_name
                                    }}</v-chip>
                                </v-col>
                            </v-row>
                        </v-sheet>
                        <v-sheet class="pa-2" style="border-bottom: solid 1px;">
                            <v-row>
                                <v-col>
                                    Estado Reconocimiento:
                                </v-col>
                                <v-col>
                                    <v-chip style="float: right;" :color="student.color">{{ student.value }}</v-chip>
                                </v-col>
                            </v-row>
                        </v-sheet>
                        <v-sheet style="border-bottom: solid 1px;" class="pa-2">
                            <v-row>
                                <v-col>
                                    Limpiar fotos:
                                </v-col>
                                <v-col>
                                    <v-chip v-if="student.recog != 0" prepend-icon="mdi-trash-can" color="primary"
                                        variant="tonal" @click="cleanPrevious()" style="cursor: pointer; float: right;">
                                        Limpiar
                                    </v-chip>
                                    <v-chip v-else color="warning" variant="tonal" style="float: right;">
                                        No Habilitado
                                    </v-chip>
                                </v-col>
                            </v-row>
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
                                <OpenCamera :getBack="getBack"/>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-sheet>
    </v-card>
</template>

<script>
import store from 'storejs';
import { useStore } from 'vuex'
import OpenCamera from './OpenCamera.vue';
import { deleteAi } from '@/services/api/studentsService';

export default {
    name: "AiSetup",
    props:{
        getBack: Function,
    },
    components: { OpenCamera },
    data: () => ({
        camera: false,
        student: useStore().state.editedObj,
    }),
    methods: {
        async cleanPrevious() {
            const accessToken = store.get('accessToken');
            await deleteAi(accessToken, this.student.id_stud)
            this.getBack()
        }
    }
}

</script>

<style></style>