<template>
    <form @submit.prevent="submit" class="registerContainer" style="margin-right: 20px;">
        <v-container class="ma-3 mr-10">
            <v-row>
                <v-col align-self="center">
                    <h1>Registrar Nuevo Empleado</h1>
                </v-col>
            </v-row>
            <v-divider :thickness="7" class="pa-2"></v-divider>
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
            <div class="text"> E-mail (opcional)</div>
            <v-row>
                <v-col align-self="center">
                    <v-text-field class="pa-2" variant="outlined" v-model="email.value.value"
                        :error-messages="email.errorMessage.value" label="E-mail"
                        prepend-inner-icon="mdi-email"></v-text-field>
                </v-col>
            </v-row>
            <div class="text"> Nombre de usuario </div>
            <v-row>
                <v-col align-self="center">
                    <v-text-field class="pa-2" variant="outlined" v-model="username.value.value"
                        :error-messages="username.errorMessage.value" prepend-inner-icon="mdi-account"
                        hint=" El nombre de usuario debe tener al menos 4 digitos" label="Nombre de usuario"></v-text-field>
                </v-col>
            </v-row>
            <div class="text"> Contraseña </div>
            <v-row>
                <v-col align-self="center">
                    <v-text-field class="pa-2" variant="outlined" v-model="password.value.value"
                        :error-messages="password.errorMessage.value" label="Password"
                        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" prepend-inner-icon="mdi-lock-outline"
                        :type="visible ? 'text' : 'password'" @click:append-inner="visible = !visible"></v-text-field>
                </v-col>
                <v-col align-self="center">
                    <v-text-field class="pa-2" variant="outlined" v-model="passwordConfirmation.value.value"
                        :error-messages="passwordConfirmation.errorMessage.value" label="Password"
                        :append-inner-icon="visibleC ? 'mdi-eye-off' : 'mdi-eye'" prepend-inner-icon="mdi-lock-outline"
                        :type="visibleC ? 'text' : 'password'" @click:append-inner="visibleC = !visibleC"></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col align-self="center">
                    <div class="text"> Rol </div>
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
            firstName: Yup.string().required('First name is required'),
            lastName: Yup.string().required('Last name is required'),
            dni: Yup.string().required('DNI is required').min(8, 'DNI must have at least 8 digits'),
            email: Yup.string().email('Invalid email'),
            username: Yup.string().required('Username is required').min(4, 'Username must have at least 4 digits'),
            password: Yup.string().required('Password is required').min(8, 'Password must have at least 8 characters').matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, 'Password must contain at least one uppercase letter, one lowercase letter and one number'),
            passwordConfirmation: Yup.string().required('Password confirmation is required').oneOf([Yup.ref('password'), null], 'Passwords must match'),
            select: Yup.string().required('Select an item')
        });

        const { handleSubmit, handleReset, errors } = useForm({
            validationSchema,
            validateOnMount: false
        });

        const firstName = useField('firstName');
        const lastName = useField('lastName');
        const dni = useField('dni');
        const email = useField('email');
        const username = useField('username');
        const password = useField('password');
        const passwordConfirmation = useField('passwordConfirmation');
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
                        'firstName': values.firstName,
                        'lastName': values.lastName,
                        'dni': values.dni,
                        'email': values.email,
                        'username': values.username,
                        'password': values.password,
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
            firstName,
            lastName,
            dni,
            email,
            username,
            password,
            passwordConfirmation,
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
h1 {
    margin: 10px;
}

.registerContainer {
    border-radius: 10px;
    margin: auto;
    margin-bottom: 50px;
    bottom: 50%;
    background: rgb(var(--v-theme-surface-lighter-1));
    color: rgb(var(--v-theme-on-secondary));
}

.text {
    font-size: medium;
    font-weight: 300;
    padding-left: 10px;
}
</style>
  

