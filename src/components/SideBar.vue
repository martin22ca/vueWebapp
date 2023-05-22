<template>
    <div style="width:85px;">
        <v-navigation-drawer :width="100" rounded="true" color="transparent" class="pa-1" border="0" permanent>
            <v-row>
                <v-col>
                    <v-list>
                        <v-sheet rounded="lg" class="pa-2">
                            <img src="../assets/logo.png" width="70" class="image" />
                        </v-sheet>
                    </v-list>

                    <v-sheet rounded="lg" class="mb-2">
                        <v-list dense nav>
                            <v-list-item v-for="item in filteredMenuItems" :key="item.name" :value="item.name"
                                :class="currentRouteName == item.route ? 'text-primary' : undefined" class="mt-2 pt-2 pb-2"
                                rounded @click="goTo(item.route)">
                                <div class="iconS">
                                    <v-icon :icon="item.icon" size="x-large" />
                                </div>
                                <h4 class="sideText">{{ item.name }}</h4>
                            </v-list-item>
                        </v-list>
                    </v-sheet>

                    <v-sheet rounded="lg" style="align-self: flex-end;">
                        <v-btn color="black" class="ma-2" align="center" @click="toggleTheme">Th</v-btn>
                        <v-list-item value="Logout" rounded="true" variant="tonal" @click="closeSession"
                            style="border-radius: 10%;" color="primary">
                            <div class="iconS">
                                <v-icon icon="mdi-logout" size="x-large" />
                            </div>
                            <h4 class="sideText">Logout</h4>
                        </v-list-item>
                    </v-sheet>
                </v-col>
            </v-row>
        </v-navigation-drawer>
    </div>
</template>

<script>
import store from 'storejs';
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

export default {
    name: "SideBar",
    data() {
        return {
            firstName: store.get('first_name'),
            lastName: store.get('last_name'),
            role: store.get('role'),
            router: useRouter(),
            theme: useTheme(),
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
    computed: {
        currentRouteName() {
            return this.$route.name;
        },
        filteredMenuItems() {
            return this.menuItems.filter(item => item.roleNeeded <= this.role);
        },

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
            console.log(this.theme)
            this.theme.global.name = this.theme.global.current.dark ? 'lightTheme' : 'darkTheme'
        }
    },

}

</script>

<style>
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
</style>