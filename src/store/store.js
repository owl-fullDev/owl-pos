import Vue from "vue";
import Vuex from "vuex";
import firebaseAuth from "../../firebase";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    email: "",
    uid: "",
    idToken: null,
    isAdmin: false,
    isBoss: false,
  },
  mutations: {
    setUser(state, user) {
      state.email = user.email;
      state.uid = user.uid;
    },
    setUserRole(state, role) {
      if (role === "admin") {
        state.isAdmin = true;
      } else if (role === "boss") {
        state.isBoss = true;
      }
    },
    setUserIdToken(state, idToken) {
      state.idToken = idToken;
    },
    resetUser(state) {
      state.email = "";
      state.uid = "";
      state.idToken = null;

      state.isAdmin = false;
      state.isBoss = false;
    },
  },
  actions: {
    async logout({ commit }) {
      await firebaseAuth.signOut();
      commit("resetUser");
      localStorage.removeItem("owlHo");
    },
    async login({ dispatch, commit }, form) {
      try {
        // sign user in
        const response = await firebaseAuth.signInWithEmailAndPassword(
          form.email,
          form.password
        );

        let user = {
          email: response.user.email,
          uid: response.user.uid,
        };

        commit("setUser", user);
        return await dispatch("getUserToken");
      } catch (err) {
        console.log(err);
        return err.message;
      }
    },
    async getUserToken({ dispatch, commit }) {
      const idToken = await firebaseAuth.currentUser.getIdToken();
      commit("setUserIdToken", idToken);
      return dispatch("getUserRole");
    },
    async getUserRole({ dispatch, commit }) {
      const idTokenResult = await firebaseAuth.currentUser.getIdTokenResult();
      const { claims } = idTokenResult;
      const acceptedRoles = ["boss", "admin", "store"];

      if (acceptedRoles.includes(claims.role)) {
        commit("setUserRole", claims.role);
        return { user: true };
      } else {
        await dispatch("logout");
        return { user: false };
      }
    },
  },
  getters: {
    loggedIn: (state) => !!state.email && !!state.uid && !!state.idToken,
    isBoss: (state) => state.isBoss,
    isAdmin: (state) => state.isBoss || state.isAdmin,
  },
});
export default store;
