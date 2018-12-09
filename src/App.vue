<template>
  <div id="app">
    <Main />
  </div>
</template>

<script>
import Main from './components/Main.vue'

export default {
  name: 'app',
  components: {
    Main
  }
}
</script>

<style>
html,body,select {
  color: #333333;
  font-size: 12px;
  user-select: none;
}
</style>
