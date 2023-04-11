<template>
    <BaseContainer>
        <div class="classContainer">
            <v-card class="pt-2 pb-2" variant="tonal">
                <v-card-title>
                    <h3 style="padding: 5px;">
                        Asistencias dia: <strong>{{ currentDate }}</strong>
                    </h3>
                    <h3 style="padding: 5px;">
                        Curso: <strong>{{ classYear }}-"{{ classSection }}"</strong>
                    </h3>
                </v-card-title>
                <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details
                    class="pl-5 pr-5" variant="outlined"></v-text-field>
            </v-card>
            <v-data-table :headers="headers" :items="items" class="elevation-1" density="compact" :search="search">
                <template v-slot:item.moreInfo="{}">
                    <v-btn rounded="true">
                        Mas Info
                    </v-btn>
                </template>
                <template v-slot:item.present="{ item }">
                    <v-checkbox-btn v-model="item.value.present" disabled />
                </template>
            </v-data-table>
        </div>
    </BaseContainer>
</template>

<script>
import { VDataTable } from 'vuetify/labs/VDataTable'
import BaseContainer from '@/components/BaseContainer.vue';
import { useStore } from 'vuex'
import store from 'storejs';
import { checkAuth } from '@/plugins/auth';
import { useRouter } from 'vue-router';
import axios from 'axios'

export default {
    name: 'Home',
    data() {
        return {
            currDate: '',
            classId: useStore().state.classId,
            classYear: useStore().state.classYear,
            classSection: useStore().state.classSection,

            search: '',
            headers: [
                { title: 'id', key: 'idStud', align: 'start', width: '5%' },
                { title: 'Apellido', key: 'lastName', sortable: true, align: 'center', width: '20%' },
                { title: 'Nombre', key: 'firstName', align: 'center', width: '20%' },
                { title: 'Present', key: 'present', align: 'center', width: '5%' },
                { title: 'Hora entrada', key: 'time', align: 'center', width: '10%' },
                { title: 'Picture', key: 'picture', sortable: false, align: 'center' },
                { title: '', key: 'moreInfo', sortable: false, align: 'end', width: '8%' },
            ],
            items: [
                {
                    idStud: 1,
                    firstName: 'Jose',
                    lastName: 'Argelio',
                    present: false,
                    time: null,
                    picture: null,
                },
                {
                    idStud: 2,
                    firstName: 'Martin',
                    lastName: 'Caceres',
                    present: true,
                    time: 4.3,
                    picture: '1%',
                },
            ],
        }
    },
    beforeCreate() {
        checkAuth()
    },
    mounted() {
        this.fetchAttendences();
    },
    setup() {
        const store = useStore()
        const router = useRouter()
        const sect = store.state.classSection
        const classYear = store.state.classYear
        if (sect == "z" || classYear == -1) {
            router.push({
                name: 'Home',
            })
        }
        store.commit('setPageTitle', { title: 'Asistencias', })
        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        // This arrangement can be altered based on how we want the date's format to appear.
        let currentDate = `${day}-${month}-${year}`;
        store.commit('setDate', { date: currentDate })
    },
    computed: {
        currentDate() {
            return this.$store.state.currentDate
        }

    },
    methods: {
        async fetchAttendences() {
            const accessToken = store.get('accessToken');


            try {
                let result = await axios({
                    method: 'get',
                    timeout: 2000,
                    url: "http://192.168.0.62:3001/attendence",
                    params: {
                        'accessToken': accessToken,
                        'classId': this.classId
                    }
                })
                if (result.status == 200)
                    this.messages = result.data.messages;
            } catch (error) {
                console.log(error)
            }
        },
    },
    components: { BaseContainer, VDataTable, }
}

</script>
<style>
.classContainer {
    padding: 5px;
}
</style>
