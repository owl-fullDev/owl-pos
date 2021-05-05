<template>
  <div class="container w-50">
    <div class="row">
      <div class="col">
        <h1 class="display-1 mb-3">Login</h1>
        <div
          class="alert alert-danger alert-dismissible fade show"
          v-if="wrongCredentials"
          role="alert"
        >
          Incorrect credentials please try again
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div v-if="loading" class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <form v-else @submit.prevent="login">
          <div class="form-group">
            <label for="usernameInput">Username</label>
            <input
              type="text"
              class="form-control"
              v-model="username"
              id="usernameInput"
              placeholder="Username"
            />
          </div>
          <div class="form-group">
            <label for="passwordInput">Password</label>
            <input
              type="password"
              class="form-control"
              v-model="password"
              id="passwordInput"
              placeholder="Password"
            />
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

const apiUrl = "https://owl-server-5twzqfhlba-et.a.run.app/usersEndpoint";

export default {
  name: "Login",
  data: () => {
    return {
      username: "",
      password: "",
      wrongCredentials: false,
      loading: false,
    };
  },
  methods: {
    login() {
      this.loading = true;
      axios
        .post(`${apiUrl}/login`, {
          username: this.username,
          password: this.password,
        })
        .then((response) => {
          console.log(response);

          const user = {
            username: this.username,
            password: this.password,
            role: response.data,
          };

          this.$store.commit("setUser", user);
          this.loading = false;
          this.$router.push("/");
        })
        .catch((err) => {
          console.log(err.response);
          this.wrongCredentials = true;
          this.loading = false;
        });
    },
  },
};
</script>
<style scoped>
.my-auto {
  margin-top: auto;
  margin-bottom: auto;
}
</style>
