<template>
    <v-divider :thickness="7" class="pa-2"></v-divider>
    <v-sheet class="ma-2 pb-1">
        <v-row>
            <v-col cols=3 align="center">
                <h4> Imagen </h4>
                <img v-if="img_encoded != null" class="attImgEdit" v-bind:src="this.decodeImage(img_encoded)" />
                <img v-else class="attImgEdit" src="@/assets/Placeholder.png" />
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
                                        <v-text-field class="pl-2" v-model="lastName" readonly variant="outlined"
                                            prepend-inner-icon="mdi-card-account-details"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col align-self="center" cols="5">
                                <div class="text" style="padding-bottom: 10px;"> Hora llegada </div>
                                <v-row>
                                    <v-text-field class="pa-2" v-model="time_arrival.value.value"
                                        :error-messages="time_arrival.errorMessage.value" prepend-inner-icon="mdi-clock"
                                        type="time" variant="outlined"></v-text-field>
                                </v-row>
                            </v-col>
                            <v-col align-self="center">
                                <div class="text"> Presente </div>
                                <v-col style="display: flex;">
                                    <v-btn class="mb-4 pa-2 ml-4" variant="outlined"
                                        :icon="present.value.value ? 'mdi-check' : ''"
                                        @click="present.value.value = !present.value.value" rounded="lg"
                                        :color="present.value.value ? 'secondary' : ''" />
                                </v-col>
                            </v-col>
                            <v-col align-self="center">
                                <div class="text"> Tarde </div>
                                <v-btn class="mb-4 pa-2 ml-4" variant="outlined" :icon="late.value.value ? 'mdi-check' : ''"
                                    @click="late.value.value = !late.value.value; present.value.value = true; " rounded="lg"
                                    :color="late.value.value ? 'secondary' : ''" />
                            </v-col>
                            <v-col />
                        </v-row>
                        <v-row>
                            <v-col align="end" style="display: flex; align-self: end; justify-content: end;">
                                <v-btn class="ma-1" type="submit" variant="outlined" color="secondary">
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
import { axiosClient } from '@/plugins/axiosClient';
import { useField, useForm } from 'vee-validate'

export default {
    data: () => ({
        visible: false,
        visibleC: false,
    }),
    setup() {
        const storeX = useStore()
        const validationSchema = Yup.object().shape({
            time_arrival: Yup.string().required('La hora de llegada es Requerida'),
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
        const lastName = editedObj.last_name
        const img_encoded = editedObj.img_encoded
        const att_date = editedObj.att_date
        const time_arrival = useField('time_arrival');
        const present = useField('present');
        const late = useField('late');

        time_arrival.value.value = editedObj.time_arrival
        present.value.value = editedObj.present
        late.value.value = editedObj.late


        if (time_arrival.value.value == null) {
            let currDate = new Date();
            let hourMin = currDate.getHours() + ':' + currDate.getMinutes();
            time_arrival.value.value = hourMin
        }


        const dialog = ref(false);
        const dialogSucces = ref(false)
        const dialogText = ref('');

        const options = ref([]);

        const decodeImage = (encoded) => {
            return "data:image/jpg;base64," + encoded;
        };

        const submit = handleSubmit(async (values) => {
            const accessToken = store.get('accessToken');
            try {
                let response = await axiosClient({
                    method: 'put',
                    timeout: 2000,
                    url: "/attendance/update",
                    data: {
                        'accessToken': accessToken,
                        'id_att': id_att,
                        'id_stud': id_stud,
                        'att_date': att_date,
                        'time_arrival': values.time_arrival,
                        'present': values.present,
                        'late': values.late,
                    }
                });
                if (response.status == 200) {
                    console.log('success');
                    dialogText.value = response.data.message
                    dialog.value = true
                    dialogSucces.value = true

                } else {
                    alert(JSON.stringify(response.status));
                }
            } catch (error) {
                console.log(error);
                if (error.response != undefined)
                    dialogText.value = error.response.data.message;
                else {
                    dialogText.value = ' Error en la base de datos'
                }
                dialogSucces.value = false
                dialog.value = true;
            }
        });

        return {
            firstName,
            lastName,
            time_arrival,
            img_encoded,
            present,
            late,
            options,
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

.text {
    font-size: medium;
    font-weight: 300;
    padding-left: 10px;
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
  

