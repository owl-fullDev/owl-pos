<template>
  <div class="container-fluid mt-2">
    <div id="overlay" class="d-flex justify-content-center" v-if="loading">
      <div
        id="loader"
        class="spinner-border text-light"
        style="width: 3rem; height: 3rem;"
        role="status"
      >
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <h3>Cari Customer</h3>
    <hr />
    <customer-list
      :list="customerList"
      @selectCustomer="setCustomerInfo"
      :selected-customer-id="selectedCustomerId"
    />
    <div class="row mb-3">
      <div class="col-6">
        <div class="mb-3 row">
          <div class="col">
            <label for="CustomerName" class="form-label">
              Nama Depan
            </label>
            <input
              v-model.trim="firstName"
              type="text"
              class="form-control"
              name="firstName"
              required
            />
          </div>
        </div>
        <div class="mb-3 row">
          <div class="col">
            <label for="CustomerName" class="form-label">
              Nama Belakang
            </label>
            <input
              v-model.trim="lastName"
              type="text"
              class="form-control"
              name="lastName"
              required
            />
          </div>
        </div>
        <div class="mb-3 row">
          <div class="col">
            <button
              class="btn btn-primary mr-5"
              type="button"
              @click="searchCustomerByName"
              :disabled="loading"
            >
              Cari Customer Menggunakan Nama
            </button>
          </div>
        </div>
        <div class="mb-3 row">
          <div class="col">
            <label for="CustomerPhone" class="form-label">
              Nomor Telepon
            </label>
            <input
              v-model="phoneNum"
              type="text"
              class="form-control"
              name="phoneNumber"
              required
            />
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <button
              class="btn btn-primary mr-5"
              type="button"
              @click="searchCustomerByPhone"
              :disabled="loading"
            >
              Cari Menggunakan Nomor Telepon
            </button>
          </div>
        </div>
      </div>
    </div>
    <div id="row" v-if="selectedCustomerId">
      <div class="row">
        <div class="col">
          <b-table
            :data="customerSaleList"
            :striped="true"
            :hoverable="true"
            :default-sort-direction="'asc'"
            :paginated="true"
            :pagination-rounded="true"
            :loading="loading"
            :per-page="25"
            :show-detail-icon="true"
            detailed
            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page"
          >
            <b-table-column
              field="saleId"
              label="ID"
              width="40"
              sortable
              v-slot="props"
            >
              {{ props.row.saleId }}
            </b-table-column>
            <b-table-column field="store" label="Store" sortable v-slot="props">
              {{ props.row.store.name }}
            </b-table-column>
            <b-table-column
              field="promotion"
              label="Promotion"
              sortable
              v-slot="props"
            >
              {{ props.row.promotion ? props.row.promotion.promotionName : "" }}
            </b-table-column>
            <b-table-column
              field="revenue"
              label="Revenue (Rp)"
              v-slot="props"
              sortable
            >
              {{ props.row.grandTotal }}
            </b-table-column>
            <b-table-column field="time" label="Date" sortable v-slot="props">
              <span class="tag is-success">
                {{ new Date(props.row.initialDepositDate).toUTCString() }}
              </span>
            </b-table-column>
            <b-table-column label="Actions" v-slot="props">
              <button
                type="button"
                class="btn btn-primary"
                href="#invoiceModal"
                data-toggle="modal"
                @click="selectedSale = props.row"
              >
                Print Invoice
              </button>
            </b-table-column>
            <template #detail="props">
              <article class="media">
                <div class="media-content">
                  <div class="content">
                    <div class="row mb-3 ">
                      <div class="col-3">
                        <ul
                          class="list-group"
                          v-if="props.row.promotionParentSaleId > 0"
                        >
                          <li class="list-group-item list-group-item-primary">
                            Parent sale Id:
                            <strong>
                              {{ props.row.promotionParentSaleId }}
                            </strong>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="row mb-3 " v-if="props.row.saleRemarks !== ''">
                      <div class="col">
                        Sale remarks:
                        <strong>{{ props.row.saleRemarks }}</strong>
                      </div>
                    </div>
                    <table class="table">
                      <thead class="thead-dark">
                        <tr>
                          <th scope="col">Product</th>
                          <th scope="col">Quantity Sold</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="saleDetail in props.row.saleDetailList"
                          :key="saleDetail.saleDetailId"
                        >
                          <td>{{ saleDetail.product.productId }}</td>
                          <td>{{ saleDetail.quantity }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </article>
            </template>
          </b-table>
        </div>
      </div>
    </div>
    <Invoice
      v-if="selectedSale"
      :customer="currentCustomer"
      :employee-name="employeeName"
      :products="products"
      :payment-type="selectedPaymentType"
      :account-num="accountNumber"
      :total-amt="totalAmount"
      :net-amt="netAmount"
      :depositAmt="depositAmount"
      :discount-percentage="discountPercentage"
      :updated-prescription="prescription"
      :new-sale-id="newSaleId"
      :fully-paid="fullyPaid"
      :remarks="remarks"
      :closable="true"
    />
  </div>
</template>

<script>
import axios from "axios";
import customerList from "@/components/CustomerList.vue";
import Invoice from "@/components/Invoice.vue";
import _ from "lodash";
const posEndpoint = "/posEndpoint";

export default {
  name: "FindSale",
  components: {
    customerList,
    Invoice,
  },
  data: () => {
    return {
      selectedCustomerId: null,
      customerList: [],
      firstName: "",
      lastName: "",
      phoneNum: "",
      loading: false,
      customerSaleList: [],
      selectedSale: null,
    };
  },
  computed: {
    currentCustomer() {
      if (!this.selectedCustomerId) {
        return null;
      }

      return this.getCustomer(this.selectedCustomerId);
    },
    employeeName() {
      return this.selectedSale
        ? `${this.selectedSale.employee.firstName} ${this.selectedSale.employee.lastname}`
        : "";
    },
    products() {
      if (!this.selectedSale) return null;

      const products = {
        frames: [],
        lenses: [],
        customLenses: [],
        misc: [],
      };

      this.selectedSale.saleDetailList.forEach((sd) => {
        const {
          productId,
          productName: name,
          productPrice: price,
        } = sd.product;
        const { quantity } = sd;

        const productToAdd = {
          productId,
          name,
          quantity,
          price,
        };

        if (productId.startsWith("11") || productId.startsWith("22")) {
          products.frames.push(productToAdd);
        } else if (productId.startsWith("33")) {
          products.lenses.push(productToAdd);
        } else {
          products.misc.push(productToAdd);
        }
      });

      return products;
    },
    initialOrFinalPaymentObj() {
      if (!this.selectedSale) return null;

      let obj = {
        amount: 0,
        type: "",
        date: "",
      };

      if (this.selectedSale.finalDepositAmount) {
        obj.amount = this.selectedSale.finalDepositAmount;
        obj.type = this.selectedSale.finalDepositType;
        obj.date = this.selectedSale.finalDepositDate;
      } else {
        obj.amount = this.selectedSale.initialDepositAmount;
        obj.type = this.selectedSale.initialDepositType;
        obj.date = this.selectedSale.initialDepositDate;
      }

      return obj;
    },
    selectedPaymentType() {
      if (!this.initialOrFinalPaymentObj) return "";

      return this.initialOrFinalPaymentObj.type.split(":")[0];
    },
    accountNumber() {
      if (!this.initialOrFinalPaymentObj) return "";

      const paymentDetails = this.initialOrFinalPaymentObj.type.split(":");

      if (paymentDetails.length === 1) {
        return "";
      }

      return paymentDetails[2];
    },
    totalAmount() {
      if (!this.selectedSale) return 0;

      if (this.selectedSale.promotionParentSaleId) {
        return 0;
      }

      let frameCosts = 0;
      let stockLensCosts = 0;
      let customLensCosts = 0;
      let miscProductCosts = 0;
      let total = 0;

      if (
        this.products.frames.length > 0 ||
        this.products.lenses.length > 0 ||
        this.products.customLenses.length > 0
      ) {
        frameCosts = _.sumBy(this.products.frames, (f) => f.price * f.quantity);

        stockLensCosts = _.sumBy(
          this.products.lenses,
          (l) => l.price * l.quantity
        );

        customLensCosts = _.sumBy(
          this.products.customLenses,
          (l) => l.price * l.quantity
        );

        miscProductCosts = _.sumBy(
          this.products.misc,
          (p) => p.price * p.quantity
        );

        // prettier-ignore
        total += stockLensCosts + frameCosts + customLensCosts + miscProductCosts;
      }

      return total;
    },
    netAmount() {
      if (!this.selectedSale) return "";

      if (this.fullyPaid || !this.selectedSale.finalDepositDate)
        return this.selectedSale.grandTotal;

      return (
        this.selectedSale.grandTotal - this.selectedSale.initialDepositAmount
      );
    },
    depositAmount() {
      if (!this.selectedSale) return "";

      return this.fullyPaid ? 0 : this.initialOrFinalPaymentObj.amount;
    },
    remarks() {
      if (!this.selectedSale) return "";

      return this.selectedSale.saleRemarks;
    },
    newSaleId() {
      if (!this.selectedSale) return "";

      return this.selectedSale.saleId;
    },
    fullyPaid() {
      if (!this.selectedSale) return false;

      return this.selectedSale.fullyPaid;
    },
    isSpecialPromo() {
      if (!this.selectedSale) return false;

      if (!this.selectedSale.promotion) return false;

      if (
        this.selectedSale.promotion.promotionId === 1 ||
        this.selectedSale.promotion.promotionId === 2
      ) {
        return true;
      }

      return false;
    },
    discountPercentage() {
      if (!this.selectedSale) return 0;

      if (!this.selectedSale.promotion) return 0;

      if (this.selectedSale.promotionParentSaleId <= 0 && this.isSpecialPromo) {
        return 0;
      }

      return this.selectedSale.promotion.percentage;
    },
    prescription() {
      if (!this.selectedSale) return null;

      const {
        leftEyeSphere,
        leftEyeCylinder,
        leftEyeAxis,
        leftEyeAdd,
        leftEyePrism,
        rightEyeSphere,
        rightEyeCylinder,
        rightEyeAxis,
        rightEyeAdd,
        rightEyePrism,
        pupilDistance,
      } = this.currentCustomer;

      return {
        leftEyeSphere,
        leftEyeCylinder,
        leftEyeAxis,
        leftEyeAdd,
        leftEyePrism,
        rightEyeSphere,
        rightEyeCylinder,
        rightEyeAxis,
        rightEyeAdd,
        rightEyePrism,
        pupilDistance,
      };
    },
  },
  methods: {
    searchCustomerByName() {
      if (this.firstName && this.lastName) {
        this.loading = true;
        axios
          .get(
            `${posEndpoint}/getCustomerByName?firstName=${this.firstName}&lastName=${this.lastName}`
          )
          .then((response) => {
            this.customerList = [...response.data];
            this.loading = false;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        alert("Please fill in a customer first name and last name");
      }
    },
    searchCustomerByPhone() {
      if (this.phoneNum) {
        this.loading = true;
        axios
          .get(
            `${posEndpoint}/getCustomerByPhoneNumber?phoneNumber=${this.phoneNum}`
          )
          .then((response) => {
            this.customerList = [...response.data];
            this.loading = false;
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });
      } else {
        alert("Please fill in a customer first name and last name");
      }
    },
    getCustomer(id) {
      let customer = _.find(this.customerList, (c) => c.customerId == id);
      return customer;
    },
    setCustomerInfo(customerId) {
      let selectedCustomer = this.getCustomer(customerId);

      //personal info
      this.firstName = selectedCustomer.firstName;
      this.lastName = selectedCustomer.lastName;
      this.phoneNum = selectedCustomer.phoneNumber;
      this.selectedCustomerId = selectedCustomer.customerId;
    },
    getCustomerSales() {
      this.loading = true;
      axios
        .get(
          `${posEndpoint}/findCustomerSaleRecord?customerId=${this.selectedCustomerId}`
        )
        .then((response) => {
          this.customerSaleList = [...response.data];
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
  },

  watch: {
    selectedCustomerId(val) {
      if (val != null) {
        this.getCustomerSales();
      }
    },
  },
};
</script>
<style scoped>
#overlay {
  position: fixed;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  cursor: pointer;
}

#loader {
  position: absolute;
  top: 50%;
}
</style>
