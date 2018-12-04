import Vue from 'vue'
import Vuex from 'vuex'
import midi from './stores/midi'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    midi
  }
})
