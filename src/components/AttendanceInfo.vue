<template>
    <v-divider :thickness="7" class="pa-2"></v-divider>
    <v-sheet class="ma-2 pb-1">
        <v-row>
            <v-col cols=3 align="center">
                <h4> Imagen </h4>
                <img v-if="img_encoded != null" class="attImgEdit" v-bind:src="this.decodeImage(img_encoded)" />
                <img v-else class="attImgEdit" src="@/assets/Placeholder.png" />
                <div style="text-align: start; padding-left: 20px;"> Certeza</div>
                <v-text-field class="pa-4" v-model="certainty" variant="outlined" prepend-inner-icon="mdi-percent"
                    readonly />
            </v-col>
            <v-col style="overflow-y: hidden;">
                <form @submit.prevent="submit" style="margin-right: 20px;">
                    <v-dialog v-model="dialog" width="auto">
                        <v-card title="Informacion" prepend-icon="mdi-information-variant"
                            style="font-size: large; min-width: 50vh;" align="start" rounded="true">
                            <v-divider thickness="5"></v-divider>
                            <v-card-text style="padding-left: 50px;"><v-icon
                                    :icon="dialogSucces ? 'mdi-check' : 'mdi-alert-circle'"
                                    :color="dialogSucces ? 'secondary' : 'error'"> </v-icon> {{ dialogText }} </v-card-text>
                            <v-card-item>
                                <v-btn style="margin: 20px;" @click="dialog = false" variant="outlined" color="secondary">Ok
                                </v-btn>
                            </v-card-item>
                        </v-card>
                    </v-dialog>
                    <v-container class="ma-3 mr-10">
                        <v-row>
                            <v-col align-self="center">
                                <div class="text"> Legajo </div>
                                <v-row>
                                    <v-col style="display: flex;">
                                        <v-text-field class="pa-0" v-model="school_number" variant="outlined"
                                            prepend-inner-icon="mdi-identifier" readonly></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col align-self="center" cols="7">
                                <div class="text"> Nombre </div>
                                <v-row>
                                    <v-col style="display: flex;">
                                        <v-text-field class="pa-0" v-model="firstName" variant="outlined"
                                            prepend-inner-icon="mdi-card-account-details" readonly></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col align-self="center">
                                <div class="text"> Apellido </div>
                                <v-row>
                                    <v-col style="display: flex;">
                                        <v-text-field v-model="lastName" readonly variant="outlined"
                                            prepend-inner-icon="mdi-card-account-details"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col align-self="center" cols="5">
                                <div class="text" style="padding-bottom: 10px;"> Hora llegada </div>
                                <v-row>
                                    <v-text-field class="pa-2" v-model="arrival.value.value"
                                        :error-messages="arrival.errorMessage.value" prepend-inner-icon="mdi-clock"
                                        type="time" variant="outlined"></v-text-field>
                                </v-row>
                            </v-col>
                            <v-col align-self="center" cols="3">
                                <div class="text" style="padding-bottom: 10px;"> Modulo IA</div>
                                <v-row>
                                    <v-text-field class="pa-2" v-model="module_number" prepend-inner-icon="mdi-domain"
                                        readonly variant="outlined"></v-text-field>
                                </v-row>
                            </v-col>
                            <v-col align-self="center" cols="auto">
                                <div class="text textCheck"> Presente </div>
                                <v-btn class="mb-4 pa-2 ml-4" variant="outlined"
                                    :icon="present.value.value ? 'mdi-check' : ''"
                                    @click="present.value.value = !present.value.value" rounded="lg"
                                    :color="present.value.value ? 'secondary' : ''" />
                            </v-col>
                            <v-col align-self="center" cols="auto">
                                <div class=" text textCheck"> Tarde </div>
                                <v-btn class="mb-4 pa-2 ml-4" variant="outlined" :icon="late.value.value ? 'mdi-check' : ''"
                                    @click="late.value.value = !late.value.value; present.value.value = true;" rounded="lg"
                                    :color="late.value.value ? 'secondary' : ''" />
                            </v-col>
                            <v-col />
                        </v-row>
                        <v-row>
                            <v-col>
                                <div class="text"> Observacion <strong>(Opcional)</strong></div>
                                <v-textarea v-model="observation.value.value" :readonly="!readAble"
                                    :error-messages="observation.errorMessage.value" prepend-inner-icon="mdi-text-long"
                                    type="text" variant="outlined" counter>
                                    <template v-slot:append-inner>
                                        <v-btn icon="mdi-pencil" variant="outlined" rounded="lg"
                                            @click="readAble = !readAble" :color="readAble ? 'secondary' : ''" />
                                    </template>
                                </v-textarea>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col align="end" style="display: flex; align-self: end; justify-content: end;">
                                <v-btn class="ma-1" type="submit" @click="submit()" variant="outlined" color="secondary">
                                    Actualizar
                                </v-btn>
                                <v-btn class="ma-1" @click="handleReset" variant="tonal">
                                    Limpiar
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </form>
            </v-col>
        </v-row>
    </v-sheet>
</template>
  
<script>
import store from 'storejs';
import { useStore } from 'vuex'
import { ref } from 'vue'
import * as Yup from "yup";
import { updateAttendance } from '@/services/api/attendancesService'
import { useField, useForm } from 'vee-validate'

export default {
    data: () => ({
        readAble: false,
    }),
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
        const id_stud = editedObj.id_stud
        const firstName = editedObj.first_name
        const school_number = editedObj.school_number
        const lastName = editedObj.last_name
        const img_encoded = editedObj.img_encoded
        const att_date = editedObj.att_date
        let module_number = editedObj.module_number
        let certainty = editedObj.certainty
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

        if (module_number == null) module_number = 'No Detectado'

        if (arrival.value.value == null) {
            let currDate = new Date();
            let hourMin = currDate.getHours() + ':' + currDate.getMinutes();
            arrival.value.value = hourMin
        }

        const dialog = ref(false);
        const dialogSucces = ref(false)
        const dialogText = ref('');

        const decodeImage = (encoded) => {
            return "data:image/jpg;base64," + encoded;
        };

        const submit = handleSubmit(async (values) => {
            const accessToken = store.get('accessToken');
            console.log('a')
            const [result, error] = await updateAttendance(accessToken, id_att, id_stud, att_date, values.arrival, values.present, values.late, values.observation)
            if (result) {
                dialogText.value = 'asistencia registrada'
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
            img_encoded,
            module_number,
            observation,
            certainty,
            present,
            late,
            dialog,
            dialogText,
            dialogSucces,
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
    font-size: medium;
    font-weight: 300;
    padding-left: 10px;
    margin-bottom: 12px;
}

.attImgEdit {
    position: relative;
    border-radius: 8px;
    margin: 10%;
    padding: 5px;
    border: solid 1px;
    width: 100%;
    max-width: 200px;
    z-index: 1;
    transition: transform .2s;
}
</style>
  

