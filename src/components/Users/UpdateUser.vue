<template>
    <form @submit.prevent="submit" class="updateContainer">
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
            <v-row>
                <v-col>
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
                    <div class="text"> DNI </div>
                    <v-row>
                        <v-col align-self="center">
                            <v-text-field class="pa-2" variant="outlined" v-model="dni.value.value"
                                :error-messages="dni.errorMessage.value" label="DNI"
                                prepend-inner-icon="mdi-id-card"></v-text-field>
                        </v-col>
                    </v-row>
                    <div class="text">Email</div>
                    <v-row>
                        <v-col align-self="center">
                            <v-text-field class="pa-2" variant="outlined" v-model="email.value.value"
                                :error-messages="email.errorMessage.value" label="E-mail (opcional)"
                                prepend-inner-icon="mdi-email"></v-text-field>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col>
                    <v-row>
                        <v-col align-self="center">
                            <div class="text">Cambiar Rol </div>
                            <v-select class="pa-2" clearable label="Rol" variant="outlined" :items="items"
                                v-model="select.value.value" :error-messages="select.errorMessage.value" item-text="title"
                                item-value="id" prepend-inner-icon="mdi-alert-circle"
                                @click:prepend-inner="log()"></v-select>
                        </v-col>
                    </v-row>
                    <div class="text">Identificacion</div>
                    <v-row>
                        <v-col align-self="center">
                            <v-text-field class="pa-2" variant="outlined" v-model="username.value.value" autocomplete="off"
                                :error-messages="username.errorMessage.value" prepend-inner-icon="mdi-account"
                                hint=" El nombre de usuario debe tener al menos 4 digitos"
                                label="Nombre de usuario"></v-text-field>
                        </v-col>
                    </v-row>
                    <div class="text"> Modificar Contraseña </div>
                    <v-row>
                        <v-col align-self="center">
                            <v-text-field class="pa-2" variant="outlined" v-model="password.value.value"
                                :error-messages="password.errorMessage.value" label="Contraseña" autocomplete="off"
                                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                                prepend-inner-icon="mdi-lock-outline" :type="visible ? 'text' : 'password'"
                                @click:append-inner="visible = !visible"></v-text-field>
                        </v-col>
                        <v-col align-self="center">
                            <v-text-field class="pa-2" variant="outlined" v-model="passwordConfirmation.value.value"
                                :error-messages="passwordConfirmation.errorMessage.value" label="Confirmar Contraseña"
                                :append-inner-icon="visibleC ? 'mdi-eye-off' : 'mdi-eye'"
                                prepend-inner-icon="mdi-lock-outline" :type="visibleC ? 'text' : 'password'"
                                @click:append-inner="visibleC = !visibleC"></v-text-field>
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
                </v-col>
            </v-row>
        </v-container>
    </form>
</template>
  
<script>
import { ref, onMounted } from 'vue'
import store from 'storejs';
import { useStore } from 'vuex'
import * as Yup from "yup";
import { fetchRoles } from '@/services/api/rolesService'
import { updateUser } from '@/services/api/usersService'
import { useField, useForm } from 'vee-validate'

export default {
    name: "UpdateUser",
    data: () => ({
        visible: false,
        visibleC: false,
    }),
    setup() {
        const storeX = useStore();
        const validationSchema = Yup.object().shape({
            firstName: Yup.string().required('First name is required'),
            lastName: Yup.string().required('Last name is required'),
            dni: Yup.number().typeError('DNI debe ser un numero').required('DNI is required').test('len', 'El DNI debe contener al menos 8 digitos', val => (val.toString().length >= 8)),
            email: Yup.string().email('Email no valido').nullable(),
            username: Yup.string().required('El Username es requerido').min(4, 'El Username debe contener al menos 4 digitos'),
            password: Yup.string().min(8, 'L contraseña debe contener al menos 8 digitos').matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, 'Debe tener al menos una Mayuscula, una Minuscula y un numero'),
            passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden'),
            select: Yup.string().required('Seleccionar rol')
        });

        const { handleSubmit, handleReset, errors } = useForm({
            validationSchema,
            validateOnMount: false
        });

        const editedObj = storeX.state.editedObj
        const idUser = editedObj.id_user
        const firstName = useField('firstName');
        const lastName = useField('lastName');
        const dni = useField('dni');
        const email = useField('email');
        const username = useField('username');
        const password = useField('password');
        const passwordConfirmation = useField('passwordConfirmation');
        const select = useField('select');


        firstName.value.value = editedObj.first_name
        lastName.value.value = editedObj.last_name
        email.value.value = editedObj.email
        username.value.value = editedObj.user_name
        dni.value.value = editedObj.dni
        select.value.value = editedObj.id_role

        const dialog = ref(false);
        const dialogSucces = ref(false)
        const dialogText = ref('');

        const items = ref([]);

        const fetchData = async () => {
            const accessToken = store.get('accessToken')
            items.value = await fetchRoles(accessToken) // Assuming your API response is an array of items
        };

        const log = async () => {
            console.log(editedObj.id_role, select.value.value)
        }

        const submit = handleSubmit(async (values) => {
            const accessToken = store.get('accessToken');
            const [result, error] = await updateUser(accessToken, idUser, values)
            if (result) {
                dialogText.value = 'Usuario Actualizado'
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
            fetchData();
        });

        return {
            firstName,
            lastName,
            dni,
            email,
            username,
            password,
            passwordConfirmation,
            select,
            items,
            dialog,
            dialogText,
            dialogSucces,
            log,
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

.updateContainer {
    background: transparent;
}

.text {
    font-size: medium;
    font-weight: 300;
    padding-left: 10px;
}

.v-container {
    max-width: 100%;
}
</style>
  

