<template>
    <v-footer class=" text-center d-flex flex-column mt-5" color="primary-darken">
        <div>
            <strong> Copyright © Colegio Del Espíritu Santo. </strong> — {{ new Date().getFullYear() }}
        </div>
        <div class="pa-5"> Todos los derechos reservados. Este sitio web es exclusivo para el
            uso del personal de la institución y está protegido por las leyes de propiedad intelectual. Prohibida su
            reproducción total o parcial sin autorización previa por escrito. Contáctanos:
            <strong>administracion@delespiritusanto.edu.ar.</strong>
        </div>

        <v-divider></v-divider>


    </v-footer>
</template>

<script>
export default {
    data: () => ({
        icons: [
            'mdi-facebook',
            'mdi-twitter',
            'mdi-linkedin',
            'mdi-instagram',
        ],
    }),
}
</script>