<template>
  <div>
    <Settings />
    <Monitor />
  </div>
</template>

<script>
import Settings from './Settings'
import Monitor from './Monitor'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('midi')
export default {
  components: {
    Settings,
    Monitor
  },
  methods: {
    ...mapActions(['bootstrap'])
  },
  created () {
    this.bootstrap().catch(e => { console.log(e.message) })
  }
}
</script>

<style>
</style>
