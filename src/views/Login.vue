<template>
    <div class="gradient">
        <div class="container">
            <div class="left">
                <h1>Login</h1>
                <form @submit.prevent="submit">
                    <v-text-field class="mr-4" variant="outlined" v-model="username.value.value"
                        :error-messages="username.errorMessage.value" label="Username" prepend-inner-icon="mdi-account"
                        autocomplete="off"></v-text-field>

                    <v-text-field class="mr-4 mb-4" variant="outlined" label="Password"
                        prepend-inner-icon="mdi-lock-outline" v-model="password.value.value"
                        :error-messages="password.errorMessage.value"
                        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                        @click:append-inner="visible = !visible" autocomplete="off">
                    </v-text-field>

                    <p>
                        Si no recuerda su contraseña y/o usuario comuníquese con un administrador para realizar un cambio de
                        contraseña.
                    </p>
                    <v-btn class="me-4 mt-4" type="submit">
                        Log in
                    </v-btn>

                    <v-btn class="me-4 mt-4" @click="handleReset">
                        clear
                    </v-btn>
                </form>
            </div>
            <div class="right">
                <h1>Colegio del Espiritu Santo</h1>
                <img :width="250" cover src="../assets/logo.png" />
            </div>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios'
import store from 'storejs';
import * as Yup from "yup";
import { checkLoged } from '@/plugins/auth';
import { useField, useForm } from 'vee-validate'
import { useRouter } from 'vue-router'

export default {
    data: () => ({
        visible: false,
        visibleC: false,
        errorVal: false,
        error: '',

    }),
    beforeCreate() {
        checkLoged()
    },
    setup() {
        const validationSchema = Yup.object().shape({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required')
        });

        const { handleSubmit, handleReset, errors } = useForm({
            validationSchema,
            validateOnMount: false
        });

        const username = useField('username');
        const password = useField('password');
        const router = useRouter()

        const submit = handleSubmit(async (values) => {
            try {
                const result = await axios.post('http://192.168.0.62:3001/login', {
                    username: values.username,
                    password: values.password,
                });
                console.log(result);
                if (result.status == 200) {
                    console.log('success');
                    store(result.data);

                    router.push({
                        name: 'Home',
                    })
                } else {
                    alert(JSON.stringify(result.status));
                }
            } catch (error) {
                console.log(error)
            }
        });

        return {

            username,
            password,
            submit,
            handleReset,
            errors
        };
    },


}

</script>
  
<style scoped>
p {
    margin: 20px;
    color: rgb(173, 173, 173);
    font-style: italic;
}

.gradient {
    height: 100vh;
    background: rgb(0, 0, 0);
    background: linear-gradient(190deg, rgba(0, 0, 0, 1) 80%, rgba(47, 47, 47, 1) 80%, rgb(173, 173, 173) 100%);
}

h1 {
    margin: 10px;
}

@keyframes blink {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.container {
    display: flex;
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: blink 1.5s;

}

.left {
    flex: 1;
    text-align: center;
    padding: 2rem;
    border-top-left-radius: 5%;
    border-bottom-left-radius: 5%;
    background: rgb(var(--v-theme-surface));
}

.right {
    flex: 1;
    text-align: center;
    padding: 2rem;
    border-top-right-radius: 5%;
    border-bottom-right-radius: 5%;
    background: rgb(var(--v-theme-secondary));
    color: rgb(var(--v-theme-on-secondary));
}
</style>
  

