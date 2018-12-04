<template>
  <div>
    input device
    <select v-model="input">
      <option
        v-for="input in inputs"
        v-bind:value="input.id"
        :key="input.id"
      >
        {{ input.name }}
      </option>
    </select>
    output device
    <select v-model="output">
      <option
        v-for="output in outputs"
        v-bind:value="output.id"
        :key="output.id"
      >
        {{ output.name }}
      </option>
    </select>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('midi', { inputs: 'getInputs', outputs: 'getOutputs' })
  },
  methods: {
    ...mapActions('midi', ['setDevices'])
  },
  data () {
    return {
      input: '',
      output: ''
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
    }
  }
}
</script>

<style>
</style>
