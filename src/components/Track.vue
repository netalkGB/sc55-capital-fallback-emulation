<template>
  <div
    class="track"
    :class="{ emulating }"
  >
    <div class="number">
      {{track.channel}}
    </div>
    <div class="number">
      {{track.bankSelectMSB}}
    </div>
    <div class="number">
      {{track.programChangeNumber + 1}}
    </div>
    <div class="instrument">
      <span v-if="emulating" class="emulate">[EMULATE]</span>{{track.getEmulatedName()}}
    </div>
  </div>
</template>
<script>
export default {
  props: ['track'],
  computed: {
    emulating: function () {
      return this.track.bankSelectMSB !== this.track.emulateBankSelectMSB
    }
  }
}
</script>

<style scoped>
.track {
  display: flex;
}
.number {
  width: 30px;
}
.instrument {
  width: calc(100% - 90px - 4px);
}
.emulate {
  display: inline-block;
  margin-right: 4px;
}
.emulating {
  color: red;
  font-weight: bolder;
}
</style>
