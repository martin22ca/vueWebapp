<template>
    <v-footer class=" text-center d-flex flex-column mt-5" color="surface-lighter-2">
        <div>
            <strong> Copyright © Colegio Del Espíritu Santo. </strong> — {{ new Date().getFullYear() }}
        </div>
        <div class="pl-5 pr-5 pt-2"> Todos los derechos reservados. Este sitio web es exclusivo para el
            uso del personal de la institución y está protegido por las leyes de propiedad intelectual. Prohibida su
            reproducción total o parcial sin autorización previa por escrito. Contáctanos:
            <strong class="lightenMsg"> <link> administracion@delespiritusanto.edu.ar. </strong>
        </div>

        <v-divider></v-divider>


    </v-footer>
</template>

<script>
export default {
    data: () => ({
    }),
}
</script>

<style>
.lightenMsg {
    color: forestgreen;
}
</style>