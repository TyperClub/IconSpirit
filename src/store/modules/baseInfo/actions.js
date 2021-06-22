import {
    SET_BREADCRUMB,
    SET_USER_INFO,
    SET_SUGGESTION_DIALOG,
    SET_APOLLO_USER
  } from './mutation-types'
  
  export default {
    setBreadcrumb({ commit }, payload) {
      commit(SET_BREADCRUMB, payload)
    },
    setUserInfo({ commit }, payload) {
      commit(SET_USER_INFO, payload)
    },
    setSuggestionDialog({ commit }, payload) {
      commit(SET_SUGGESTION_DIALOG, payload)
    },
    setApolloUser({ commit }, payload) {
      commit(SET_APOLLO_USER, payload)
    }
  }