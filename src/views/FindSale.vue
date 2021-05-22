<template>
  <div class="container-fluid mt-2">
    <div id="overlay" class="d-flex justify-content-center">
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
    <div id="row" v-if="selectedCustomerId!==null">
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
              {{ props.row.promotion? props.row.promotion.promotionName:"" }}
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
            <b-table-column label="Actions">
              <button
                  v-on:click="printInvoice"
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
                            <strong>{{ props.row.promotionParentSaleId }}</strong>
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
  </div>
</template>

<script>
import axios from "axios";
import customerList from "@/components/CustomerList.vue"
import _ from "lodash";
const posEndpoint = "/posEndpoint";

export default {
  name: "FindSale",

  components: {
    customerList
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
    }
  },

  methods: {
    printInvoice(){

    },
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
      }
      else {
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
            });
      }
      else {
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
        axios
            .get(
                `${posEndpoint}/findCustomerSaleRecord?customerId=${this.selectedCustomerId}`
            )
            .then((response) => {
              this.customerSaleList = [...response.data];
            })
            .catch((err) => {
              console.log(err);
            });
      }
  },

  watch: {
    selectedCustomerId: function (val){
      if (val!=null) {
        this.getCustomerSales()
      }
    }
  }

}

</script>
