<template>
  <div v-if="loadTemplate">
    <transition name="fade">
      <div class="card">
        <div
          class="card-header d-flex justify-content-between align-items-center"
        >
          <div class="div align-self-center">
            <h4>
              Detail Penjualan
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
              {{ sale.customer.firstName }}
              {{ sale.customer.lastName }}-
              <strong> Pembayaran {{ sale.fullyPaid ? "Sudah" : "Belum" }} Lunas </strong>
            </li>
            <li class="list-group-item">ID Penjualan: {{ sale.saleId }}</li>
            <li class="list-group-item">
              Tanggal Deposit Awal:
              <strong>
                {{ new Date(sale.initialDepositDate).toDateString() }}
              </strong>
            </li>
            <li class="list-group-item">
              Jenis Deposit Awal:
              <strong>
                {{ sale.initialDepositType }}
              </strong>
            </li>
            <li class="list-group-item">
              Jumlah Deposit Awal:
              <strong> Rp {{ sale.initialDepositAmount }} </strong>
            </li>
            <li v-if="!sale.fullyPaid" class="list-group-item">
              Jumlah Sisa:
              <strong> Rp {{ amountDue }} </strong>
            </li>
            <li class="list-group-item">
               Harga Total:
              <strong> Rp {{ sale.grandTotal }} </strong>
            </li>
          </ul>
          <table class="table table-striped table-hover">
            <thead class="thead-dark">
              <tr>
                <th scope="col">Produk</th>
                <th scope="col">Kuantitas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in sale.saleDetailList" :key="item.id">
                <td>{{ item.product.productId }}</td>
                <td>{{ item.quantity }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="canRefund">
            <button
              class="btn btn-danger btn-block"
              data-toggle="modal"
              data-target="#completionModal"
            >
              Refund Sale
            </button>
          </div>
          <div v-else>
            <button
              v-if="!sale.fullyPaid"
              class="btn btn-primary btn-block"
              data-toggle="modal"
              data-target="#completionModal"
            >
              Bayar dan Terima
            </button>
            <button
              v-else
              class="btn btn-success btn-block"
              @click="
                $emit('updateSale', selectedInStorePaymentType, amountDue)
              "
            >
              Terima Barang
            </button>
          </div>
        </div>
      </div>
    </transition>
    <div
      class="modal fade"
      id="completionModal"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalTitle }}</h5>
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
            <div v-if="canRefund">
              <strong>
                Are you sure you want to issue this refund?
              </strong>
              <form ref="refundForm">
                <div class="form-group mt-2">
                  <label for="remarks">Remarks</label>
                  <input type="text" v-model.trim="remarks" class="form-control" id="remarks" required>
                </div>
              </form>
            </div>
            <div v-else>
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
              :data-dismiss="isFormValid() ? 'modal' : ''"
              class="btn btn-success"
              @click="confirmAction"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "SaleDetail",
  props: ["sale", "canRefund"],
  data: () => {
    return {
      inStorePaymentType: ["Cash", "Debit", "Credit"],
      selectedInStorePaymentType: "",
      remarks: ""
    };
  },
  computed: {
    loadTemplate() {
      return this.sale != null;
    },
    listTitleClassName() {
      return this.sale.fullyPaid
        ? "list-group-item-success"
        : "list-group-item-danger";
    },
    disablePaymentBtn() {
      return this.selectedInStorePaymentType === "" && !this.canRefund;
    },
    amountDue() {
      return (this.sale.grandTotal - this.sale.initialDepositAmount).toFixed(2);
    },
    modalTitle() {
      return this.canRefund ? "Refund Sale" : "Payment";
    },
  },
  methods: {
    isFormValid() {
      if (this.$refs.refundForm)
        return this.$refs.refundForm.checkValidity();

      return false;
    },
    confirmAction() {
      if (!this.canRefund) {
        this.$emit(
          "updateSale",
          this.selectedInStorePaymentType,
          this.amountDue
        );
      } else {
        if (!this.isFormValid()) {
          this.$refs.refundForm.reportValidity();
          return;
        } else {
          this.$emit("updateSale", this.remarks);
        }
      }
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
