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
const { mapGetters, mapActions, mapState } = createNamespacedHelpers('midi')

export default {
  computed: {
    ...mapGetters({ inputs: 'getInputs', outputs: 'getOutputs', getForce55MAP: 'getForce55MAP' }),
    ...mapState(['currentInputName', 'currentOutputName']),
    force55MAP: {
      get () {
        return this.getForce55MAP
      },
      set (val) {
        this.setForce55MAP(val)
      }
    },
    input: {
      get () {
        return this.currentInputName
      },
      set (val) {
        const payload = { input: val, output: this.output }
        this.setDevices(payload)
      }
    },
    output: {
      get () {
        return this.currentOutputName
      },
      set (val) {
        const payload = { input: this.input, output: val }
        this.setDevices(payload)
      }
    }
  },
  methods: {
    ...mapActions(['setDevices', 'setForce55MAP'])
  }
}
</script>

<style>
</style>
