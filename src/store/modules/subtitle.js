import { parseJson, buildPreview } from '@/services/subtitleService'

export default {
  namespaced: true,
  state: () => ({
    inputJson: '',
    parsedSubs: [],
    error: null,
    outputFormat: 'srt',
    timeOffset: 0,
    previewText: '',
    showToast: false,
    toastMessage: ''
  }),
  mutations: {
    setInputJson(state, value) {
      state.inputJson = value
    },
    setParsedSubs(state, subs) {
      state.parsedSubs = subs
    },
    setError(state, error) {
      state.error = error
    },
    setOutputFormat(state, format) {
      state.outputFormat = format
    },
    setTimeOffset(state, offset) {
      state.timeOffset = offset
    },
    setPreviewText(state, text) {
      state.previewText = text
    },
    setShowToast(state, value) {
      state.showToast = value
    },
    setToastMessage(state, message) {
      state.toastMessage = message
    }
  },
  actions: {
    updateInputJson({ commit, dispatch }, value) {
      commit('setInputJson', value)
      if (!value.trim()) {
        commit('setParsedSubs', [])
        commit('setError', null)
        commit('setPreviewText', '')
        return
      }
      try {
        const subs = parseJson(value)
        commit('setParsedSubs', subs)
        commit('setError', null)
        dispatch('updatePreview')
      } catch (e) {
        commit('setParsedSubs', [])
        commit('setError', e.message || String(e))
        commit('setPreviewText', '')
      }
    },
    changeOutputFormat({ commit, dispatch }, format) {
      commit('setOutputFormat', format)
      dispatch('updatePreview')
    },
    changeTimeOffset({ commit, dispatch }, offset) {
      commit('setTimeOffset', offset)
      dispatch('updatePreview')
    },
    updatePreview({ state, commit }) {
      if (!state.parsedSubs.length) {
        commit('setPreviewText', '')
        return
      }
      const text = buildPreview(state.parsedSubs, state.outputFormat, state.timeOffset)
      commit('setPreviewText', text)
    },
    showToast({ commit }, message) {
      commit('setToastMessage', message)
      commit('setShowToast', true)
      setTimeout(() => {
        commit('setShowToast', false)
      }, 5000)
    }
  }
}
