<template>
    <form @submit.prevent="submit" class="registerClassContainer" style="margin-right: 20px;">
        <v-dialog v-model="dialog" width="auto">
            <v-card title="Informacion" prepend-icon="mdi-information-variant" style="font-size: large; min-width: 50vh;"
                align="start" rounded="true">
                <v-divider thickness="5"></v-divider>
                <v-card-text style="padding-left: 50px;">
                    <v-icon :icon="dialogSucces ? 'mdi-check' : 'mdi-alert-circle'"
                        :color="dialogSucces ? 'primary' : 'error'">
                    </v-icon> {{ dialogText }} </v-card-text>
                <v-card-item> <v-btn style="margin: 20px;" @click="dialog = false"> Ok</v-btn></v-card-item>
            </v-card>
        </v-dialog>
        <v-container class="ma-3 mr-10">
            <v-row>
                <v-col align-self="center">
                    <h1 style="color: rgb(var(--v-theme-primary))">Registrar Nuevo Curso</h1>
                </v-col>
            </v-row>
            <v-divider :thickness="7" class="pa-2"></v-divider>
            <div class="text"> Datos del curso </div>
            <v-row>
                <v-col align-self="center" cols="8">
                    <v-text-field class="pa-2" type="number" variant="outlined" v-model="year.value.value"
                        :error-messages="year.errorMessage.value" label="Año" @input="onYearInput"
                        prepend-inner-icon="mdi-card-account-details"></v-text-field>
                </v-col>
                <v-col align-self="center">
                    <v-text-field class="pa-2" variant="outlined" v-model="section.value.value"
                        :error-messages="section.errorMessage.value" label="Seccion"
                        prepend-inner-icon="mdi-card-account-details"></v-text-field>
                </v-col>
            </v-row>
            <div class="text"> Selecionar preceptor <strong> (opcional)</strong> </div>
            <v-row>
                <v-col align-self="center">
                    <v-select class="pa-2" clearable label="Preceptor" variant="outlined" :items="options"
                        v-model="select.value.value" :error-messages="select.errorMessage.value" item-title="text"
                        :maxlength="1" item-value="value" prepend-inner-icon="mdi-alert-circle"></v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col align-self="center">
                    <v-btn class="ma-2" type="submit">
                        Registrar
                    </v-btn>
                    <v-btn class="ma-2" @click="handleReset">
                        Limpiar
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </form>
</template>
  
<script>
;
import { useStore } from 'vuex'
import store from 'storejs';
import { ref } from 'vue'
import * as Yup from "yup";
import { axiosClient } from '@/plugins/axiosClient';
import { useField, useForm } from 'vee-validate'

export default {
    name: 'RegisterClass',
    data: () => ({
        visible: false,
        visibleC: false,
    }),
    setup() {
        const sotreX = useStore()
        const validationSchema = Yup.object().shape({
            year: Yup.number("Debe ser un Numero").typeError('Año Debe ser un Numero').required('Selecionar Año').positive("El Año debe ser positivo").integer(),
            section: Yup.string().required('La seccion es requerida').max(1, 'Solo un Caracter'),
            select: Yup.string().required('Select an item')
        });

        const { handleSubmit, handleReset, errors } = useForm({
            validationSchema,
            validateOnMount: false
        });

        const year = useField('year');
        const section = useField('section');
        const select = useField('select');
        const dialog = ref(false);
        const dialogSucces = ref(false)
        const dialogText = ref('');

        const options = ref([]);


        const onYearInput = (event) => {
            const input = event.target.value;
            const regex = /[^0-9]/g;
            const isValid = !regex.test(input);

            if (!isValid) {
                event.preventDefault();
                year.value.value = input.replace(regex, '');
            }
        }

        const fetchOptions = async () => {
            try {
                const accessToken = store.get('accessToken');
                const response = await axiosClient({
                    method: 'get',
                    timeout: 2000,
                    url: '/employees',
                    params: {
                        'accessToken': accessToken
                    }
                });
                options.value = response.data.employeesInfo.map(item => ({
                    text: item.first_name + " " + item.last_name,
                    value: item.id_emp,
                }));
            } catch (error) {
                console.log(error);
            }
        };

        fetchOptions();

        const submit = handleSubmit(async (values) => {
            const accessToken = store.get('accessToken');
            const upperSection = values.section.toUpperCase()

            try {
                let result = await axiosClient({
                    method: 'post',
                    timeout: 2000,
                    url: "/classes/register",
                    data: {
                        'accessToken': accessToken,
                        'year': values.year,
                        'section': upperSection,
                        'id_emp': values.select,
                    }
                });
                console.log(result);
                if (result.status == 200) {
                    console.log('success');
                    dialogText.value = result.data.message;
                    dialogSucces.value = true;
                    dialog.value = true;
                } else {
                    alert(JSON.stringify(result.status));
                }
            } catch (error) {
                console.log(error);
                if (error.response != undefined) { dialogText.value = 'Error del servidor'; }
                else {
                    dialogText.value = error.response.data.message;
                }
                dialogSucces.value = false
                dialog.value = true;
            }
        });

        return {
            year,
            section,
            select,
            options,
            dialog,
            dialogSucces,
            dialogText,
            onYearInput,
            submit,
            handleReset,
            errors
        };
    },

};

</script>
  
<style>
.gradient {
    height: 100vh;
    background: rgb(0, 0, 0);
    background: linear-gradient(190deg, rgba(0, 0, 0, 1) 80%, rgba(47, 47, 47, 1) 80%, rgb(173, 173, 173) 100%);
}

h1 {
    margin: 10px;
}

.registerClassContainer {
    background: rgb(var(--v-theme-surface-lighter-2));
    color: rgb(var(--v-theme-on-secondary));
}

.text {
    font-size: medium;
    font-weight: 300;
    padding-left: 10px;
}
</style>
  

