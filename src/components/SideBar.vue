<template>
    <v-sheet :width="smallScreen ? '' : '80px'" color="transparent">
        <v-btn v-if="!sidebarVisible" class="ma-3 btnSide" icon="mdi-menu" size="x-large" @click="toggleSidebar" color="primary" style="position: absolute;"/>
        <v-navigation-drawer v-model="sidebarVisible" fixed width="100" :color="smallScreen ? 'surface' : 'transparent'"
            border="0" class="pa-1" disable-resize-watcher permanent>
            <v-list>
                <v-sheet rounded="lg" class="pa-2" variant="">
                    <img src="../assets/logo.png" width="70" class="image" />
                </v-sheet>
            </v-list>
            <v-sheet rounded="lg">
                <v-list dense nav>
                    <v-list-item v-for="item in filteredMenuItems" :key="item.name" :value="item.name"
                        :class="currentRouteName == item.route ? 'text-primary' : undefined" class="mt-2 pt-1 pb-1" rounded
                        @click="goTo(item.route)" variant="text">
                        <div class="iconS">
                            <v-icon :icon="item.icon" size="large" />
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
                    roleNeeded: 1,
                },
                {
                    name: 'Asistencia',
                    icon: 'mdi-table-network',
                    route: 'Attendances',
                    roleNeeded: 1,
                },
                {
                    name: 'Calendar',
                    icon: 'mdi-calendar',
                    route: 'Calendar',
                    roleNeeded: 1,
                },
                {
                    name: 'Analisis',
                    icon: 'mdi-chart-line',
                    route: 'Classes',
                    roleNeeded: 1,
                },
                {
                    name: 'Gestion',
                    icon: 'mdi-cog',
                    route: 'Management',
                    roleNeeded: 2,
                },
                {
                    name: 'APP',
                    icon: 'mdi-download-box',
                    route: 'Daemon',
                    roleNeeded: 2,
                }
            ]

        }
    },
    mounted() {
        if (this.themeVal == false) {
            this.theme.global.name = 'lightTheme'
            return null
        }
        window.addEventListener('resize', this.handleResize);
        this.sidebarVisible = !this.smallScreen
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },
    computed: {
        currentRouteName() {
            return this.$route.name;
        },
        filteredMenuItems() {
            return this.menuItems.filter(item => item.roleNeeded <= this.role);
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
        }, toggleSidebar() {
            this.sidebarVisible = !this.sidebarVisible;
        }, handleResize() {
            if (window.innerWidth < 970) {
                this.smallScreen = true
                this.sidebarVisible = false
            } else {
                this.smallScreen = false
                this.sidebarVisible = true
            }

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
}

.iconS {
    padding-bottom: 10px;
    padding-left: 25%;
}

.sideText {
    font-size: 13px;
    text-align: center;
    font-weight: 300;
}


.btnSide {
    position: absolute;
    z-index: 9999;
}
</style>