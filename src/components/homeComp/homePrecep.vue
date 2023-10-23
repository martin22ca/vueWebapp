<template>
    <h3><v-icon icon="mdi-table-network" class="pa-8" />Asistencias Hoy</h3>
    <div class="classesContainer">
        <div v-if="grades.length === 0">
            <div class="noList" style="display: flex; flex-direction: row; justify-content: center; ">
                <h2>No hay classes asignadas.</h2>
            </div>
        </div>
        <div v-else class="scroll">
            <v-row>
                <v-col v-for="grade in grades" :key="grade.id_grade" cols="12" sm="6" md="6" lg="4">
                    <v-card :title="'Curso ' + grade.school_year + '-' + grade.school_section" class="ma-2 pa-1"
                        subtitle="Curso Secundario" color="surface-lighter-2" rounded="xl">
                        <v-divider thickness="3"></v-divider>
                        <h2 class="classText"> Estado:
                            <v-chip class="ma-1 pa-2" :color="grade.status ? 'primary' : 'error'" variant="elevated" size="lg">
                                {{ grade.status ? 'Abierto' : 'Cerrado' }} </v-chip>
                        </h2>
                        <v-card-actions>
                            <v-btn variant="tonal" color="primary" style="font-size: 15px;"
                                @click="viewClass(grade.id_grade)">Ver
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
import { fetchGradeHome } from '@/services/api/gradesService'
import { useStore } from 'vuex'


export default {
    name: 'homePrecep',
    data() {
        return {
            grades: [],
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
            this.grades = await fetchGradeHome(accessToken, id)
            console.log(this.grades)

        }, async viewClass(id) {
            this.storage.commit('setDate', { date: "" })
            this.storage.commit('setClass', { classId: id})
            this.$router.push({
                name: 'Attendances',
            })
        }
    },
}

</script>

<style>
.classText {
    font-size: 18px;
    padding: 10px;
    font-weight: 300;
}
</style>