<template>
    <base-container>
        <v-parallax src="../assets/Paralax.jpg" height="750">
            <div class="daemonContainer">
                <div class="leftD">
                    <v-card title="Descargar aplicacion" subtitle="Informacion" variant="text">
                        <v-list dense nav>
                            <v-list-item prepend-icon="mdi-information"> Para la toma de asistencias es necesario
                                descargar un programa que se instalará en el ordenador. Una vez instalado, este
                                iniciará automáticamente todos los días al iniciar la computadora.</v-list-item>
                            <v-list-item prepend-icon="mdi-alert"> <strong>
                                    Es importante tener en cuenta que este programa solo debe instalarse en las computadoras
                                    que se utilizarán para tomar asistencias en los cursos.
                                </strong></v-list-item>
                            <v-card-actions>
                                <v-btn class="me-4 mt-4" @click="download" variant="outlined" :disabled="daemonWorking">
                                    Descargar
                                </v-btn>
                            </v-card-actions>
                        </v-list>
                    </v-card>
                </div>
                <div class="rightD">
                    <v-card title="Estado Aplicacion" subtitle="Verificacion de la aplicacion en el curso" variant="text">

                        Instalacion:
                        <div v-if="daemonInstalled">
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
                        <div v-if="daemonWorking" class="aniWob">
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
                </div>
            </div>
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
                if (result.status == 200) {
                    this.daemonWorking = result.data.daemonInfo;
                }
            } catch (error) {
                console.log(error)
            }
        }
    },
    mounted() {
        this.checkDaemonStatus();
    },
    components: { BaseContainer }

}

</script>
  
<style>
.daemonContainer {
    display: flex;
    margin-left: auto;
    margin-right: auto;
    width: 60%;
    margin-top: 5%;

}

.leftD {
    flex: 1;
    border-top-left-radius: 5%;
    border-bottom-left-radius: 5%;
    background: rgb(var(--v-theme-surface));
    min-width: 300px;
}

.rightD {
    flex: 1;
    text-align: center;
    padding: 2rem;
    border-top-right-radius: 5%;
    border-bottom-right-radius: 5%;
    background: rgb(var(--v-theme-surface-lighter-2));
    color: rgb(var(--v-theme-on-secondary));
}

.aniWob {
    margin: 40px;
    padding: 40px;
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
  

