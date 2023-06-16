<template>
    <BaseContainer>
        <div class="dashContainer fadeInCenter">
            <div class="left-panel">
                <h3><v-icon icon="mdi-information" class="pa-8" />
                    Mensajes</h3>
                <div v-if="messages.length === 0">
                    <div class="noList">
                        <h3>No hay mensajes nuevos.</h3>
                    </div>
                </div>
                <div v-else class="msgBox">
                    <v-card v-for="message in messages" :key="message.id" :title="message.title"
                        subtitle="Mensaje de aistencia" :text="message.info"
                        :prepend-icon="message.viewd ? 'mdi-email-open' : 'mdi-email'" class="ma-1" variant="tonal"
                        :style="{ 'border-left': 'solid 2px ' + (message.viewd ? 'rgb(var(--v-theme-secondary)' : 'rgb(var(--v-theme-primary)') }">
                        <div class="msgText">{{ message.message }} </div>
                        <div>{{ message.info }}</div>
                        <v-card-actions style="display: flex; flex-direction: row; justify-content: space-between;">
                            <v-btn color="primary" variant="tonal" @click="markAsRead(message.id)" v-if="!message.viewd"
                                class="ma-2">marcar como leido</v-btn>
                            <div style=" display: flex;align-items: center;">
                                <v-btn icon="mdi-trash-can" variant="elevated" color="error" class="ma-2" rounded="lg"
                                    @click="deleteMessage(message.id)"></v-btn>
                            </div>
                        </v-card-actions>
                    </v-card>
                </div>
            </div>
            <div class="right-panel">
                <h3><v-icon icon="mdi-table-network" class="pa-8" />Asistencias Hoy</h3>
                <div class="classesContainer">
                    <div v-if="classes.length === 0">
                        <div class="noList">
                            <h3>No hay classes asignadas.</h3>
                        </div>
                    </div>
                    <div v-else class="scroll">
                        <v-row>
                            <v-col v-for="schoolClass in classes" :key="schoolClass.sc" cols="12" sm="6" md="6" lg="4">
                                <v-card :title="'Curso ' + schoolClass.school_year + '-' + schoolClass.school_section"
                                    class="ma-2 pa-1" subtitle="Curso Secundario" color="surface-lighter-2" rounded="xl">
                                    <v-divider thickness="3"></v-divider>
                                    <h4 class="classText"> Estudiantes presentes: <v-chip> {{ schoolClass.present }}
                                        </v-chip></h4>
                                    <h4 class="classText"> Estudiantes Totales: <v-chip>{{ schoolClass.total }} </v-chip>
                                    </h4>
                                    <h4 class="classText"> Porcentaje: <v-chip
                                            :color="getColor(schoolClass.present, schoolClass.total)">
                                            {{ this.getPercentage(schoolClass.present, schoolClass.total) }} </v-chip></h4>
                                    <v-card-actions>
                                        <v-btn variant="tonal" color="primary"
                                            @click="viewClass(schoolClass.sc, schoolClass.school_year, schoolClass.school_section)">Ver
                                            Asistencias</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                        </v-row>
                    </div>
                </div>
            </div>
        </div>
    </BaseContainer>
</template>

<script>
import { useRouter } from 'vue-router';
import store from 'storejs';
import { axiosClient } from '@/plugins/axiosClient';
import BaseContainer from '@/components/BaseContainer.vue';
import { useStore } from 'vuex'
import { checkAuth } from '@/plugins/auth';


export default {
    name: 'Home',
    data() {
        return {
            messages: [],
            classes: [],
            storage: useStore(),
            router: useRouter()
        }
    },
    beforeCreate() {
        checkAuth(1)
    },
    mounted() {
        this.fetchClasses();
        this.fetchMessages();
    },
    setup() {
        const store = useStore()
        store.commit('setTitle', { title: 'Home', icon: 'mdi-home' })
    },
    methods: {
        async fetchMessages() {
            const accessToken = store.get('accessToken');
            const id = store.get('userId')

            try {
                let result = await axiosClient({
                    method: 'get',
                    timeout: 5000,
                    url: "/messages",
                    params: {
                        'accessToken': accessToken,
                        'userId': id
                    }
                })
                if (result.status == 200)
                    this.messages = result.data.messages;
            } catch (error) {
                console.log(error)
            }
        },
        async markAsRead(id) {
            const accessToken = store.get('accessToken');

            try {
                let result = await axiosClient({
                    method: 'put',
                    timeout: 5000,
                    url: '/messages/viewd',
                    params: {
                        'accessToken': accessToken,
                        'idMessage': id
                    }
                })
                if (result.status == 200) {
                    const messageIndex = this.messages.findIndex(message => message.id === id);
                    if (messageIndex !== -1) {
                        this.messages[messageIndex].viewd = true;
                    }
                }
            } catch (error) {
                console.log(error)
            }
        },
        async deleteMessage(id) {
            const accessToken = store.get('accessToken');

            try {
                let result = await axiosClient({
                    method: 'put',
                    timeout: 2000,
                    url: '/messages/delete',
                    params: {
                        'accessToken': accessToken,
                        'idMessage': id
                    }
                })
                if (result.status == 200) {
                    const messageIndex = this.messages.findIndex(message => message.id === id);
                    if (messageIndex !== -1) {
                        this.messages.splice(messageIndex, 1)
                    }
                }
            } catch (error) {
                console.log(error)
            }
        },
        async fetchClasses() {
            const accessToken = store.get('accessToken');
            const id = store.get('userId')

            try {
                let result = await axiosClient({
                    method: 'get',
                    timeout: 5000,
                    url: "/classes/home",
                    params: {
                        'accessToken': accessToken,
                        'userId': id
                    }
                })
                if (result.status == 200)
                    this.classes = result.data.schoolClasses;
            } catch (error) {
                console.log(error)
            }
        }, async viewClass(id, year, section) {
            this.storage.commit('setDate', { date: "" })
            this.storage.commit('setClass', { classId: id, year: year, section: section })
            this.$router.push({
                name: 'Attendances',
            })

        }, getColor(present, total) {
            if (total == 0) return 'green'
            const percent = present / total * 100
            if (percent < 30) return 'red'
            else if (percent < 50) return 'orange'
            else return 'green'
        }, getPercentage(present, total) {
            if (total == 0) return 0
            const percent = Math.round(100 * present / total)
            return percent
        }
    },
    components: { BaseContainer }
}

</script>

<style scoped> .noList {
     text-align: center;
     padding-top: 5%;
 }

 .msgBox {
     overflow-y: scroll;
     max-height: 80vh;
 }

 .msgBox::-webkit-scrollbar {
     display: none;
 }

 .cardTitle {
     padding: 10px;
 }

 .dashContainer {
     min-height: 75vh;
     display: flex;
     flex-direction: row;
 }

 .left-panel {
     flex: 1;
     border-radius: 1%;
     margin: 7px;
     margin-left: 0;
     background-color: rgb(var(--v-theme-surface-lighter-1));
 }

 .right-panel {
     margin: 7px;
     margin-right: 10px;
     border-radius: 1%;
     flex: 2;
     background-color: rgb(var(--v-theme-surface-lighter-1));
 }

 .msgText {
     font-size: 16px;
     line-height: 1.5;
     padding-left: 20px;
 }

 .classText {
     padding: 10px;
     font-weight: 300;
 }
</style>
