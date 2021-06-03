<template>
  <div v-if="loadTemplate">
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
            {{ sale.customer.lastName }} -
            <strong>
              Pembayaran {{ sale.fullyPaid ? "Sudah" : "Belum" }} Lunas
            </strong>
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
          <li class="list-group-item">
            Sales Remarks:
            <strong> {{ saleRemarks }} </strong>
          </li>
        </ul>

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
            @click="$emit('updateSale', selectedInStorePaymentType, amountDue)"
          >
            Terima Barang
          </button>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="completionModal"
      tabindex="-1"
      data-backdrop="static"
      data-keyboard="false"
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
              v-if="canRefund && !printInvoice"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="printInvoice && canRefund">
              Sale was successfully voided. Please print the invoice
            </div>
            <div v-if="canRefund && !printInvoice">
              <strong>
                Are you sure you want to issue this refund?
              </strong>
              <table class="table table-striped table-hover">
                <thead class="thead-dark">
                  <tr>
                    <th scope="col">Produk</th>
                    <th scope="col">Kuantitas</th>
                    <th scope="col" v-if="canRefund">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in sale.saleDetailList" :key="item.id">
                    <td>{{ item.product.productId }}</td>
                    <td>{{ item.quantity }}</td>
                    <td v-if="canRefund">
                      <div class="form-check">
                        <input
                          :id="`refundCheckbox_${item.product.productId}`"
                          type="checkbox"
                          v-model="item.isReturned"
                          class="form-check-input"
                        />
                        <label
                          :for="`refundCheckbox_${item.product.productId}`"
                          class="form-check-label"
                        >
                          Refund item
                        </label>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <form ref="refundForm">
                <div class="form-group mt-2">
                  <label for="remarks">Remarks</label>
                  <input
                    type="text"
                    v-model.trim="remarks"
                    class="form-control"
                    id="remarks"
                    required
                  />
                </div>
              </form>
            </div>
            <div v-if="!canRefund">
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
                  <div class="form-group">
                    <label for="Payment Type" class="form-label">
                      Jenis Pembayaran
                    </label>
                    <select
                      class="form-control"
                      v-model="selectedInStorePaymentType"
                    >
                      <option value="">Jenis Pembayaran</option>
                      <option v-for="type in inStorePaymentType" :key="type.id">
                        {{ type }}
                      </option>
                    </select>
                  </div>
                  <div
                    v-if="
                      selectedInStorePaymentType != 'Cash' &&
                        selectedInStorePaymentType
                    "
                  >
                    <div class="form-group">
                      <label for="paymentTypeNameInput">Bank Name</label>
                      <input
                        type="text"
                        class="form-control"
                        id="paymentTypeNameInput"
                        v-model.trim="bankName"
                      />
                    </div>
                    <div class="form-group">
                      <label for="accountNumberInput">Account Number</label>
                      <input
                        minlength="4"
                        maxlength="4"
                        type="number"
                        class="form-control"
                        id="accountNumberInput"
                        v-model.number="accountNumber"
                        placeholder="0000"
                        aria-describedby="accountNumberHelp"
                      />
                      <small id="accountNumberHelp" class="form-text text-muted"
                        >This should contain the last 4 digits</small
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              v-if="!printInvoice"
              :disabled="disablePaymentBtn"
              type="button"
              class="btn btn-success"
              @click="confirmAction"
            >
              Confirm
            </button>
            <button
              v-if="printInvoice"
              data-dismiss="modal"
              type="button"
              class="btn btn-primary"
              href="#invoiceModal"
              data-toggle="modal"
            >
              Print invoice
            </button>
          </div>
        </div>
      </div>
    </div>
    <Invoice
      :customer="currentCustomer"
      :employee-name="'some employee name'"
      :products="productIds"
      :payment-type="selectedInStorePaymentType"
      :account-num="accountNumber"
      :total-amt="sale.grandTotal"
      :net-amt="amountDue"
      :deposit-amt="amountDue"
      :discount-percentage="discountPercentage"
      :updated-prescription="prescription"
      :new-sale-id="sale.saleId"
      :fully-paid="true"
      :remarks="saleRemarks"
      @donePrinting="$emit('donePrinting')"
    />
  </div>
</template>
<script>
import Invoice from "@/components/Invoice.vue";
export default {
  name: "SaleDetail",
  props: ["sale", "canRefund", "printInvoice"],
  components: {
    Invoice,
  },
  data: () => {
    return {
      inStorePaymentType: ["Cash", "Debit", "Credit"],
      selectedInStorePaymentType: "",
      remarks: "",
      bankName: "",
      accountNumber: "",
    };
  },
  computed: {
    currentCustomer() {
      return this.sale.customer;
    },
    prescription() {
      if (!this.currentCustomer) return null;

      const {
        leftEyeAxis,
        leftEyeAdd,
        leftEyeCylinder,
        leftEyePrism,
        leftEyeSphere,
        rightEyeAxis,
        rightEyeAdd,
        rightEyeCylinder,
        rightEyePrism,
        rightEyeSphere,
        pupilDistance,
      } = this.currentCustomer;

      return {
        leftEyeAxis,
        leftEyeAdd,
        leftEyeCylinder,
        leftEyePrism,
        leftEyeSphere,
        rightEyeAxis,
        rightEyeAdd,
        rightEyeCylinder,
        rightEyePrism,
        rightEyeSphere,
        pupilDistance,
      };
    },
    discountPercentage() {
      return this.sale.promotion ? this.sale.promotion.percentage : 0;
    },
    loadTemplate() {
      return this.sale != null;
    },
    listTitleClassName() {
      return this.sale.fullyPaid
        ? "list-group-item-success"
        : "list-group-item-danger";
    },
    validPaymentInfo() {
      if (this.selectedInStorePaymentType === "Cash") return true;

      return (
        this.accountNumber &&
        this.bankName &&
        this.accountNumber.toString().length === 4
      );
    },
    disablePaymentBtn() {
      return !this.validPaymentInfo && !this.canRefund;
    },
    amountDue() {
      const amountDue = this.sale.grandTotal - this.sale.initialDepositAmount;

      if (this.canRefund) {
        return amountDue * -1;
      }

      return amountDue;
    },
    totalAmount() {
      let total = this.sale.grandTotal;

      if (this.canRefund) {
        return total * -1;
      }

      return total;
    },
    modalTitle() {
      return this.canRefund ? "Refund Sale" : "Payment";
    },
    saleRemarks() {
      return this.sale.saleRemarks ?? "N/A";
    },
    productIds() {
      let frames = this.sale.saleDetailList
        .filter(({ product }) => product.productId.startsWith("11") || product.productId.startsWith("22"))
        .map(({ product, quantity }) => {
          return {
            productId: product.productId,
            name: product.productName,
            quantity,
          };
        });

      let lenses = this.sale.saleDetailList
        .filter(({ product }) => product.productId.startsWith("33") && !product.productId.startsWith("3301"))
        .map(({ product, quantity }) => {
          return {
            productId: product.productId,
            name: product.productName,
            quantity,
          };
        });

      let customLenses = this.sale.saleDetailList
        .filter(({ product }) => product.productId.startsWith("3301"))
        .map(({ product, quantity }) => {
          return {
            productId: product.productId,
            name: product.productName,
            quantity,
          };
        });

      return {
        frames,
        lenses,
        customLenses,
      };
    },
  },
  methods: {
    isFormValid() {
      if (this.$refs.refundForm) return this.$refs.refundForm.checkValidity();

      return false;
    },
    confirmAction() {
      if (!this.canRefund) {
        let paymentType = this.selectedInStorePaymentType;
        if (this.selectedInStorePaymentType !== "Cash") {
          paymentType += `,${this.bankName},${this.accountNumber}`;
        }
        console.log(paymentType);
        this.$emit("updateSale", paymentType, this.amountDue);
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
.refundCheckbox {
  vertical-align: baseline;
  text-align: center;
}
</style>
