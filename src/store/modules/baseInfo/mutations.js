import {
    SET_USER_INFO,
    SET_OWN_PROJECTS,
    SET_SUGGESTION_DIALOG,
    GET_SUGGESTION,
    SET_APOLLO_USER
  } from './mutation-types'
  
  export default {
    [SET_USER_INFO](state, payload) {
      state.userInfo = payload
      state.role = payload.role
    },
    [SET_OWN_PROJECTS](state, payload) {
      state.ownProjects = payload
    },
    [SET_SUGGESTION_DIALOG](state, payload) {
      state.suggestionDia = payload
    },
    [GET_SUGGESTION](state, payload) {
      state.feedbacks = payload
    },
    [SET_APOLLO_USER](state, payload) {
      state.apolloUser = payload
    }
  }