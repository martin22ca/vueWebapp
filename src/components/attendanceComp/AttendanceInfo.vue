<template>
    <div style="height: 90vh; width: 90vh%;">
        <v-card rounded="xl" style="padding-top: 0;" class="textCheck">
            <template v-slot:title>
                <h1 style="color:rgb(var(--v-theme-secondary)); overflow-y: hidden;">
                    Asistencia
                </h1>
                <h2 style="padding-left: 10px;">
                    Estado Curso:
                    <v-chip :color="rollCall.status ? 'secondary' : 'error'" variant="elevated" size="large"
                        append-icon="mdi-information" @click="statusDialog = true">
                        {{ rollCall.status ? "ABIERTO" : "CERRADO" }}
                    </v-chip>
                </h2>
            </template>
            <template v-slot:append>
                <v-btn color="secondary" @click="closeDialog()" prepend-icon="mdi-keyboard-return" class="mt-2 ma-2">
                    Regresar
                </v-btn>
            </template>
            <v-divider :thickness="7" class="pa-2"></v-divider>
            <v-sheet class="ma-2 pb-1">
                <v-row>
                    <v-col cols=3 align="center">
                        <img v-if="img_encoded != null" class="attImgEdit" v-bind:src="this.decodeImage(img_encoded)" />
                        <img v-else class="attImgEdit" src="@/assets/Placeholder.png" />
                        <v-text-field class="pa-2" v-model="school_number" variant="outlined" label="Legajo"
                            prepend-inner-icon="mdi-identifier" readonly></v-text-field>
                        <v-text-field class="pa-2" v-model="certainty" variant="outlined" prepend-inner-icon="mdi-percent"
                            label="Certeza" readonly />
                    </v-col>
                    <v-col style="overflow-y: hidden;">
                        <form @submit.prevent="submit" style="margin-right: 20px;">
                            <v-dialog v-model="dialog" width="auto">
                                <v-card title="Informacion" prepend-icon="mdi-information-variant"
                                    style="font-size: large; min-width: 50vh;" align="start" rounded="true">
                                    <v-divider thickness="5"></v-divider>
                                    <v-card-text style="padding-left: 50px;"><v-icon
                                            :icon="dialogSucces ? 'mdi-check' : 'mdi-alert-circle'"
                                            :color="dialogSucces ? 'secondary' : 'error'"> </v-icon> {{ dialogText }}
                                    </v-card-text>
                                    <v-card-item>
                                        <v-btn style="margin: 20px;" @click="dialog = false" variant="outlined"
                                            color="secondary">Ok
                                        </v-btn>
                                    </v-card-item>
                                </v-card>
                            </v-dialog>
                            <v-container>
                                <v-row>
                                    <v-col align-self="center" cols="7">
                                        <v-row>
                                            <v-col>
                                                <v-text-field class="pa-0 " v-model="firstName" variant="outlined"
                                                    label="Nombre" prepend-inner-icon="mdi-card-account-details"
                                                    readonly></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col align-self="center">
                                        <v-row>
                                            <v-col style="display: flex;">
                                                <v-text-field v-model="lastName" readonly variant="outlined"
                                                    label="Apellido"
                                                    prepend-inner-icon="mdi-card-account-details"></v-text-field>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col align-self="center" cols="5">
                                        <v-row>
                                            <v-text-field class="pa-2" v-model="arrival.value.value" label="Hora llegada"
                                                :readonly="!rollCall.status" :error-messages="arrival.errorMessage.value"
                                                prepend-inner-icon="mdi-clock" type="time" variant="outlined" />
                                        </v-row>
                                    </v-col>
                                    <v-col align-self="center" cols="3">
                                        <v-row>
                                            <v-text-field class="pa-2" v-model="module_number" label="Modulo IA"
                                                prepend-inner-icon="mdi-domain" readonly variant="outlined"></v-text-field>
                                        </v-row>
                                    </v-col>
                                    <v-col align-self="center" cols="auto">
                                        <v-checkbox label="Presente" v-model="present.value.value"
                                            @click="manageAtte(!present.value.value, late.value.value, rollCall.status)"
                                            rounded="lg" :color="present.value.value ? 'secondary' : ''"
                                            :active="!rollCall.status" />
                                    </v-col>
                                    <v-col align-self="center" cols="auto">
                                        <v-checkbox label="Tarde" v-model="late.value.value"
                                            @click="manageAtte(present.value.value, !late.value.value, rollCall.status)"
                                            rounded="lg" :color="late.value.value ? 'secondary' : ''"
                                            :active="!rollCall.status" />
                                    </v-col>
                                    <v-col />
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-textarea v-model="observation.value.value" :readonly="!readAble"
                                            :error-messages="observation.errorMessage.value" label="Observacion (Opcional)"
                                            prepend-inner-icon="mdi-text-long" type="text" variant="outlined" counter>
                                            <template v-slot:append-inner>
                                                <v-btn icon="mdi-pencil" variant="outlined" rounded="lg"
                                                    @click=" obsStatus(!readAble, rollCall.status)"
                                                    :color="readAble ? 'secondary' : ''" />
                                            </template>
                                        </v-textarea>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <v-btn class="ma-1" type="submit" @click="submit()" variant="outlined" color="secondary" style="float: right;">
                                Actualizar
                            </v-btn>
                        </form>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-card>
    </div>
</template>
  
<script>
import store from 'storejs';
import { useStore } from 'vuex'
import { ref } from 'vue'
import * as Yup from "yup";
import { updateAttendance } from '@/services/api/attendancesService'
import { useField, useForm } from 'vee-validate'

export default {
    props: {
        close: Function,
        rollCall: Object,
    },
    methods: {
        closeDialog() {
            this.close(1);
        },
    },
    setup() {
        const storeX = useStore()
        const validationSchema = Yup.object().shape({
            observation: Yup.string('NO').nullable('No'),
            arrival: Yup.string().required('La hora de llegada es Requerida'),
            present: Yup.bool(),
            late: Yup.bool(),
        });

        const { handleSubmit, handleReset, errors } = useForm({
            validationSchema,
            validateOnMount: false
        });
        const editedObj = storeX.state.editedObj

        const id_att = editedObj.id_att
        const firstName = editedObj.first_name
        const school_number = editedObj.school_number
        const lastName = editedObj.last_name
        const img_encoded = editedObj.img_encoded
        let module_number = editedObj.module_number
        let certainty = editedObj.certainty
        const readAble = ref(false);
        const arrival = useField('arrival');
        const present = useField('present');
        const observation = useField('observation');
        const late = useField('late');

        arrival.value.value = editedObj.arrival
        present.value.value = editedObj.present
        late.value.value = editedObj.late
        observation.value.value = editedObj.observation

        if (certainty == null) certainty = 'No Detectado'
        else if (certainty == 0) certainty = 'Asistencia Manual'

        if (module_number == null) module_number = 'No Modulo'

        if (arrival.value.value == null) {
            let currDate = new Date();
            let hourMin = currDate.getHours() + ':' + currDate.getMinutes();
            arrival.value.value = hourMin
        }

        const dialog = ref(false);
        const dialogSucces = ref(false)
        const dialogText = ref('');

        const manageAtte = (newPresent, newLate, status) => {
            if (status) {
                if (!present.value.value && newLate) {
                    present.value.value = true
                }
                else {
                    present.value.value = newPresent;
                }
                late.value.value = newLate
            }
        }
        const obsStatus = (read, status) => {
            if (status) {
                readAble.value = read
            }
        };

        const decodeImage = (encoded) => {
            return "data:image/jpg;base64," + encoded;
        };

        const submit = handleSubmit(async (values) => {
            const accessToken = store.get('accessToken');
            console.log('a')
            const [result, error] = await updateAttendance(accessToken, id_att, values.arrival, values.present, values.late, values.observation)
            if (result) {
                dialogText.value = 'Asistencia registrada'
                dialog.value = true
                dialogSucces.value = true
            } else {
                if (error.message != undefined)
                    dialogText.value = error.message;
                else {
                    dialogText.value = ' Error en la base de datos'
                }
                dialogSucces.value = false
                dialog.value = true;
            }
        });

        return {
            school_number,
            firstName,
            lastName,
            arrival,
            readAble,
            img_encoded,
            module_number,
            observation,
            certainty,
            present,
            late,
            dialog,
            dialogText,
            dialogSucces,
            obsStatus,
            manageAtte,
            decodeImage,
            submit,
            handleReset,
            errors
        };
    },

}
</script>
  
<style>
h1 {
    margin: 10px;
}

.textCheck {
    font-family: "Raleway", Helvetica, Arial;
    font-size: medium;
    font-weight: 400;
    padding-left: 10px;
    margin-bottom: 12px;
}

.attImgEdit {
    position: relative;
    border-radius: 8px;
    margin-bottom: 5px;
    padding: 5px;
    border: solid 1px;
    width: 100%;
    max-width: 200px;
    z-index: 1;
    transition: transform .2s;
}
</style>
  

