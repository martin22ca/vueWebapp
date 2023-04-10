<template>
    <v-navigation-drawer :width="100" rounded="true" color="background-lighter">
        <v-list color="">
            <v-img src="../assets/logo.png" width="100" class="image" varian>

            </v-img>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
            <v-list-item title="Home" value="Home" rounded="true" @click="goHome"></v-list-item>
            <v-list-item title="Inforacion" value="myfiles" rounded="true"></v-list-item>
            <v-list-item title="Shared with me" value="shared" rounded="true"></v-list-item>

        </v-list>
        <template v-slot:append>
            <v-list class="pa-2" density="compact" nav>
                <v-list-item title="Logut" value="logut" class="text-primary" @click="closeSession"
                    rounded="true"></v-list-item>
            </v-list>
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
            router: useRouter()
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
        async goAttendence() {
            this.router.push({ name: "AttendenceDay" })
        },
        async goManagement() {
            this.router.push({ name: "ManagementScreen" })
        }
    },

}

</script>

<style>
.image {
    margin: auto;
    width: 50%;
    padding-bottom: 10px;
}
</style>