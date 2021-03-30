<template>
  <div v-if="renderData">
    <!-- Invoice Modal -->
    <div
      class="modal fade"
      id="invoiceModal"
      data-backdrop="static"
      data-keyboard="false"
      tabindex="-1"
      aria-labelledby="invoiceModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="invoiceModalLabel">Print Invoice</h5>
          </div>
          <div class="modal-body">
            <div id="invoiceSetup">
              <div class="container-fluid">
                <div class="row mb-3">
                  <div class="col">
                    <div class="row">
                      <div class="col">
                        <h3>OWL EYEWEAR INDONESIA</h3>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col">
                        <p>
                          {{ storeAddress }}
                        </p>
                      </div>
                    </div>
                    <div class="row mt-2">
                      <div class="col">Tel: {{ storePhoneNum }}</div>
                    </div>
                  </div>
                </div>
                <div class="row mb-5">
                  <div class="col">
                    <h3 class="text-center">{{ headerText }}</h3>
                  </div>
                </div>
                <div class="row mb-5 justify-content-around">
                  <div class="col-4">
                    <div class="row ">
                      <div class="col-6">
                        <p>Customer Name:</p>
                      </div>
                      <div class="col-md-auto text-right">
                        <span class="align-middle">
                          {{ customerName }}
                        </span>
                      </div>
                    </div>
                    <div class="row ">
                      <div class="col-6">
                        <p>Customer Contact:</p>
                      </div>
                      <div class="col-md-auto text-right">
                        <span class="align-middle">
                          {{ customer.phoneNumber }}
                        </span>
                      </div>
                    </div>
                    <div class="row ">
                      <div class="col-6">
                        <p>Customer Email:</p>
                      </div>
                      <div class="col-md-auto text-right">
                        <span class="align-middle">
                          {{ customer.email }}
                        </span>
                      </div>
                    </div>
                    <div class="row ">
                      <div class="col-6">
                        <p>Customer Id:</p>
                      </div>
                      <div class="col-md-auto text-right">
                        <span class="align-middle">
                          {{ customer.customerId }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="col-5">
                    <div class="row ">
                      <div class="col-6">
                        <p>Invoice No:</p>
                      </div>
                      <div class="col-md-auto text-right">
                        <span class="align-middle">
                          {{ newSaleId }}
                        </span>
                      </div>
                    </div>
                    <div class="row ">
                      <div class="col-6">
                        <p>Date:</p>
                      </div>
                      <div class="col-md-auto text-right">
                        <span class="align-middle">
                          {{ currentDate }}
                        </span>
                      </div>
                    </div>
                    <div class="row ">
                      <div class="col-6">
                        <p>Salesman:</p>
                      </div>
                      <div class="col-md-auto text-right">
                        <span class="align-middle">
                          {{ employeeName }}
                        </span>
                      </div>
                    </div>
                    <div class="row ">
                      <div class="col-6">
                        <p>Shop Name:</p>
                      </div>
                      <div class="col-md-auto text-right">
                        <span class="align-middle">
                          {{ storeName }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="frame in products.frames" :key="frame.id">
                          <th scope="row">{{ frame.productId }}</th>
                          <td>{{ frame.name }}</td>
                          <td>{{ frame.quantity }}</td>
                        </tr>
                        <tr v-for="lens in products.lenses" :key="lens.id">
                          <th scope="row">{{ lens.productId }}</th>
                          <td>{{ lens.name }}</td>
                          <td>{{ lens.quantity }}</td>
                        </tr>
                        <tr
                          v-for="lens in products.customLenses"
                          :key="lens.id"
                        >
                          <th scope="row">{{ lens.productId }}</th>
                          <td>{{ lens.name }}</td>
                          <td>{{ lens.quantity }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <hr />
                <div class="row justify-content-between">
                  <div class="col-7">
                    <table class="table table-borderless">
                      <thead>
                        <tr>
                          <th>Pay Type</th>
                          <th>No</th>
                          <th>Amount</th>
                          <th>Change Amount</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{{ paymentType }}</td>
                          <td>{{ accountNum }}</td>
                          <td>RP {{ formatNumber(totalAmt) }}</td>
                          <td>0</td>
                          <td>{{ numOfProducts }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="col-4">
                    <div class="row mt-3 justify-content-between">
                      <div class="col-6 text-right">
                        <p>Total Amt:</p>
                      </div>
                      <div class="col-md-auto text-right">
                        <span class="align-middle">
                          RP {{ formatNumber(totalAmt) }}
                        </span>
                      </div>
                    </div>
                    <div class="row justify-content-between">
                      <div class="col-6 text-right">
                        <p>Discount:</p>
                      </div>
                      <div class="col-md-auto text-right">
                        <span class="align-middle">
                          {{ discountPercentage }}%
                        </span>
                      </div>
                    </div>
                    <div class="row justify-content-between ">
                      <div class="col-6 text-right">
                        <p>Net Amt:</p>
                      </div>
                      <div class="col-md-auto text-right">
                        <span class="align-middle">
                          RP {{ formatNumber(netAmt) }}
                        </span>
                      </div>
                    </div>
                    <div class="row justify-content-between">
                      <div class="col-6 text-right">
                        <p>Deposit Amt:</p>
                      </div>
                      <div class="col-md-auto text-right">
                        <span class="align-middle">
                          RP {{ formatNumber(depositAmt) }}
                        </span>
                      </div>
                    </div>
                    <div class="row justify-content-between">
                      <div class="col-6 text-right">
                        <p>Balance Amt:</p>
                      </div>
                      <div class="col-md-auto text-right">
                        <span class="align-middle">
                          RP {{ formatNumber(balanceAmt) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row mt-5" v-if="renderPrescription">
                  <div class="col">
                    <table class="table table-sm table-bordered">
                      <thead>
                        <tr>
                          <th></th>
                          <th>SPH</th>
                          <th>CYL</th>
                          <th>AXIS</th>
                          <th>ADD</th>
                          <th>P.Height</th>
                          <th>PD</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>OLD RX (R)</td>
                          <td>{{ customer.rightEyeSphere }}</td>
                          <td>{{ customer.rightEyeCylinder }}</td>
                          <td>{{ customer.rightEyeAxis }}</td>
                          <td>{{ customer.rightEyeAdd }}</td>
                          <td>{{ customer.rightEyePrism }}</td>
                          <td>{{ customer.pupilDistance }}</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>OLD RX (L)</td>
                          <td>{{ customer.leftEyeSphere }}</td>
                          <td>{{ customer.leftEyeCylinder }}</td>
                          <td>{{ customer.leftEyeAxis }}</td>
                          <td>{{ customer.leftEyeAdd }}</td>
                          <td>{{ customer.leftEyePrism }}</td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>New RX (R)</td>
                          <td>{{ updatedPrescription.rightEyeSphere }}</td>
                          <td>{{ updatedPrescription.rightEyeCylinder }}</td>
                          <td>{{ updatedPrescription.rightEyeAxis }}</td>
                          <td>{{ updatedPrescription.rightEyeAdd }}</td>
                          <td>{{ updatedPrescription.rightEyePrism }}</td>
                          <td>{{ updatedPrescription.pupilDistance }}</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>New RX (L)</td>
                          <td>{{ updatedPrescription.leftEyeSphere }}</td>
                          <td>{{ updatedPrescription.leftEyeCylinder }}</td>
                          <td>{{ updatedPrescription.leftEyeAxis }}</td>
                          <td>{{ updatedPrescription.leftEyeAdd }}</td>
                          <td>{{ updatedPrescription.leftEyePrism }}</td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="row mt-5">
                  <div class="col">
                    <ul>
                      <li class="str">
                        Thank you for your kind support and we look forward to
                        your continued patronage.
                      </li>
                      <li class="str">
                        Non-payment or settlement of balance within 60 days of
                        receipt data will result in forfeiture of deposit.
                      </li>
                      <li class="str">
                        I have read and understood the terms of privacy policy
                        statement and consent to handling of my personal
                        information as described herein
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="row mt-5 d-flex justify-content-end">
                  <div class="col-md-auto">
                    Customer's Sigrature and Date
                  </div>
                  <div class="col-4 border-bottom border-dark"></div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    v-model="donePrinting"
                    type="checkbox"
                    value=""
                    id="donePrinting"
                    :disabled="disableCheckbox"
                  />
                  <label class="form-check-label" for="donePrinting">
                    Sudah print invoice?
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="print">
              Print
            </button>
            <button
              type="button"
              class="btn btn-success"
              data-dismiss="modal"
              @click="finishTransaction"
              :disabled="!donePrinting"
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import storeData from "@/storeData";
import _ from "lodash";

export default {
  name: "Invoice",
  data: () => {
    return {
      donePrinting: false,
      disableCheckbox: true,
    };
  },
  props: [
    "customer",
    "employeeName",
    "products",
    "paymentType",
    "accountNum",
    "totalAmt",
    "netAmt",
    "depositAmt",
    "discountPercentage",
    "updatedPrescription",
    "newSaleId",
    "fullyPaid",
  ],
  computed: {
    currentDate() {
      const today = new Date();
      const date = today.getDate();
      const month = today.getMonth();
      const year = today.getFullYear();
      const time = today.toLocaleTimeString();

      return `${date}/${month}/${year} ${time}`;
    },
    storeAddress() {
      return storeData.storeAddress;
    },
    storeName() {
      return storeData.storeName;
    },
    storePhoneNum() {
      return storeData.storePhoneNum;
    },
    customerName() {
      return `${this.customer.firstName} ${this.customer.lastName}`;
    },
    renderData() {
      const values = _.values(this.$props);
      return values.every((v) => v !== null || v !== undefined);
    },
    numOfProducts() {
      return (
        this.products.frames.length +
        this.products.lenses.length +
        this.products.customLenses.length
      );
    },
    balanceAmt() {
      return this.fullyPaid ? 0 : this.netAmt - this.depositAmt;
    },
    renderPrescription() {
      return this.customer.rightEyeSphere !== undefined;
    },
    headerText() {
      return this.fullyPaid ? "Tax Invoice" : "Deposit";
    },
  },
  methods: {
    print() {
      // Pass the element id here
      this.$htmlToPaper("invoiceSetup", null, () => {
        console.log("Printing completed or was cancelled!");
        this.disableCheckbox = false;
      });
    },
    formatNumber(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    },
    finishTransaction() {
      if (confirm("Are you sure you have printed the invoice?")) {
        this.$emit("donePrinting");
        this.disableCheckbox = true;
      }
    },
  },
};
</script>
<style scoped>
p {
  margin-bottom: 0 !important;
}
ul {
  padding: 0 !important;
}
li {
  position: relative;
  list-style: none;
}
li.str:before {
  content: "*";
  position: absolute;
  left: -15px;
  bottom: -3px;
}
.modal {
  overflow-y: auto;
}
</style>
