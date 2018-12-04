<template>
  <div>
    <Settings />
    <Monitor />
  </div>
</template>

<script>
import Settings from './Settings'
import Monitor from './Monitor'
import { mapActions } from 'vuex'

export default {
  components: {
    Settings,
    Monitor
  },
  methods: {
    ...mapActions('midi', ['bootstrap'])
  },
  created () {
    this.bootstrap().catch(e => { console.log(e.message) })
  }
}
</script>

<style>
</style>
