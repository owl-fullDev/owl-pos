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

export default {
  name: "Home",
  data: () => {
    return {
      stores: [],
      storeId: "",
    };
  },
  created() {
    axios
      .get("/posEndpoint/getAllStores")
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

      const data = {
        storeName,
        storePhoneNum: phoneNumber,
        storeId: this.storeId,
        storeAddress: address,
      };

      window.storeInfo.persistInfo(data);

      this.$router.push("PendingSales");
    },
  },
};
</script>
