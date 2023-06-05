<template>
    <base-container>
        <v-row style="display: flex;">
            <div class="daemonContainer fadeInCenter">
                <v-col>
                    <v-sheet rounded="lg" color="transparent">
                        <v-row>
                            <v-col class="pa-0 leftD" style="flex: 1;">
                                <v-card title="Descargar aplicacion" subtitle="Informacion" variant="flat" align="center"
                                    color="trasnparent">
                                    <v-list-item prepend-icon="mdi-information"> Para la toma de asistencias es necesario
                                        descargar un programa que se instalará en el ordenador. Una vez instalado, este
                                        iniciará automáticamente todos los días al iniciar la computadora.</v-list-item>
                                    <v-list-item prepend-icon="mdi-alert"> <strong>
                                            Es importante tener en cuenta que este programa solo debe instalarse en las
                                            computadoras
                                            que se utilizarán para tomar asistencias en los cursos.
                                        </strong></v-list-item>
                                    <v-card-actions>
                                        <v-btn class="ma-2" @click="download" variant="outlined"
                                            :disabled="daemonInstalled">
                                            Descargar
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                            <v-col class="pa-0 rightD">
                                <v-card title="Estado Aplicacion local"
                                    subtitle="Verificacion de la aplicacion en esta computadora" variant="flat"
                                    align-self-center align="center" color="transparent">

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
                        </v-row>
                    </v-sheet>
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
                                        Estado: <v-sheet rounded="lg" :color="getColor(classroom.status)" class="pa-2">{{
                                            getStatus(classroom.status) }}</v-sheet>
                                    </v-list-item>
                                </v-card>
                            </v-card-item>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
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
        store.commit('setTitle', { title: 'Control de Aplicacion', icon: 'mdi-download-box' })
    },
    beforeCreate() {
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
                    this.classrooms = result.data.classrooms;
                }
            } catch (error) {
                console.log(error)
            }
        }, getStatus(classStatus) {
            const today = new Date();
            const lastOnline = new Date(classStatus);

            // Set both dates to the same time of day (midnight)
            today.setHours(0, 0, 0, 0);
            lastOnline.setHours(0, 0, 0, 0);

            const timeDiff = today.getTime() - lastOnline.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

            if (daysDiff === 0) {
                return 'Online';
            } else {
                return `Ultima conexión hace ${daysDiff} dia${daysDiff > 1 ? 's' : ''}`;
            }
        }, getColor(classStatus) {
            const today = new Date();
            const lastOnline = new Date(classStatus);

            // Set both dates to the same time of day (midnight)
            today.setHours(0, 0, 0, 0);
            lastOnline.setHours(0, 0, 0, 0);

            const timeDiff = today.getTime() - lastOnline.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

            if (daysDiff === 0) {
                return 'primary';
            } else {
                return 'secondary';
            }
        }, download() {
            const fileUrl = '/AIModuleSetup.exe'; // Replace with the correct path to your file
            const link = document.createElement('a');
            link.href = fileUrl;
            link.setAttribute('download', 'AIModuleSetup.exe');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
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

    border-top-left-radius: 2%;
    border-bottom-left-radius: 2%;
    background: rgb(var(--v-theme-surface));
    min-width: 300px;
}

.rightD {

    text-align: center;
    border-top-right-radius: 2%;
    border-bottom-right-radius: 2%;
    background: rgb(var(--v-theme-surface-lighter-2));
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
  

