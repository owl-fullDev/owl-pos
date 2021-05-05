import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    username: "",
    password: "",
    isAdmin: false,
    isBoss: false,
  },
  mutations: {
    setUser(state, user) {
      state.username = user.username;
      state.password = user.password;
      if (user.role === "admin") {
        state.isAdmin = true;
      } else if (user.role === "boss") {
        state.isBoss = true;
      }
    },
    logout(state) {
      state.username = "";
      state.password = "";
      state.isAdmin = false;
      state.isBoss = false;
    },
  },
  getters: {
    loggedIn: (state) => !!state.username && !!state.password,
    isBoss: (state) => state.isBoss,
    isAdmin: (state) => state.isBoss || state.isAdmin,
  },
});
export default store;
