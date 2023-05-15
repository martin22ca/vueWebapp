<template>
    <v-sheet>
        <v-row>
            <v-col cols="3" class="ml-3">
                <v-col>
                    <v-sheet style="border-bottom: solid 1px;" class="pa-2">
                        ID: <v-chip>{{ editedObj.id_stud }}</v-chip>
                    </v-sheet>
                    <v-sheet style="border-bottom: solid 1px;" class="pa-2">
                        Nombre: <v-chip>{{ editedObj.first_name }}</v-chip>
                    </v-sheet>
                    <v-sheet style="border-bottom: solid 1px;" class="pa-2">
                        Apellido: <v-chip>{{ editedObj.last_name }}</v-chip>
                    </v-sheet>
                    <v-sheet class="pa-2">
                        Estado Reconocimiento:
                        <v-chip v-if="editedObj.status != null" :color="this.recogStatus[editedObj.status].color">
                            {{ this.recogStatus[editedObj.status].text }}
                        </v-chip>
                        <v-chip v-else color="warning">
                            No Habilitado
                        </v-chip>
                    </v-sheet>
                </v-col>
            </v-col>
            <v-col>
                <v-card variant="outlined" min-height="50vh" class="ma-2 pa-2">
                    <v-row>
                        <v-col>
                            <OpenCamera v-if="camera" />
                            <v-btn v-else @click="camera = true" color="primary">Habilitar Camara</v-btn>
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

export default {
    name: "AiSetup",
    components: { OpenCamera },
    data: () => ({
        camera: false,
        student: {},
        storeX: useStore(),
        recogStatus: {
            1: { text: 'Trabajando', color: 'secondary', info: 'El sitema esta validando las fotos.' },
            2: { text: 'Habilitado', color: 'primary', info: 'El sitema Ya registro las fotos en el sistema.' },
            3: { text: 'Error', color: 'error', info: 'Hubo un error en el sistema se deben registrar las fotos otra vez.' },
        },
    }),
    beforeCreate() {
        const storeX = useStore()
        this.editedObj = storeX.state.editedObj
        console.log(this.editedObj)
    },
    methods: {

    }
}

</script>

<style></style>