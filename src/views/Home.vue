<template>
  <div class="container mt-3 text-center">
    <h1>Select Store</h1>
    <select class="custom-select custom-select-lg mb-3" v-model="storeId">
      <option value="" selected disabled>Select store</option>
      <option v-for="store in stores" :key="store.id" :value="store.storeId">
        {{ store.location }}
      </option>
    </select>
    <button v-if="storeId" class="btn btn-success btn-lg" @click="selectStore">
      Select store
    </button>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import storeData from "@/storeData";
const apiUrl =
  "https://owl-backend-server.herokuapp.com/hoStoresEndpoint/getAllStores";

export default {
  name: "Home",
  data: () => {
    return {
      stores: [],
      storeId: "",
    };
  },
  components: {},
  created() {
    axios
      .get(`${apiUrl}`)
      .then((response) => {
        this.stores = [...response.data];
      })
      .catch((err) => console.log(err));
  },
  methods: {
    selectStore() {
      storeData.storeId = this.storeId;
      this.$router.push("PendingSales");
    },
  },
};
</script>
