<template>
    <BaseContainer>
        <div class="calendarContainer">
            <v-card title="Seleccionar Fecha" subtitle="Validacion asistencias pasadas" style="width: 100%;">
                <VueCal style="padding: 10px; background-color: rgb(var(--v-theme-surface-lighter-1)); height: 670px;" active-view="month"
                    click-to-navigate :disable-views="['years', 'week', 'day']" :min-date="minDate" :max-date="maxDate"
                    @cell-dblclick="onDateClick"  locale="es"/>
            </v-card>
        </div>
    </BaseContainer>
</template>

<script>
import { useStore } from 'vuex'
import { checkAuth } from '@/plugins/auth';
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import BaseContainer from '@/components/BaseContainer.vue';

export default {
    name: 'Calendar',
    data() {
        return {
            date: new Date(),
            storage: useStore(),
        }
    },
    beforeCreate() {
        checkAuth(2)
    },
    setup() {
        const store = useStore()
        store.commit('setPageTitle', { title: 'Calendario' })
    },
    methods: {
        onDateClick(date) {
            this.storage.commit('setDate', { date: date })
            this.$router.push({
                name: 'Attendances',
            })

        }
    },
    computed: {
        minDate() {
            return new Date(new Date().getFullYear(), 0, 1);
        },
        maxDate() {
            return new Date()
        }
    },
    components: { BaseContainer, VueCal }
}

</script>
<style>
.calendarContainer {
    margin-top: 10px;
    margin-right: 10px;
    height: 750px;
    display: flex;
}

.vuecal--month-view .vuecal__cell-date {
    padding: 4px;
}

.vuecal__cell--disabled {
    text-decoration: line-through;
}

.vuecal__cell--before-min {
    color: rgb(var(--v-theme-surface-lighter-2));
}

.vuecal__cell--after-max {
    color: rgb(var(--v-theme-surface-lighter-2));
}

.vuecal__cell--selected {
    background-color: rgb(var(--v-theme-primary-darken-1));
}

.vuecal__cell--today {
    background-color: rgb(var(--v-theme-primary-darken-2));
}
</style>
