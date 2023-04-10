<template>
    <BaseContainer>
        <div class="classContainer">
            <v-toolbar flat>
                <v-toolbar-title>Asistencias dia: <strong>{{ currentDate }}</strong></v-toolbar-title>
            </v-toolbar>
            <v-data-table :headers="headers" :items="desserts" class="elevation-1">
                <template v-slot:item.calories="{ item }">
                    <v-chip :color="getColor(item.raw.calories)">
                        {{ item.raw.calories }}
                    </v-chip>
                </template>
            </v-data-table>
        </div>
    </BaseContainer>
</template>

<script>
import { VDataTable } from 'vuetify/labs/VDataTable'
import BaseContainer from '@/components/BaseContainer.vue';
import { useStore } from 'vuex'
import { checkAuth } from '@/plugins/auth';
import { useRouter } from 'vue-router';

export default {
    name: 'Home',
    data() {
        return {
            currDate: '',
            headers: [
                {
                    title: 'Nombre',
                    align: 'start',
                    sortable: true,
                    key: 'firstName',
                },
                { title: 'Apellido', key: 'lastName' },
                { title: 'Fat (g)', key: 'fat' },
                { title: 'Carbs (g)', key: 'carbs' },
                { title: 'Protein (g)', key: 'protein' },
                { title: 'Iron (%)', key: 'iron' },
            ],

            storage: useStore()

        }
    },
    beforeCreate() {
        checkAuth()
    }, setup() {
        const store = useStore()
        const router = useRouter()
        const sect = store.state.classSection
        const classYear = store.state.classYear
        if (sect == "z" || classYear == -1) {
            router.push({
                name: 'Home',
            })
        }
        store.commit('setPageTitle', { title: 'Asistencias', subtitle: "Curso " + store.state.classYear + "-'" + store.state.classSection + "'" })
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
    },
    components: { BaseContainer, VDataTable, }
}

</script>
<style>
.classContainer {
    padding: 5px;
}
</style>
