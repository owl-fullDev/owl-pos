<template>
  <div class="container mt-3">
    <div
      v-if="alertMsg"
      class="alert alert-success alert-dismissible fade show"
      role="alert"
    >
      {{ alertMsg }}
      <button
        type="button"
        class="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="row">
      <div class="col">
        <h3>Pending Sales</h3>
        <button
          type="button"
          class="btn btn-light"
          @click="updatePendingSalesList"
        >
          Refresh Pending Sales
        </button>

        <hr />
        <PendingSale
          v-for="sale in pendingSaleList"
          :key="sale.id"
          :transaction-date="sale.initialDepositDate"
          :sale-id="sale.saleId"
          :customer="sale.customer"
          :paid="sale.fullyPaid"
          @selectSale="selectSale"
        />
      </div>
      <div class="col mt-5">
        <PendingSaleDetails
          :pendingSale="selectedSale"
          @resetSelectedSale="resetSelectedSale"
          @updateSale="updateSale"
        />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import PendingSale from "@/components/PendingSale.vue";
import PendingSaleDetails from "../components/PendingSaleDetails.vue";
import _ from "lodash";
import axios from "axios";
import storeData from "@/storeData";

const apiUrl = "https://owl-backend-server.herokuapp.com/posEndpoint";

export default {
  name: "Home",
  data: () => {
    return {
      selectedSale: null,
      pendingSaleList: [],
      alertMsg: "",
    };
  },
  components: {
    PendingSale,
    PendingSaleDetails,
  },
  created() {
    this.updatePendingSalesList();
  },
  methods: {
    updatePendingSalesList() {
      axios
        .get(`${apiUrl}/getPendingSaleList?storeId=${storeData.storeId}`)
        .then((response) => {
          this.pendingSaleList = [...response.data];
        })
        .catch((err) => console.log(err));
    },
    selectSale(saleId) {
      this.selectedSale = _.find(
        this.pendingSaleList,
        (x) => x.saleId === saleId
      );
    },
    resetSelectedSale() {
      this.selectedSale = null;
    },
    updateSale(selectedPaymentType, amountDue) {
      const today = new Date().toISOString();
      let saleDetails = {
        saleId: this.selectedSale.saleId,
        pickUpDate: today,
      };

      if (!this.selectedSale.fullyPaid) {
        saleDetails.finalPaymentDate = today;
        saleDetails.finalPaymentType = selectedPaymentType;
        saleDetails.finalPaymentAmount = parseFloat(amountDue);
      }

      axios
        .post(`${apiUrl}/updateSale?storeId=${storeData.storeId}`, saleDetails)
        .then((response) => {
          this.updatePendingSalesList();
          this.selectedSale = null;
          this.alertMsg = response.data;
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>
