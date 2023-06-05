<template>
    <div class="Top">
        <v-sheet class="ma-0 mr-2 pt-2" prepend-icon="mdi-account" color="surface-lighter-1" rounded="lg">
            <v-row>
                <v-col>
                    <v-card variant="text" prepend-icon="mdi-account">
                        <template v-slot:prepend>
                            <v-icon icon="mdi-account" style="font-size: 50px;"/>
                        </template>
                        <template v-slot:title>
                            <h2 style="font-size: 33px; ">
                                {{ this.lastName }}, {{ this.firstName }}
                            </h2>
                        </template>
                        <template v-slot:subtitle>
                            <h3 class="subBase">
                            {{ this.email }}
                        </h3>
                        </template>
                    </v-card>
                </v-col>
                <v-col>
                    <h1 class="h1Top"> <v-icon :icon="pageIcon" class="pr-2" /> {{ pageTitle }}</h1>
                </v-col>
                <v-col align="center" >
                    <v-sheet color="surface-lighter-2" rounded="lg" class="ma-2 pa-2">
                        <DigitalClock />
                    </v-sheet>
                </v-col>
            </v-row>
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
        titleIcon: store.get('titleIcon'),
        lastName: store.get('last_name'),
        email: store.get('email'),
    }),
    computed: {
        pageTitle() {
            return this.$store.state.title
        },
        pageIcon() {
            return this.$store.state.titleIcon
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
    padding-top: 10px;
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