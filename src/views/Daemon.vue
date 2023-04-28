<template>
    <base-container>
        <v-parallax src="../assets/Paralax.jpg" style="margin-right: 10px; border-radius: 1%;">
            <v-row style="display: flex;">
                <div class="daemonContainer">
                    <v-col class="pa-0 align-self-stretch" style="flex: 1;">
                        <v-card title="Descargar aplicacion" subtitle="Informacion" variant="elevated" height="350px"
                            align="center">
                            <v-list-item prepend-icon="mdi-information"> Para la toma de asistencias es necesario
                                descargar un programa que se instalará en el ordenador. Una vez instalado, este
                                iniciará automáticamente todos los días al iniciar la computadora.</v-list-item>
                            <v-list-item prepend-icon="mdi-alert"> <strong>
                                    Es importante tener en cuenta que este programa solo debe instalarse en las
                                    computadoras
                                    que se utilizarán para tomar asistencias en los cursos.
                                </strong></v-list-item>
                            <v-card-actions>
                                <v-btn class="me-4 mt-4" @click="download" variant="outlined" :disabled="daemonInstalled">
                                    Descargar
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                    <v-col class="pa-0 " style="flex: 1;">
                        <v-card title="Estado Aplicacion local" subtitle="Verificacion de la aplicacion en esta computadora"
                            variant="elevated" align-self-center align="center" height="350px" color="surface-lighter-2">

                            Instalacion:
                            <div v-if="daemonInstalled" style=" margin: 10px; padding: 10px;">
                                <v-chip size="x-large" color="primary" prepend-icon="mdi-check">
                                    App instalada
                                </v-chip>
                            </div>
                            <div v-else style=" margin: 10px; padding: 10px;">
                                <v-chip size="x-large" color="error" prepend-icon="mdi-alert-box">
                                    App no encontrada
                                </v-chip>
                            </div>
                            Estado:
                            <div v-if="daemonWorking" class="aniWob" style=" margin: 10px; padding: 10px;">
                                <v-chip size="x-large" color="primary" prepend-icon="mdi-check">
                                    En Funcionamiento!
                                </v-chip>
                            </div>
                            <div v-else style=" margin: 10px; padding: 10px;">
                                <v-chip size="x-large" color="error" prepend-icon="mdi-alert-box">
                                    App no esta online
                                </v-chip>
                            </div>
                        </v-card>
                    </v-col>
                </div>
            </v-row>
            <v-row>
                <v-col>
                    <v-card style="margin-left: 9.5%; margin-right:9.5% ;" title="Otros cursos">
                        <v-row>
                            <v-col v-for="classroom in classrooms" cols="12" sm="6" md="3" lg="2">
                                <v-card-item>
                                    <v-card color="surface-lighter-2" class="ma-0" align="center">
                                        <v-list-item>
                                            Nombre: <v-chip v-if="classroom.class_name != null">{{ classroom.class_name
                                            }}</v-chip>
                                            <v-chip v-else> No Name</v-chip>
                                        </v-list-item>
                                        <v-list-item>
                                            Numero: <v-chip>{{ classroom.class_number }}</v-chip>
                                        </v-list-item>
                                        <v-list-item>
                                            Status: <v-chip :color="classroom.status ? 'primary' : 'warning'">{{
                                                classroom.status ? 'Online' : 'Offline' }}</v-chip>
                                        </v-list-item>
                                    </v-card>
                                </v-card-item>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-parallax>
    </base-container>
</template>
  
<script>
import { useStore } from 'vuex'
import store from 'storejs';
import { checkAuth } from '@/plugins/auth';
import { axiosClient } from '@/plugins/axiosClient';
import BaseContainer from '@/components/BaseContainer.vue';

export default {
    data: () => ({
        daemonInstalled: false,
        daemonWorking: false,
        classrooms: []
    }),
    setup() {
        const store = useStore()
        store.commit('setPageTitle', { title: 'Control de aplicacion', })
    },
    beforeCreate() {
        // Call the checkAuth function here
        checkAuth(1);
    },
    methods: {
        async checkDaemonStatus() {
            const accessToken = store.get('accessToken');
            try {
                let result = await axiosClient({
                    method: 'get',
                    timeout: 2000,
                    url: "/classroom/daemon",
                    params: {
                        'accessToken': accessToken,
                        'clientIp': window.location.hostname
                    }
                })
                if (result) {
                    console.log(result)
                    this.daemonInstalled = result.data.daemonInstalled;
                    this.daemonWorking = result.data.daemonWorking;
                }
            } catch (error) {
                console.log(error)
            }
        }, async checkCursos() {
            const accessToken = store.get('accessToken');
            try {
                let result = await axiosClient({
                    method: 'get',
                    timeout: 2000,
                    url: "/classroom",
                    params: {
                        'accessToken': accessToken,
                        'clientIp': window.location.hostname
                    }
                })
                if (result) {
                    console.log(result)
                    this.classrooms = result.data.classrooms;
                }
            } catch (error) {
                console.log(error)
            }
        }
    },
    mounted() {
        this.checkDaemonStatus();
        this.checkCursos();
    },
    components: { BaseContainer }

}

</script>
  
<style>
.daemonContainer {
    display: flex;
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    margin-top: 5%;

}

.leftD {

    border-top-left-radius: 5%;
    border-bottom-left-radius: 5%;
    background: rgb(var(--v-theme-surface));
    min-width: 300px;
}

.rightD {

    text-align: center;
    border-top-right-radius: 5%;
    border-bottom-right-radius: 5%;
    background: rgb(var(--v-theme-surface-lighter-2));
    color: rgb(var(--v-theme-on-secondary));
}

.aniWob {
    animation: aniWob 4s ease-in 0s infinite alternate forwards;
}

@keyframes aniWob {

    0%,
    100% {
        transform: translateX(0%);
        transform-origin: 50% 50%;
    }

    15% {
        transform: translateX(-30px) rotate(-6deg);
    }

    30% {
        transform: translateX(15px) rotate(6deg);
    }

    45% {
        transform: translateX(-15px) rotate(-3.6deg);
    }

    60% {
        transform: translateX(9px) rotate(2.4deg);
    }

    75% {
        transform: translateX(-6px) rotate(-1.2deg);
    }
}
</style>
  

