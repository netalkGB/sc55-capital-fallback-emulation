<template>
  <div>
    <div
      class="track"
      v-for="track in tracks"
      :key="track.channel"
    >
      <div class="channel">
        {{track.channel}}
      </div>
      <div class="bsmsb">
        {{track.bankSelectMSB}}
      </div>
      <div class="bsmsb">
        {{track.emulateBankSelectMSB}}
      </div>
      <div class="programChange">
        {{track.programChangeNumber + 1}}
      </div>
      <div>
        <span v-if="track.bankSelectMSB !== track.emulateBankSelectMSB">[EMULATE]</span>{{track.getEmulatedName()}}
      </div>
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

<style scoped>
.track {
  display: flex;
}
.channel {
  width: 30px;
}
.bsmsb {
  width: 60px;
}
.programChange {
  width: 45px;
}
</style>
