<template>
    <div class="Top">
        <v-sheet class="ma-0 mr-2 pt-2" prepend-icon="mdi-account" color="background-lighter" >
            <v-row>
                <v-col align="center">
                    <v-sheet color="surfaces" rounded="lg" class="ma-2 pa-2">
                        <DigitalClock />
                    </v-sheet>
                </v-col>
                <v-col cols="10">
                    <h1 class="h1Top">{{ pageTitle }}</h1>
                </v-col>
            </v-row>
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
import DigitalClock from "../components/Clock.vue"


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
    },
    components: { DigitalClock }
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
    text-align: center;
    padding-top: 3px;
    padding-bottom: 3px;

}

.subBase {
    font-size: 15px;
    font-weight: 300;
    font-style: italic;
    padding-left: 45px;
    margin-bottom: 10px;
    padding-bottom: 5px;
}

.clock {
    color: #17D4FE;
    font-size: 60px;
    font-family: Orbitron;
    letter-spacing: 7px;
}
</style>