<template>
    <form @submit.prevent="submit" class="registerStudentContainer" style="margin-right: 20px;">
        <v-dialog v-model="dialog" width="auto">
            <v-card title="Informacion" prepend-icon="mdi-information-variant" style="font-size: large; min-width: 50vh;"
                align="start" rounded="true">
                <v-divider thickness="5"></v-divider>
                <v-card-text style="padding-left: 50px;"><v-icon :icon="dialogSucces ? 'mdi-check' : 'mdi-alert-circle'"
                        :color="dialogSucces ? 'secondary' : 'error'"> </v-icon> {{ dialogText }} </v-card-text>
                <v-card-item> <v-btn style="margin: 20px;" @click="dialog = false" variant="outlined" color="secondary">
                        Ok</v-btn></v-card-item>
            </v-card>
        </v-dialog>
        <v-container class="ma-3 mr-10">
            <v-divider :thickness="7" class="pa-2"></v-divider>
            <div class="text"> Legajo </div>
            <v-row>
                <v-col align-self="center">
                    <v-text-field class="pa-2" variant="outlined" v-model="ledger" label="Legajo" readonly
                        prepend-inner-icon="mdi-identifier"></v-text-field>
                </v-col>
            </v-row>
            <div class="text"> Nombre </div>
            <v-row>
                <v-col align-self="center" cols="8">
                    <v-text-field class="pa-2" variant="outlined" v-model="firstName.value.value"
                        :error-messages="firstName.errorMessage.value" label="Nombre"
                        prepend-inner-icon="mdi-card-account-details"></v-text-field>
                </v-col>
                <v-col align-self="center">
                    <v-text-field class="pa-2" variant="outlined" v-model="lastName.value.value"
                        :error-messages="lastName.errorMessage.value" label="Apellido"
                        prepend-inner-icon="mdi-card-account-details"></v-text-field>
                </v-col>
            </v-row>
            <div class="text"> Identificacion </div>
            <v-row>
                <v-col align-self="center" cols="5">
                    <v-text-field class="pa-2" variant="outlined" v-model="dni.value.value"
                        :error-messages="dni.errorMessage.value" label="DNI"
                        prepend-inner-icon="mdi-id-card"></v-text-field>
                </v-col>
                <v-row>
                    <v-col align-self="center" class="mr-3">
                        <v-text-field class="pa-2" variant="outlined" v-model="email.value.value"
                            :error-messages="email.errorMessage.value" label="E-mail (opcional)"
                            prepend-inner-icon="mdi-email"></v-text-field>
                    </v-col>
                </v-row>
            </v-row>
            <v-row>
                <v-col align-self="center">
                    <div class="text"> Curso </div>
                    <v-select class="pa-2" clearable label="Curso" variant="outlined" :items="items"
                        v-model="select.value.value" :error-messages="select.errorMessage.value" item-text="title"
                        item-value="id" item-title="title" prepend-inner-icon="mdi-alert-circle"></v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col align-self="center">
                    <v-btn class="ma-2" type="submit" variant="outlined" color="secondary">
                        Actualizar
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
import { useStore } from 'vuex'
import { ref, onMounted } from 'vue'
import * as Yup from "yup";
import { axiosExpressClient } from '@/plugins/axiosClient';
import { ferchGradesUser } from '@/services/api/gradesService'
import { updateStudent } from '@/services/api/studentsService'
import { useField, useForm } from 'vee-validate'

export default {
    data: () => ({
        visible: false,
        visibleC: false,
    }),
    setup() {
        const storeX = useStore()
        const validationSchema = Yup.object().shape({
            firstName: Yup.string().required('First name is required'),
            lastName: Yup.string().required('Last name is required'),
            dni: Yup.number().typeError('DNI debe ser un numero').required('DNI is required').test('len', 'El DNI debe contener al menos 8 digitos', val => (val.toString().length >= 8)),
            email: Yup.string().email('Email no valido').nullable(),
            select: Yup.string().required('Seleccionar Curso')
        });

        const { handleSubmit, handleReset, errors } = useForm({
            validationSchema,
            validateOnMount: false
        });
        const editedObj = storeX.state.editedObj
        const idStud = editedObj.id_stud
        const ledger = editedObj.school_number;
        const firstName = useField('firstName');
        const lastName = useField('lastName');
        const dni = useField('dni');
        const email = useField('email');
        const select = useField('select');

        firstName.value.value = editedObj.first_name
        lastName.value.value = editedObj.last_name
        email.value.value = editedObj.email
        dni.value.value = editedObj.dni
        select.value.value = editedObj.id_grade

        const dialog = ref(false);
        const dialogSucces = ref(false)
        const dialogText = ref('');

        const options = ref([]);

        const items = ref([]);

        const fetchOptions = async () => {
            const accessToken = store.get('accessToken');
            const idUser = store.get('userId');

            items.value = await ferchGradesUser(accessToken, idUser)
            console.log(editedObj)
        };

        const submit = handleSubmit(async (values) => {
            const accessToken = store.get('accessToken');

            const [result, error] = await updateStudent(accessToken, idStud, values)

            if (result) {
                dialogText.value = 'Estudiante Editado'
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
        onMounted(() => {
            fetchOptions();
        });

        return {
            ledger,
            firstName,
            lastName,
            dni,
            email,
            select,
            items,
            dialog,
            dialogText,
            dialogSucces,
            fetchOptions,
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

.registerStudentContainer {
    background: transparent
}

.text {
    font-size: medium;
    font-weight: 300;
    padding-left: 10px;
}
</style>
  

