<template>
    <div class="Top">
        <v-sheet class="ma-0 mr-2 pt-2" prepend-icon="mdi-account" color="background-lighter" rounded="lg">
            <h1 class="h1Top">{{ pageTitle }}</h1>
            <h2 style="padding-left: 5px; font-size: 40px; ">
                <v-icon icon="mdi-account" class="pr-2" />{{ this.lastName }} , {{ this.firstName }}
            </h2>
            <h3 class="subBase">
                {{ this.email }}
            </h3>
        </v-sheet>
    </div>
</template>

<script>
import store from 'storejs';
export default {
    name: 'TopBar',
    data: () => ({
        firstName: store.get('first_name'),
        lastName: store.get('last_name'),
        email: store.get('email'),
    }),
    computed: {
        pageTitle() {
            return this.$store.state.title
        },
        pageSubtitle() {
            return this.$store.state.subtitle
        }
    }
}
</script>

<style>
.Top {
    padding-top: 10px;
    min-height: 60px;
    margin-bottom: 30px;
}

.h1Top {
    font-weight: bold;
    padding-left: 50px;
    padding-top: 3px;
    padding-bottom: 3px;

}
</style>