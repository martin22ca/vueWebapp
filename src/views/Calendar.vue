<template>
    <BaseContainer>
        <div class="calendarContainer">
            <calendar-view :show-date="showDate" class="theme-default holiday-us-traditional holiday-us-official">
                <template #header="{ headerProps }">
                    <calendar-view-header :header-props="headerProps" @input="setShowDate" />
                </template>
            </calendar-view>
        </div>
    </BaseContainer>
</template>

<script>
import { CalendarView, CalendarViewHeader } from "vue-simple-calendar"
import "../../node_modules/vue-simple-calendar/dist/style.css"
import "../../node_modules/vue-simple-calendar/dist/css/holidays-us.css"
import { useStore } from 'vuex'
import { checkAuth } from '@/plugins/auth';
import BaseContainer from '@/components/BaseContainer.vue';

export default {
    name: 'Calendar',
    data() {
        return {
            dialog: false,
            currDate: '',
            selectItems: [],
            classId: { sc: -1, text: "Select" },
            classYear: '',
            classSection: '',
        }
    },
    beforeCreate() {
        checkAuth()
    },
    setup() {
        const store = useStore()
        store.commit('setPageTitle', { title: 'Calendar', subtitle: 'Ver asistencias anteriores' })
    },
    mounted() {
        this.fetchClasses()
    },
    methods: {
        async fetchClasses() {

        },
    },
    components: { BaseContainer, CalendarView, CalendarViewHeader }
}

</script>
<style>
.calendarContainer {
    height: 600px;
    padding: 1%;
    display: flex;
}
</style>
