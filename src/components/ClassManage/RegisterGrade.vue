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
                <v-card-item>
                    <v-btn style="margin: 20px;" @click="dialog = false" color="primary" variant="outlined">
                        Ok
                    </v-btn>
                </v-card-item>
            </v-card>
        </v-dialog>
        <v-container class="ma-3 mr-10">
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
            <div class="text">  Selecionar preceptor/es <strong> (opcional)</strong> </div>
            <v-row>
                <v-col align-self="center">
                    <v-select class="pa-2" clearable label="Preceptor" variant="outlined" :items="items"
                        v-model="select.value.value" :error-messages="select.errorMessage.value" item-text="title"
                        item-value="id_user" item-title="title" prepend-inner-icon="mdi-alert-circle" multiple></v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col align-self="center">
                    <v-btn class="ma-2" type="submit" variant="outlined" color="primary">
                        Registrar
                    </v-btn>
                    <v-btn class="ma-2" @click="handleReset" variant="tonal">
                        Limpiar
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </form>
</template>
  
<script>
import store from 'storejs';
import { ref, onMounted } from 'vue'
import * as Yup from "yup";
import { registerGrade } from '@/services/api/gradesService'
import { fetchUsersRole } from '@/services/api/usersService'
import { useField, useForm } from 'vee-validate'

export default {
    name: 'RegisterGrade',
    data: () => ({
        visible: false,
        visibleC: false,
    }),
    setup() {
        const validationSchema = Yup.object().shape({
            year: Yup.number("Debe ser un Numero").typeError('Año Debe ser un Numero').required('Selecionar Año').positive("El Año debe ser positivo").integer(),
            section: Yup.string().required('La seccion es requerida').max(1, 'Solo un Caracter'),
            select: Yup.array().nullable(),
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

        const items = ref([]);


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
            const accessToken = store.get('accessToken');
            items.value = await fetchUsersRole(accessToken, 3)
            console.log(items.value)
        };

        const submit = handleSubmit(async (values) => {
            const accessToken = store.get('accessToken');
            const upperSection = values.section.toUpperCase()

            const [result, error] = await registerGrade(accessToken, values.year, upperSection, values.select)

            if (result) {
                dialogText.value = 'Curso creado Exitosamente'
                dialog.value = true
                dialogSucces.value = true

            } else {
                if (error.message != undefined)
                    dialogText.value = error.message;
                else {
                    dialogText.value = 'Error en la base de datos'
                }
                dialogSucces.value = false
                dialog.value = true;
            }
        });
        onMounted(() => {
            fetchOptions();
        });

        return {
            year,
            section,
            select,
            items,
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
    background: transparent;
}

.text {
    font-size: medium;
    font-weight: 300;
    padding-left: 10px;
}
</style>
  

