<template>
  <div>
    <div
      v-for="track in tracks"
      :key="track.channel"
    >
      {{track.channel}}:{{track.bankSelectMSB}}({{track.emulateBankSelectMSB}}){{track.bankSelectLSB}}{{track.programChangeNumber + 1}}{{track.getEmulatedName()}}
    </div>
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
