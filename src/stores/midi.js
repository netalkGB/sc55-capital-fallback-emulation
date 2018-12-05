import Track from '../others/Track'
import instruments from '../others/instruments'

export default {
  namespaced: true,
  state: {
    tracks: [],
    availableInputs: [],
    availableOutputs: [],
    currentOutputName: null,
    currentInputName: null,
    force55MAP: false
  },
  getters: {
    getTracks: (state) => state.tracks,
    getInputs: (state) => state.availableInputs,
    getOutputs: (state) => state.availableOutputs,
    getCurrentInputDevice: (state) => state.availableInputs.find(input => input.name === state.currentInputName),
    getCurrentOutputDevice: (state) => state.availableOutputs.find(output => output.name === state.currentOutputName),
    getForce55MAP: (state) => state.force55MAP
  },
  mutations: {
    initTracks (state) {
      state.tracks = []
      for (let i = 0; i < 16; i++) {
        state.tracks = [...state.tracks, Track.makePart({ bankMSB: 0, bankLSB: 0, programNumber: 0, channel: i + 1 })]
      }
    },
    setIO (state, access) {
      const inputIterator = access.inputs.values()
      let inputs = []
      let outputs = []
      for (let o = inputIterator.next(); !o.done; o = inputIterator.next()) {
        inputs = [...inputs, o.value]
      }
      const outputIterator = access.outputs.values()
      for (let o = outputIterator.next(); !o.done; o = outputIterator.next()) {
        outputs = [...outputs, o.value]
      }
      state.availableInputs = inputs
      state.availableOutputs = outputs
    },
    setCurrentIO (state, payload) {
      const { input, output } = payload
      state.currentInputName = input
      state.currentOutputName = output
    },
    setProgramChange (state, payload) {
      const { channel, number } = payload
      state.tracks[channel].setProgramChange(number)
    },
    setBankSelectMSB (state, payload) {
      const { channel, parameter } = payload
      state.tracks[channel].setBankSelectMSB(parameter)
    },
    setBankSelectLSB (state, payload) {
      const { channel, parameter } = payload
      state.tracks[channel].setBankSelectLSB(parameter)
    },
    resetAllDevices (state) {
      state.availableInputs.map(i => { i.onmidimessage = null })
    },
    setIsDrum (state, { channel, isDrum }) {
      state.tracks[channel].setIsDrum(isDrum)
    },
    setForce55MAP (state, force55MAP) {
      state.force55MAP = force55MAP
    }
  },
  actions: {
    async bootstrap ({ commit, dispatch }) {
      commit('initTracks')
      await dispatch('getDevices')
    },
    getDevices ({ commit }) {
      return new Promise((resolve, reject) => {
        function s (access) {
          commit('setIO', access)
          resolve()
        }
        function f (e) {
          reject(e)
        }
        if (navigator.requestMIDIAccess === undefined) {
          reject(new Error('This browser is not support web midi api.'))
        }
        navigator.requestMIDIAccess({ sysex: true }).then(s, f)
      })
    },
    setDevices (ctx, payload) {
      const { commit, dispatch } = ctx
      commit('setCurrentIO', payload)
      dispatch('start')
    },
    setForce55MAP ({ commit, dispatch, getters }, f55m) {
      commit('setForce55MAP', f55m)
      const midiOutput = getters['getCurrentOutputDevice']
      const midiInput = getters['getCurrentInputDevice']
      if (!midiOutput || !midiInput) {
        return
      }
      dispatch('sendForce55MAP')
    },
    sendForce55MAP ({ getters }) {
      const midiOutput = getters['getCurrentOutputDevice']
      const tracks = getters['getTracks']
      for (let i = 0; i < 16; i++) {
        const track = tracks[i]
        const { programChangeNumber } = track
        const BSCh = 0xB0 + i
        const PCCh = 0xC0 + i
        const bankSelectLSB = getters['getForce55MAP'] ? 1 : 0
        midiOutput.send([BSCh, 0x20, bankSelectLSB])
        midiOutput.send([PCCh, programChangeNumber])
      }
    },
    start ({ getters, commit, dispatch }) {
      commit('initTracks')
      const midiInput = getters['getCurrentInputDevice']
      const midiOutput = getters['getCurrentOutputDevice']
      commit('resetAllDevices')
      if (!midiInput || !midiOutput) {
        return
      }
      dispatch('sendForce55MAP')
      midiInput.onmidimessage = function (ev) {
        const { data } = ev

        const gmSystemOn = [0xF0, 0x7E, 0x7F, 0x09, 0x01, 0xF7]
        if (compareArray(gmSystemOn, data)) {
          commit('initTracks')
        }

        const gsReset = [0xF0, 0x41, 0x10, 0x42, 0x12, 0x40, 0x00, 0x7F, 0x00, 0x41, 0xF7]
        if (compareArray(gsReset, data)) {
          commit('initTracks')
        }

        const systemModeSet1 = [0xF0, 0x41, 0x10, 0x42, 0x12, 0x00, 0x00, 0x7F, 0x00, 0x01, 0xF7]
        if (compareArray(systemModeSet1, data)) {
          commit('initTracks')
        }

        const systemModeSet2 = [0xF0, 0x41, 0x10, 0x42, 0x12, 0x00, 0x00, 0x7F, 0x01, 0x00, 0xF7]
        if (compareArray(systemModeSet2, data)) {
          commit('initTracks')
        }

        const xgReset = [0xF0, 0x43, 0x10, 0x4C, 0x00, 0x00, 0x7E, 0x00, 0xF7]
        if (compareArray(xgReset, data)) {
          commit('initTracks')
        }

        if (data.length === 2) {
          if (data[0] >= 0xC0 && data[0] <= 0xCF) {
            const channel = data[0] - 0xC0
            const number = data[1]
            commit('setProgramChange', { channel, number })
            dispatch('sendEmulatedData', channel)
            return
          }
        } else if (data.length === 3) {
          if (data[0] >= 0xB0 && data[0] <= 0xBF) {
            const channel = data[0] - 0xB0
            const parameter = data[2]
            if (data[1] === 0x00) {
              commit('setBankSelectMSB', { channel, parameter })
            } else if (data[1] === 0x20) {
              commit('setBankSelectLSB', { channel, parameter })
            }
          }
        } else if (data.length === 11) {
          if (data[0] === 0xF0 && data[10] === 0xf7) {
            const hasChecksumError = !checkSysExChecksum(data)
            const isRolandGS = data[1] === 0x41 && data[2] === 0x10 && data[3] === 0x42 && data[4] === 0x12
            if (isRolandGS === true) {
              if (hasChecksumError === false) {
                const a = data[5]
                const b = data[6]
                const c = data[7]
                const d = data[8]
                if (a === 0x40 && c === 0x15) {
                  let partNum
                  if (b >= 0x11 && b <= 0x19) {
                    partNum = b - 0x10
                  } else if (b >= 0x1A && b <= 0x1F) {
                    partNum = b - 0x10 + 1
                  } else {
                    partNum = 10
                  }
                  const channel = partNum - 1
                  const isDrum = d > 0
                  commit('setIsDrum', { channel, isDrum })
                }
                console.log('SysEx: ' + data)
              } else {
                console.log('%c[CHECKSUM ERROR] SysEx: ' + data, 'color:red;')
              }
            }
          }
        }
        midiOutput.send(data)
      }
    },
    sendEmulatedData ({ getters }, channel) {
      const midiOutput = getters['getCurrentOutputDevice']
      const tracks = getters['getTracks']
      const track = tracks[channel]
      const { bankSelectMSB, bankSelectLSB, programChangeNumber } = track
      const PCCh = 0xC0 + channel
      const BSCh = 0xB0 + channel
      const instrument = instruments[programChangeNumber + 1][bankSelectMSB]
      const BSLParam = getters['getForce55MAP'] ? 0x01 : bankSelectLSB
      const BSMParam = !instrument ? 0x00 : bankSelectMSB
      midiOutput.send([BSCh, 0x20, BSLParam])
      midiOutput.send([BSCh, 0x00, BSMParam])
      midiOutput.send([PCCh, programChangeNumber])
      console.log(`%cEmulate: Channel: ${channel + 1}, Bank Select LSB: ${BSLParam}, Bank Select MSB${!instrument ? '(fake)' : ''}: ${BSMParam}, Program Change: ${programChangeNumber}`, 'color: blue;')
    }
  }
}

function compareArray (arrA, arrB) {
  if (arrA.length !== arrB.length) {
    return false
  }
  let result = true
  for (let i = 0; i < arrA.length; i++) {
    if (arrA[i] !== arrB[i]) {
      result = false
      break
    }
  }
  return result
}

function calcChecksum (d) {
  const a = d[5]
  const b = d[6]
  const c = d[7]
  const data = d[8]
  const result = 0x80 - (a + b + c + data) % 0x80
  return result
}

function checkSysExChecksum (d) {
  const checksum = d[9]
  return checksum === calcChecksum(d)
}
