<template>
  <div class="tracks">
    <Track
      v-for="track in tracks"
      :key="track.channel"
      :track="track"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Track from './Track'
const { mapGetters } = createNamespacedHelpers('midi')
export default {
  components: {
    Track
  },
  computed: {
    ...mapGetters({ tracks: 'getTracks' })
  }
}
</script>

<style scoped>
.tracks {
  width: 360px;
}

</style>
