<template>
    <form @submit.prevent="submit" class="registerContainer" style="margin-right: 20px;">
        <v-container class="ma-3 mr-10">
            <v-row>
                <v-col align-self="center">
                    <h1>Registrar Nuevo Empleado</h1>
                </v-col>
            </v-row>
            <v-divider :thickness="7" class="pa-2"></v-divider>
            <div class="text"> Datos del curso </div>
            <v-row>
                <v-col align-self="center" cols="8">
                    <v-text-field class="pa-2" type="number" variant="outlined" v-model="year.value.value"
                        :error-messages="year.errorMessage.value" label="Año"
                        prepend-inner-icon="mdi-card-account-details"></v-text-field>
                </v-col>
                <v-col align-self="center">
                    <v-text-field class="pa-2" variant="outlined" v-model="section.value.value"
                        :error-messages="section.errorMessage.value" label="Seccion"
                        prepend-inner-icon="mdi-card-account-details"></v-text-field>
                </v-col>
            </v-row>
            <div class="text"> Selecionar preceptor </div>
            <v-row>
                <v-col align-self="center">
                    <v-select class="pa-2" clearable label="Rol" variant="outlined" :items="items"
                        v-model="select.value.value" :error-messages="select.errorMessage.value"
                        prepend-inner-icon="mdi-alert-circle"></v-select>
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

        const items = ref([
            {
                title: 'Admin',
                value: 2
            },
            {
                title: 'Preceptor',
                value: 1
            },
        ]);

        const submit = handleSubmit(async (values) => {
            try {
                let result = await axiosClient({
                    method: 'post',
                    timeout: 2000,
                    url: "/register",
                    data: {
                        'year': values.year,
                        'section': values.section,
                        'role': values.select,
                    }
                });
                console.log(result);
                if (result.status == 200) {
                    console.log('success');
                } else {
                    alert(JSON.stringify(result.status));
                }
            } catch (error) {
                console.log(error);
            }
        });

        return {
            year,
            section,
            select,
            items,
            submit,
            handleReset,
            errors
        };
    },

}

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

.registerContainer {
    border-radius: 10px;
    margin: auto;
    margin-bottom: 50px;
    bottom: 50%;
    background: rgb(var(--v-theme-surface-lighter-2));
    color: rgb(var(--v-theme-on-secondary));
}

.text {
    font-size: medium;
    font-weight: 300;
    padding-left: 10px;
}
</style>
  

