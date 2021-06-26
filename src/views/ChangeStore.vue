<template>
  <div class="container w-50">
    <div class="row">
      <div class="col">
        <div class="form-group">
          <label for="accessToken">Access Token</label>
          <input
            id="accessToken"
            type="text"
            class="form-control"
            v-model.trim="accessToken"
          />
        </div>
        <button type="button" class="btn btn-primary" @click="changeStoreInfo">
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ChangeStore",
  data: () => {
    return {
      accessToken: "",
    };
  },
  methods: {
    changeStoreInfo() {
      if (!this.accessToken) {
        alert("Please enter an access token");
        return;
      }

      axios
        .get(
          `https://ho-api-dot-owl-system.et.r.appspot.com/hoChangeStoreEndpoint/submitChangeStoreToken?changeStoreToken=${this.accessToken}`
        )
        .then((response) => {
          const {
            name: storeName,
            phoneNumber,
            address,
            storeId,
          } = response.data;
          const data = {
            storeName,
            storePhoneNum: phoneNumber,
            storeId,
            storeAddress: address,
          };

          window.storeInfo.persistInfo(data);
          this.$store.dispatch("logout").then(() => {
            this.$router.push("/login");
          });
        })
        .catch((err) => {
          console.log(err.response);
          alert("Incorrect token, please try again");
        });
    },
  },
};
</script>
