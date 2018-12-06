<template>
  <div>
    {{tracks}}
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('midi')

export default {
  computed: {
    ...mapGetters({ tracks: 'getTracks' })
  }
}
</script>

<style>
</style>
