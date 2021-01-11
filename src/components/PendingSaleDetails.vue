<template>
  <div v-if="loadTemplate">
    <transition name="fade">
      <div class="card">
        <div
          class="card-header d-flex justify-content-between align-items-center"
        >
          <div class="div align-self-center">
            <h4>
              Sale Details
            </h4>
          </div>
          <div class="div ">
            <button
              class="btn"
              style="padding-top: 0px !important;"
              @click="$emit('resetSelectedSale')"
            >
              <i class="bi bi-x" style="font-size: 1.5rem;"></i>
            </button>
          </div>
        </div>
        <div class="card-body">
          <ul class="list-group mb-2">
            <li class="list-group-item " :class="listTitleClassName">
              customer name -
              <strong>
                {{ pendingSale.fullyPaid ? "Sudah" : "Belum" }} Bayar
              </strong>
            </li>
            <li class="list-group-item">Sale id: {{ pendingSale.saleId }}</li>
            <li class="list-group-item">
              Initial Deposit Date:
              <strong>
                {{ new Date(pendingSale.initialDepositDate).toDateString() }}
              </strong>
            </li>
            <li class="list-group-item">
              Initial Deposit Type:
              <strong>
                {{ pendingSale.initialDepositType }}
              </strong>
            </li>
            <li class="list-group-item">
              Initial Deposit Amount:
              <strong> Rp {{ pendingSale.initialDepositAmount }} </strong>
            </li>
            <li v-if="!pendingSale.fullyPaid" class="list-group-item">
              Amount Due:
              <strong> Rp {{ amountDue }} </strong>
            </li>
            <li class="list-group-item">
              Grand Total:
              <strong> Rp {{ pendingSale.grandTotal }} </strong>
            </li>
          </ul>
          <table class="table table-striped table-hover">
            <thead class="thead-dark">
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Quantity</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in pendingSale.saleDetailList" :key="item.id">
                <td>{{ item.productId }}</td>
                <td>{{ item.quantity }}</td>
              </tr>
            </tbody>
          </table>
          <button
            v-if="!pendingSale.fullyPaid"
            class="btn btn-primary btn-block"
            data-toggle="modal"
            data-target="#paymentModal"
          >
            Pay now
          </button>
          <button
            v-else
            class="btn btn-success btn-block"
            @click="$emit('updateSale', selectedInStorePaymentType, amountDue)"
          >
            Pick-up
          </button>
        </div>
      </div>
    </transition>
    <div
      class="modal fade"
      id="paymentModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="continueToPaymentBtn"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Payment</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div>
              <div class="row mb-3">
                <div class="col">
                  <label for="paymentAmount" class="form-label">
                    Payment Amount
                  </label>
                  <input
                    type="text"
                    readonly
                    :value="amountDue"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <div class="col">
                  <label for="paymentType" class="form-label">
                    Payment Type
                  </label>
                  <select
                    class="form-control"
                    v-model="selectedInStorePaymentType"
                  >
                    <option disabled selected value=""
                      >Select Payment Type</option
                    >
                    <option v-for="type in inStorePaymentType" :key="type.id">
                      {{ type }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancel
            </button>
            <button
              :disabled="disablePaymentBtn"
              type="button"
              data-dismiss="modal"
              class="btn btn-success"
              @click="
                $emit('updateSale', selectedInStorePaymentType, amountDue)
              "
            >
              Pay now
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "PendingSaleDetail",
  props: ["pendingSale"],
  data: () => {
    return {
      inStorePaymentType: ["Cash", "Debit", "Credit"],
      selectedInStorePaymentType: "",
    };
  },
  computed: {
    loadTemplate() {
      return this.pendingSale != null;
    },
    listTitleClassName() {
      return this.pendingSale.fullyPaid
        ? "list-group-item-success"
        : "list-group-item-danger";
    },
    disablePaymentBtn() {
      return this.selectedInStorePaymentType === "";
    },
    amountDue() {
      return (
        this.pendingSale.grandTotal - this.pendingSale.initialDepositAmount
      ).toFixed(2);
    },
  },
};
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
