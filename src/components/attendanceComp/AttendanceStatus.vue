<template>
    <v-dialog v-model="confirmation" max-width="50vh" >
        <v-card title="Informacion" prepend-icon="mdi-information-variant" style="font-size: large; min-width: 50vh;"
            align="start" rounded="xl">
            <v-divider thickness="5"></v-divider>
            <v-card-text style="padding-left: 50px;">
                <v-icon icon='mdi-alert-circle' />
                {{ dialogText }}
            </v-card-text>
            <v-card-item>
                <v-btn style="margin: 20px;" @click="closeThisattendances" variant="outlined" color="secondary">
                    Si
                </v-btn>
                <v-btn style="margin: 20px;" @click="confirmation = false" variant="outlined" color="secondary">
                    NO
                </v-btn>
            </v-card-item>
        </v-card>
    </v-dialog>
    <v-card rounded="xl" style="overflow-y: hidden;" min-height="20vh">
        <template v-slot:title>
            <h1 style="color:rgb(var(--v-theme-primary)); overflow-y: hidden; font-family: 'Raleway', Helvetica, Arial;">
                Estado actual
            </h1>
        </template>
        <template v-slot:append>
            <v-btn color="primary" @click="closeDialog()" prepend-icon="mdi-keyboard-return" class="mt-2 ma-2">
                Regresar
            </v-btn>
        </template>
        <v-divider :thickness="7" class="pa-2"></v-divider>
        <v-sheet class="pl-8 pr-8 pt-2 pb-2">
            <v-row>
                <v-col cols="auto">
                    <div style="display: flex;flex-direction: column;">
                        <v-sheet>
                            <v-row justify="end">
                                <v-col cols="auto" class="pa-2">
                                    <div class="textStatus">
                                        Curso:
                                    </div>
                                </v-col>
                                <v-col class="pa-0">
                                    <v-chip class="mt-1" color="primary" variant="outlined" size="x-large"
                                        style="float: right">
                                        <div class="textStatus">{{ title }}</div>
                                    </v-chip>
                                </v-col>
                            </v-row>
                            <v-row justify="end">
                                <v-col cols="auto" class="pa-2">
                                    <div class="textStatus">
                                        Dia:
                                    </div>
                                </v-col>
                                <v-col class="pa-0" aling="end">
                                    <v-chip class="mt-1" color="primary" variant="outlined" size="x-large"
                                        style="float: right">
                                        <div class="textStatus">{{ rollCall.att_date.split('T')[0] }} </div>
                                    </v-chip>
                                </v-col>
                            </v-row>
                            <v-row justify="end">
                                <v-col cols="auto" class="pa-2">
                                    <div class="textStatus">
                                        Estado:
                                    </div>
                                </v-col>
                                <v-col class="pa-0">
                                    <v-chip class="mt-1" :color="rollCall.status ? 'primary' : 'secondary'"
                                        variant="outlined" size="x-large" style="float: right">
                                        <div class="textStatus">
                                            {{ rollCall.status ? "ABIERTO" : "CERRADO" }}
                                        </div>
                                    </v-chip>
                                </v-col>
                            </v-row>
                            <v-row justify="end" v-if="!rollCall.status">
                                <v-col cols="auto" class="pa-2">
                                    <div class="textStatus">
                                        Hora cierre:
                                    </div>
                                </v-col>
                                <v-col class="pa-0">
                                    <v-chip class="mt-1" color='secondary' variant="outlined" size="x-large"
                                        style="float: right">
                                        <div class="textStatus">
                                            {{ rollCall.close_time }}
                                        </div>
                                    </v-chip>
                                </v-col>
                            </v-row>
                        </v-sheet>
                    </div>
                </v-col>
                <v-col class="ma-2 pa-2 pt-0 mt-0">
                    <div class="textStatus">
                        Observacion
                    </div>
                    <v-textarea v-model="observation" :readonly="(!readAble || !rollCall.status)"
                        prepend-inner-icon="mdi-text-long" type="text" variant="outlined" counter rows="7">
                        <template v-slot:append-inner>
                            <v-btn icon="mdi-pencil" variant="outlined" rounded="lg" @click="readAble = !readAble"
                                :color="readAble && rollCall.status ? 'secondary' : ''" :active="rollCall.status" />
                        </template>
                    </v-textarea>
                </v-col>
            </v-row>
            <v-row class="mt-0">
                <v-col class="pt-0">
                    <v-btn v-if="rollCall.status" style="float: right;" color="primary" class="ma-2 mt-0"
                        @click="areYouSure()">
                        Cerrar Asistencias
                    </v-btn>
                </v-col>
            </v-row>
        </v-sheet>
    </v-card>
</template>

<script>
import { closeAttendance } from '@/services/api/attendancesService'
import store from 'storejs';
export default {
    data: () => ({
        readAble: false,
        confirmation: false,
        dialogText: ' ',
        observation: '',
    }),
    props: {
        rollCall: Object,
        title: String,
        close: Function // Define editDialog as a prop of type Boolean
    },
    methods: {
        closeDialog() {
            this.close(2);
        },
        async setObser() {
            this.observation = this.rollCall.observation
            console.log(this.rollCall)
        },
        areYouSure() {
            this.confirmation = true
            this.dialogText = 'Estas seguro que quiere cerrar las asistencias?'
        },
        async closeThisattendances() {
            const accessToken = store.get('accessToken');
            const idUser = store.get('userId')
            this.roll = await closeAttendance(accessToken, this.rollCall.id, idUser, this.observation)
            this.close()
        }
    },
    mounted() {
        this.setObser()
    },
}
</script>

<style>
.textStatus {
    font-family: "Raleway", Helvetica, Arial;
    color: rgb(var(--v-theme-on-surface));
    margin: 5px;
    font-size: 18px;
}
</style>