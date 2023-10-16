<template>
    <v-sheet :width="smallScreen ? '' : '105px'" color="transparent">
        <v-navigation-drawer width="125" color="transparent" border="0" class="pa-1" disable-resize-watcher permanent>
            <v-list>
                <v-sheet rounded="lg" class="pa-2">
                    <img src="../assets/logo.png" width="70" class="image" @click="goTo('Home')" />
                </v-sheet>
            </v-list>
            <v-sheet rounded="lg">
                <v-list dense nav>
                    <v-list-item v-for="item in filteredMenuItems" :key="item.name" :value="item.name"
                        :class="currentRouteName == item.route ? 'text-primary' : undefined" class="mt-2 pt-1 pb-1" rounded
                        @click="goTo(item.route)" variant="text">
                        <div class="iconS">
                            <v-icon :icon="item.icon" size="30px" />
                        </div>
                        <h4 class="sideText">{{ item.name }}</h4>
                    </v-list-item>
                </v-list>
            </v-sheet>
            <template v-slot:append>
                <v-sheet rounded="lg" class="ma-1">
                    <v-switch inset @click="toggleTheme" false-icon="mdi-weather-sunny" v-model="themeVal"
                        true-icon="mdi-moon-waning-crescent" style="display: flex; justify-content: center;" color='primary'
                        fal>
                    </v-switch>
                    <v-list-item value="Logout" rounded="true" variant="tonal" @click="closeSession"
                        style="border-radius: 10%;" color="primary">
                        <div class="iconS">
                            <v-icon icon="mdi-logout" size="large" />
                        </div>
                        <h4 class="sideText">Logout</h4>
                    </v-list-item>
                </v-sheet>
            </template>
        </v-navigation-drawer>
    </v-sheet>
</template>

<script>
import store from 'storejs';
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

export default {
    name: "SideBar",
    data() {
        return {
            sidebarVisible: true,
            smallScreen: window.innerWidth < 600,
            firstName: store.get('first_name'),
            lastName: store.get('last_name'),
            role: store.get('role'),
            router: useRouter(),
            theme: useTheme(),
            themeVal: store.get('theme'),
            menuItems: [
                {
                    name: 'Home',
                    icon: 'mdi-home',
                    route: 'Home',
                    roleNeeded: [0, 1, 2, 3]
                },
                {
                    name: 'Asistencia',
                    icon: 'mdi-table-network',
                    route: 'Attendances',
                    roleNeeded: [0, 1, 3]
                },
                {
                    name: 'Análisis',
                    icon: 'mdi-chart-line',
                    route: 'Analysis',
                    roleNeeded: [0, 1, 3]
                },
                {
                    name: 'Alumnos',
                    icon: 'mdi-school',
                    route: 'Students',
                    roleNeeded: [0, 1, 3]
                },
                {
                    name: 'Personal',
                    icon: 'mdi-briefcase',
                    route: 'Users',
                    roleNeeded: [0, 2, 3]
                },
                {
                    name: 'Cursos',
                    icon: 'mdi-google-classroom',
                    route: 'Curso',
                    roleNeeded: [0, 2, 3]
                },
                {
                    name: 'Modulos IA',
                    icon: 'mdi-domain',
                    route: 'aiModules',
                    roleNeeded: [0, 2, 3]
                },
                {
                    name: 'APP',
                    icon: 'mdi-download-box',
                    route: 'Daemon',
                    roleNeeded: [0, 2, 3]
                }
            ]

        }
    },
    mounted() {
        if (this.themeVal == false) {
            this.theme.global.name = 'lightTheme'
            return null
        }
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },
    computed: {
        currentRouteName() {
            return this.$route.name;
        },
        filteredMenuItems() {
            return this.menuItems.filter(item => item.roleNeeded.includes(this.role));
        }
    },
    methods: {
        async closeSession() {
            try {
                store.clear()
                this.router.push({ name: "Login" })

            } catch (error) {
                console.log(error)
            }
        },
        async goTo(route) {
            this.router.push({ name: route })
        },
        toggleTheme() {
            this.theme.global.name = this.theme.global.current.dark ? 'lightTheme' : 'darkTheme'
            this.themeVal = !this.themeVal
            store({ theme: this.themeVal })
        },
    }
}

</script>

<style>
.v-navigation-drawer__content::-webkit-scrollbar {
    display: none;
}

.image {
    display: block;
    margin-left: auto;
    margin-right: auto;
    transition: transform 0.3s;
    cursor: pointer;
    background-color: rgb(var(--v-theme-surface));
    border-radius: 5%;
}

.image:hover {
    transform: scale(1.1);
    /* Increase the size of the image */
}

.iconS {
    text-align: center;
}

.sideText {
    font-size: 13px;
    text-align: center;
    font-weight: 300;
}
</style>