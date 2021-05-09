<template>
  <div class="container mt-3 text-center">
    <h1>Pilih toko</h1>
    <select class="custom-select custom-select-lg mb-3" v-model="storeId">
      <option value="" selected disabled>Pilih toko</option>
      <option v-for="store in stores" :key="store.id" :value="store.storeId">
        {{ store.name }}
      </option>
    </select>
    <button v-if="storeId" class="btn btn-success btn-lg" @click="selectStore">
      Pilih Toko
    </button>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import storeData from "@/storeData";
const apiUrl =
  "https://owl-server-5twzqfhlba-et.a.run.app/posEndpoint/getAllStores";

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
      const { name: storeName, phoneNumber, address } = this.stores.find(
        (s) => s.storeId == this.storeId
      );
      storeData.storeName = storeName;
      storeData.storePhoneNum = phoneNumber;
      storeData.storeAddress = address;

      this.$router.push("PendingSales");
    },
  },
};
</script>
