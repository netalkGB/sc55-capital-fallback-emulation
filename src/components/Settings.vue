<template>
  <div>
    input device
    <select v-model="input">
      <option
        v-for="input in inputs"
        v-bind:value="input.name"
        :key="input.id"
      >
        {{ input.name }}
      </option>
    </select>
    output device
    <select v-model="output">
      <option
        v-for="output in outputs"
        v-bind:value="output.name"
        :key="output.id"
      >
        {{ output.name }}
      </option>
    </select>
    <label for="f55m">FORCE 55MAP:</label>
    <input
      type="checkbox"
      id="f55m"
      v-model="force55MAP"
    >
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('midi')

export default {
  computed: {
    ...mapGetters({ inputs: 'getInputs', outputs: 'getOutputs' })
  },
  methods: {
    ...mapActions(['setDevices', 'setForce55MAP'])
  },
  data () {
    return {
      input: '',
      output: '',
      force55MAP: false
    }
  },
  watch: {
    input (newVal) {
      const payload = { input: newVal, output: this.output }
      this.setDevices(payload)
    },
    output (newVal) {
      const payload = { input: this.input, output: newVal }
      this.setDevices(payload)
    },
    force55MAP (newVal) {
      this.setForce55MAP(newVal)
    }
  }
}
</script>

<style>
</style>
