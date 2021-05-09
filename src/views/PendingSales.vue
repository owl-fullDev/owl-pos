<template>
  <div class="container mt-3">
    <div
      v-if="showAlert"
      class="alert alert-dismissible fade show"
      :class="alertClass"
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
        <h3>Penjualan Pending</h3>
        <button
          type="button"
          class="btn btn-light"
          @click="updatePendingSalesList"
        >
          Refresh Semua Penjualan
        </button>

        <hr />
        <div v-if="loading" class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <div v-else style="height: 700px; overflow-y: auto;">
          <Sale
            v-for="sale in pendingSaleList"
            :key="sale.id"
            :transaction-date="sale.initialDepositDate"
            :sale-id="sale.saleId"
            :customer="sale.customer"
            :paid="sale.fullyPaid"
            @selectSale="selectSale"
          />
        </div>
      </div>
      <div class="col mt-5">
        <SaleDetails
          :sale="selectedSale"
          :print-invoice="printInvoice"
          @resetSelectedSale="resetSelectedSale"
          @updateSale="updateSale"
          @donePrinting="updatePendingSalesList(false)"
        />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Sale from "@/components/Sale.vue";
import SaleDetails from "../components/SaleDetails.vue";
import _ from "lodash";
import axios from "axios";
import storeData from "@/storeData";

const apiUrl = "https://owl-pos-api.herokuapp.com/posEndpoint";

export default {
  name: "PendingSales",
  data: () => {
    return {
      selectedSale: null,
      pendingSaleList: [],
      alertMsg: "",
      showAlert: false,
      loading: true,
      alertClass: "alert-info",
      printInvoice: false,
    };
  },
  components: {
    Sale,
    SaleDetails,
  },
  created() {
    this.updatePendingSalesList();
  },
  methods: {
    updatePendingSalesList(showQuantityMsg = true) {
      this.resetSelectedSale();
      this.loading = true;
      axios
        .get(`${apiUrl}/getPendingSaleList?storeId=${storeData.storeId}`)
        .then((response) => {
          if (showQuantityMsg) {
            if (response.data.length === 0) {
              this.alertMsg = "No pending sales";
              this.alertClass = "alert-warning";
            } else {
              this.alertMsg = `Received ${response.data.length} pending sales`;
              this.alertClass = "alert-success";
            }
          }
          this.loading = false;
          this.pendingSaleList = [...response.data];
          this.showAlert = true;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          this.alertMsg = err.response.data;
          this.alertClass = "alert-danger";
        });
    },
    selectSale(saleId) {
      this.selectedSale = _.find(
        this.pendingSaleList,
        (x) => x.saleId === saleId
      );
    },
    resetSelectedSale() {
      this.selectedSale = null;
      this.printInvoice = false;
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
          if (!this.selectedSale.fullyPaid) {
            alert(`${response.data}. Please print the invoice.`);
            this.printInvoice = true;
          } else {
            this.updatePendingSalesList(false);
          }
          this.alertMsg = response.data;
          this.alertClass = "alert-success";
        })
        .catch((err) => {
          console.log(err);
          alert("Sale could not be updated please try again");
          this.alertMsg = "Sale could not be updated please try again";
          this.alertClass = "alert-warning";
        });
    },
  },
};
</script>
