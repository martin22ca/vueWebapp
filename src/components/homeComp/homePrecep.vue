<template>
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
                    <v-card :title="'Curso ' + schoolClass.school_year + '-' + schoolClass.school_section" class="ma-2 pa-1"
                        subtitle="Curso Secundario" color="surface-lighter-2" rounded="xl">
                        <v-divider thickness="3"></v-divider>
                        <h4 class="classText"> Porcentaje: <v-chip class="homeChip"
                                :color="getColor(schoolClass.present, schoolClass.total)">
                                {{ this.getPercentage(schoolClass.present, schoolClass.total) }} </v-chip></h4>
                        <v-card-actions>
                            <v-btn variant="tonal" color="primary" style="font-size: 15px;"
                                @click="viewClass(schoolClass.sc, schoolClass.school_year, schoolClass.school_section)">Ver
                                Asistencias</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import store from 'storejs';
import { axiosClient } from '@/plugins/axiosClient';
import { useStore } from 'vuex'


export default {
    name: 'homePrecep',
    data() {
        return {
            classes: [],
            storage: useStore(),
            router: useRouter()
        }
    },
    mounted() {
        this.fetchClasses();
    },
    methods: {
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
}

</script>

<style>
.classText {
    font-size: 15px;
    padding: 10px;
    font-weight: 300;
}
</style>