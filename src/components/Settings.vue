<template>
  <div class="settings">
    <div class="item">
      <div class="label">Input:</div>
      <select v-model="input">
        <option
          v-for="input in inputs"
          v-bind:value="input.name"
          :key="input.id"
        >
          {{ input.name }}
        </option>
      </select>
    </div>
    <div class="item">
      <div class="label">Output:</div>
      <select v-model="output">
        <option
          v-for="output in outputs"
          v-bind:value="output.name"
          :key="output.id"
        >
          {{ output.name }}
        </option>
      </select>
    </div>
    <div class="item">
      <label for="f55m">FORCE 55MAP:</label>
      <input
        type="checkbox"
        id="f55m"
        v-model="force55MAP"
      >
    </div>
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

<style scoped>
.settings {
  display: flex;
  flex-wrap: wrap;
}
.label {
  width: 50px;
}
.item {
  display: flex;
  margin: 4px;
}
</style>
