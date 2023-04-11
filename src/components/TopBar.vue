<template>
    <div class="Top">
        <v-toolbar color="background">
            <h1 class="h1Top">{{ pageTitle }}</h1>
        </v-toolbar>
    </div>
</template>

<script>
export default {
    name: 'TopBar',
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
    min-height: 60px;
    margin-bottom: 30px;
}

.h1Top {
    font-weight: bold;
    padding-left: 50px;
    padding-top: 15px;
    padding-bottom: 15px;

}
</style>