<template>
  <div class="container w-50">
    <div class="row">
      <div class="col">
        <h1 class="display-1 mb-3">POS Login</h1>
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
            <label for="emailInput">Email</label>
            <input
              type="text"
              class="form-control"
              v-model="email"
              id="emailInput"
              placeholder="Email"
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
export default {
  name: "Login",
  data: () => {
    return {
      email: "",
      password: "",
      wrongCredentials: false,
      loading: false,
    };
  },
  methods: {
    login() {
      this.loading = true;
      this.$store
        .dispatch("login", {
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          if (!response.user) {
            this.wrongCredentials = true;
          } else {
            this.$router.push("/");
          }
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
