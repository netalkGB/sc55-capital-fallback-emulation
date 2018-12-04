<template>
  <div>
    {{tracks}}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('midi', { tracks: 'getTracks' })
  }
}
</script>

<style>
</style>
