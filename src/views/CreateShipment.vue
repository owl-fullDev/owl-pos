<template>
  <div class="container-fluid mt-2">
    <h1>Buat Kiriman antar toko</h1>
    <hr />
  </div>
</template>
<script>
import axios from "axios";
import storeData from "@/storeData";

// // prettier-ignore
const apiUrl =
  "https://owl-backend-server.herokuapp.com/posEndpoint/receiveShipment";

export default {
  name: "CreateShipment",
  data: () => {
    return {
      barcode: null,
    };
  },
  computed: {

  },
  methods: {
    confirm() {
      axios
        .post(apiUrl, {
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
