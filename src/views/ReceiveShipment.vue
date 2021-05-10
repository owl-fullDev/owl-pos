<template>
  <div class="container-fluid mt-2">
    <h1>Terima Kiriman</h1>
    <hr />
    <div class="row mb-3">
      <div class="col">
        <label for="barcode">Scan barcode</label>
        <input
          type="number"
          min="1"
          id="barcode"
          v-model.number="barcode"
          class="form-control"
        />
      </div>
    </div>
    <div class="row ">
      <div class="col d-flex justify-content-center">
        <button :disabled="disableBtn" class="btn btn-primary" @click="confirm">
          Cek kode kiriman
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import storeData from "@/storeData";

export default {
  name: "ReceiveShipments",
  data: () => {
    return {
      barcode: null,
    };
  },
  computed: {
    disableBtn() {
      return !this.barcode ? true : false;
    },
  },
  methods: {
    confirm() {
      axios
        .post("/posEndpoint/receiveShipment", {
          storeId: storeData.storeId,
          shipmentId: this.barcode,
          receivedDate: new Date().toISOString(),
        })
        .then((response) => {
          alert(response.data);
          this.barcode = null;
        })
        .catch((err) => {
          alert(
            `Server error: ${err.response.data.message} . Please try again`
          );
        });
    },
  },
};
</script>
