<template>
    <v-navigation-drawer :width="100" rounded="true" color="background-lighter">
        <v-list color="">
            <v-img src="../assets/logo.png" width="100" class="image">
            </v-img>
        </v-list>
        <v-divider thickness="11"></v-divider>
        <v-list dense nav>
            <v-list-item v-for="item in menuItems" :key="item.name" :value="item.name"
                :class="currentRouteName == item.route ? 'text-primary' : undefined" rounded class="mt-2 pt-2 pb-2"
                @click="goTo(item.route)">
                <div class="iconS">
                    <v-icon :icon="item.icon" size="x-large" />
                </div>
                <h4>{{ item.name }}</h4>
            </v-list-item>
            <v-divider></v-divider>
        </v-list>
        <template v-slot:append>
            <v-divider></v-divider>
            <v-list-item value="Logout" rounded="true" class="text-primary" @click="closeSession">
                <div class="iconS">
                    <v-icon icon="mdi-logout" size="x-large" />
                </div>
                <h4>Logout</h4>
            </v-list-item>
        </template>
    </v-navigation-drawer>
</template>

<script>
import store from 'storejs';
import { useRouter } from 'vue-router'

export default {
    name: "SideBar",
    data() {
        return {
            firstName: store.get('first_name'),
            lastName: store.get('last_name'),
            router: useRouter(),
            menuItems: [
                {
                    name: 'Home',
                    icon: 'mdi-home',
                    route: 'Home'
                },
                {
                    name: 'Messages',
                    icon: 'mdi-email',
                    route: 'Messages'
                },
                {
                    name: 'Calendar',
                    icon: 'mdi-calendar',
                    route: 'Calendar'
                }
            ]

        }
    },
    computed: {
        currentRouteName() {
            return this.$route.name;
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
        async goHome() {
            this.router.push({ name: "Home" })
        },
        async goManagement() {
            this.router.push({ name: "ManagementScreen" })
        }
    },

}

</script>

<style>
.image {
    flex-direction: column;
    margin-left: auto;
    padding-bottom: 10px;
    align-items: center;
}

.iconS {
    padding-bottom: 10px;
    padding-left: 25%;
}

h4 {
    font-size: 14px;
    text-align: center;
    font-weight: 300;
}
</style>