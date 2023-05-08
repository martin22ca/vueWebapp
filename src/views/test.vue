<template>
    <OpenCamera/>
</template>


<script>
import OpenCamera from '@/components/faceRecog/OpenCamera.vue';
export default {
  data: () => ({
    items: [
      { title: 'Click Me' },
      { title: 'Click Me' },
      { title: 'Click Me' },
      { title: 'Click Me 2' },
    ],
  }),
  components:{ OpenCamera}
}
</script>