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
    <form id="saleForm" class="mt-3">
      <!-- Customer info -->
      <h3>Data Customer</h3>
      <hr />
      <customer-list
        :list="customerList"
        @selectCustomer="setCustomerInfo"
        v-show="!createNewCustomer"
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

              <div class="form-check d-inline-block">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="createNewCustomer"
                  name="createNewCustomer"
                  id="createNewCustomer"
                  :disabled="loading"
                  @click="resetCustomerInfo"
                />
                <label class="form-check-label" for="createNewCustomer">
                  Customer Baru
                </label>
              </div>
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
          <div v-if="showCustomerInfo">
            <div class="mb-3 row">
              <div class="col">
                <label for="CustomerEmail" class="form-label">
                  Email
                </label>
                <input
                  v-model="email"
                  type="email"
                  name="email"
                  class="form-control"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Prescription
        ref="prescriptionElem"
        :show-prescription="showCustomerInfo"
      />
      <br /><br />

      <!-- Product info -->
      <div class="row">
        <div class="col">
          <h3>Informasi Barang</h3>
          <hr />
          <div class="row" :class="{ 'd-none': productIds.frames.length < 1 }">
            <div class="col">
              <h4>Frame</h4>
            </div>
          </div>
          <div
            class="mb-3 row"
            v-for="(product, index) in productIds.frames"
            :key="product.id"
          >
            <div class="col">
              <label for="ProductId" class="form-label">Barcode Frame</label>
              <input
                type="text"
                class="form-control"
                :class="{
                  'is-invalid':
                    product.barcodeError && product.barcodeError != null,
                  'is-valid': product.barcodeError === null,
                }"
                aria-label="Product"
                aria-describedby="productId"
                v-model.trim="product.productId"
                @change="validateBarcodeInput(index, 'frame')"
                required
              />
              <small class="form-text text-danger">
                {{ product.barcodeError }}
              </small>
            </div>
            <div class="col">
              <label for="Quantity" class="form-label">Kuantitas</label>
              <input
                type="number"
                class="form-control"
                :class="{
                  'is-invalid':
                    product.quantityError && product.quantityError != null,
                  'is-valid': product.quantityError === null,
                }"
                aria-label="ProductQuantity"
                aria-describedby="productQuantity"
                v-model.number="product.quantity"
                min="1"
                :max="product.availableAmt"
                @change="validateInputQuantity(index, 'frame')"
                :disabled="product.barcodeError || !product.productId"
              />
              <small class="form-text text-danger">
                {{ product.quantityError }}
              </small>
            </div>
            <div class="col-2">
              <label for="Remove Product" class="form-label">
                Batalkan Frame
              </label>
              <button
                class="btn btn-danger form-control"
                type="button"
                @click="removeFrameInput(index)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-dash-circle-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="row" :class="{ 'd-none': productIds.lenses.length < 1 }">
            <div class="col">
              <h4>Lensa Standar</h4>
            </div>
          </div>
          <div
            class="mb-3 row"
            v-for="(product, index) in productIds.lenses"
            :key="product.id"
          >
            <div class="col">
              <label for="ProductId" class="form-label">Lens Barcode</label>
              <input
                type="text"
                class="form-control"
                :class="{
                  'is-invalid':
                    product.barcodeError && product.barcodeError != null,
                  'is-valid': product.barcodeError === null,
                }"
                aria-label="Product"
                aria-describedby="productId"
                v-model.trim="product.productId"
                @change="validateBarcodeInput(index, 'lens')"
                required
              />
              <small class="form-text text-danger">
                {{ product.barcodeError }}
              </small>
            </div>
            <div class="col">
              <label for="Quantity" class="form-label">Kuantitas</label>
              <input
                type="number"
                class="form-control"
                :class="{
                  'is-invalid':
                    product.quantityError && product.quantityError != null,
                  'is-valid': product.quantityError === null,
                }"
                aria-label="ProductQuantity"
                aria-describedby="productQuantity"
                v-model.number="product.quantity"
                min="1"
                :max="product.availableAmt"
                @change="validateInputQuantity(index, 'lens')"
                :disabled="product.barcodeError || !product.productId"
              />
              <small class="form-text text-danger">
                {{ product.quantityError }}
              </small>
            </div>
            <div class="col-2">
              <label for="Remove Product" class="form-label">
                Batalkan Lensa
              </label>
              <button
                class="btn btn-danger form-control"
                type="button"
                @click="removeStockLensInput(index)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-dash-circle-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div
            class="row"
            :class="{ 'd-none': productIds.customLenses.length < 1 }"
          >
            <div class="col">
              <h4>Custom Lenses</h4>
            </div>
          </div>
          <div
            class="mb-3 row"
            v-for="(product, index) in productIds.customLenses"
            :key="product.id"
          >
            <div class="col">
              <label for="productId" class="form-label">Custom Lens</label>
              <select
                class="form-control"
                v-model="product.productId"
                @change="setLensDetails(index)"
              >
                <option selected disabled value="">Pilih Lensa Custom</option>
                <option
                  v-for="lens in customLenses"
                  :key="lens.id"
                  :value="lens.productId"
                >
                  {{ lens.productName }}
                </option>
              </select>
            </div>
            <div class="col">
              <label for="Quantity" class="form-label">Kuantitas</label>
              <input
                type="number"
                class="form-control"
                :class="{
                  'is-invalid': product.error && product.error != null,
                  'is-valid': product.error === null,
                }"
                aria-label="ProductQuantity"
                aria-describedby="productQuantity"
                v-model.number="product.quantity"
                min="1"
                :max="product.availableAmt"
                @change="validateInputQuantity(index, 'customLens')"
                :disabled="!product.productId"
              />
              <small class="form-text text-danger">
                {{ product.error }}
              </small>
            </div>
            <div class="col-2">
              <label for="Remove Product" class="form-label">
                Batalkan Lensa Custom
              </label>
              <button
                class="btn btn-danger form-control"
                type="button"
                @click="removeCustomLensInput(index)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-dash-circle-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="mb3 row">
            <div class="col d-flex justify-content-center">
              <button
                class="btn btn-primary mr-2"
                type="button"
                @click="addBarcodeInput('frame')"
              >
                Tambah Frame
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-plus-circle-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"
                  ></path>
                </svg>
              </button>
              <button
                class="btn btn-primary mr-2"
                type="button"
                @click="addBarcodeInput('lens')"
              >
                Tambah Lensa Standar
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-plus-circle-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"
                  ></path>
                </svg>
              </button>
              <button
                class="btn btn-secondary"
                type="button"
                @click="addCustomLensInput"
              >
                Tambah Lensa Custom
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-plus-circle-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <br /><br />

      <!-- Promotion -->
      <div class="row mb-3">
        <div class="col">
          <h3>Promosi</h3>
          <hr />
          <select
            class="form-control"
            aria-label="promotion selection"
            v-model="selectedPromotion"
            required
          >
            <option value="0">Tanpa promosi</option>
            <option
              v-for="promo in promotions"
              :key="promo.id"
              :value="promo.promotionId"
            >
              {{ promo.name }}
            </option>
          </select>
        </div>
      </div>
      <br /><br />

      <!-- Employee -->
      <div class="row mb-3">
        <div class="col-4">
          <h3>Salesman</h3>
          <hr />
          <select
            class="form-control"
            aria-label="employee selection"
            v-model="selectedEmployeeId"
            required
          >
            <option value="">Pilih Karyawan</option>
            <option
              v-for="employee in employees"
              :key="employee.id"
              :value="employee.employeeId"
            >
              {{ employee.firstName }} {{ employee.lastname }} ({{
                employee.jobTitle
              }})
            </option>
          </select>
        </div>
      </div>
      <br />

      <!-- Grand total -->
      <div v-if="netAmount">
        <div class="row mb-3">
          <div class="col">
            <h5>Sale Details</h5>
            <hr />
          </div>
        </div>
        <div class="row mb-3">
          <div class="col">
            <table class="table">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">Kode Barang</th>
                  <th scope="col">Nama Barang</th>
                  <th scope="col">Qty</th>
                  <th scope="col">Harga Barang</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="frame in productIds.frames" :key="frame.id">
                  <th scope="row">{{ frame.productId }}</th>
                  <td>{{ frame.name }}</td>
                  <td>{{ frame.quantity }}</td>
                  <td>{{ frame.quantity * frame.price }}</td>
                </tr>
                <tr v-for="lens in productIds.lenses" :key="lens.id">
                  <th scope="row">{{ lens.productId }}</th>
                  <td>{{ lens.name }}</td>
                  <td>{{ lens.quantity }}</td>
                  <td>{{ lens.quantity * lens.price }}</td>
                </tr>
                <tr v-for="lens in productIds.customLenses" :key="lens.id">
                  <th scope="row">{{ lens.productId }}</th>
                  <td>{{ lens.name }}</td>
                  <td>{{ lens.quantity }}</td>
                  <td>{{ lens.quantity * lens.price }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <hr />
      <div id="costBreakdownDiv">
        <div class="row justify-content-end">
          <div class="col-2 text-right">
            <h4>Harga Total:</h4>
          </div>
          <div class="col-2 text-right">
            <span class="text-success align-middle costBreakdown">
              {{ totalAmount }} Rupiah
            </span>
          </div>
        </div>
        <div class="row justify-content-end">
          <div class="col-2 text-right">
            <h4>Promosi / Diskon:</h4>
          </div>
          <div class="col-2 text-right">
            <span class="text-success align-middle costBreakdown">
              {{ discountName }}
            </span>
          </div>
        </div>
        <div class="row mb-3 justify-content-end">
          <div class="col-2 text-right">
            <h4>Net Amount:</h4>
          </div>
          <div class="col-2 text-right">
            <span class="text-success align-middle costBreakdown">
              {{ netAmount }} Rupiah
            </span>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div class="row mb-3">
        <div class="col-10"></div>
        <div class="col">
          <button
            class="btn btn-primary float-right"
            type="submit"
            :disabled="formHasErrors"
            data-toggle="modal"
            data-target="#paymentModal"
            id="continueToPaymentBtn"
            @click="openPaymentModal($event)"
          >
            Checkout Penjualan
          </button>
          <button
            class="btn btn-danger mr-2 float-right"
            type="reset"
            @click="resetData"
          >
            Batalkan Penjualan
          </button>
        </div>
      </div>
    </form>

    <!-- Payment Modal -->
    <div
      ref="modal"
      class="modal fade"
      id="paymentModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="continueToPaymentBtn"
      aria-hidden="true"
      v-if="showPaymentModal"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Pembayaran</h5>
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
            <div class="row mb-3">
              <div class="col">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="showDepositInfo"
                    id="showDepositInfo"
                    :disabled="hasCustomerPaid"
                  />
                  <label class="form-check-label" for="showDepositInfo">
                    Pembayaran dengan Deposit
                  </label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="form-check d-inline-block">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="hasCustomerPaid"
                    name="hasCustomerPaid"
                    id="hasCustomerPaid"
                    :disabled="showDepositInfo"
                  />
                  <label class="form-check-label" for="hasCustomerPaid">
                    Pembayaran Penuh
                  </label>
                </div>
              </div>
            </div>
            <hr />
            <!-- Deposit -->
            <div class="row" v-if="showDepositInfo">
              <div class="col">
                <h3>Pembayaran Deposit</h3>
                <hr />
                <div class="row">
                  <div class="col">
                    <label for="Initial Payment Amount" class="form-label">
                      Jumlah Deposit
                    </label>
                    <div class="input-group mb-3">
                      <span class="input-group-text" id="rupiah-currency"
                        >Rp</span
                      >
                      <input
                        type="number"
                        class="form-control"
                        v-model.number="initialPaymentAmt"
                        aria-label="initialPaymentAmount"
                        aria-describedby="rupiah-currency"
                        :required="showDepositInfo"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="hasCustomerPaid || showDepositInfo" class="row mb-3">
              <div class="col">
                <label for="Payment Type" class="form-label">
                  Jenis Pembayaran
                </label>
                <select
                  class="form-control"
                  v-model="selectedPaymentType"
                  :required="hasCustomerPaid"
                >
                  <option value="">Jenis Pembayaran</option>
                  <option v-for="type in paymentTypes" :key="type.id">
                    {{ type }}
                  </option>
                </select>
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
              type="button"
              data-dismiss="modal"
              class="btn btn-success"
              :disabled="!hasCustomerPaid && !showDepositInfo"
              @click="createSale()"
            >
              Create Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import CustomerList from "@/components/CustomerList.vue";
import _ from "lodash";
import storeData from "@/storeData";
import Prescription from "@/components/Prescription.vue";

const apiUrl = "https://owl-backend-server.herokuapp.com/posEndpoint";

const initialData = () => {
  return {
    loading: false,
    productIds: {
      frames: [],
      lenses: [],
      customLenses: [],
    },
    customLenses: [],
    employees: [],
    selectedEmployeeId: "",
    firstName: "",
    lastName: "",
    phoneNum: "",
    email: "",
    promotions: [],
    selectedPromotion: 0,
    showDepositInfo: false,
    initialPaymentAmt: 0,
    paymentTypes: ["Cash", "Debit", "Credit"],
    selectedPaymentType: "",
    createNewCustomer: false,
    customerList: null,
    selectedCustomerId: null,
    hasCustomerPaid: false,
    showPaymentModal: false,
  };
};
export default {
  name: "SalesForm",
  components: {
    CustomerList,
    Prescription,
  },
  data: initialData,
  created() {
    this.fetchDataFromServer();
  },
  computed: {
    prescription() {
      return this.$refs.prescriptionElem.prescriptionValues;
    },
    showCustomerInfo() {
      if (!this.customerList && this.createNewCustomer) return true;

      return this.selectedCustomerId !== null || this.createNewCustomer;
    },
    discountName() {
      const promo = this.promotions.find(
        (p) => p.promotionId == this.selectedPromotion
      );

      if (promo) {
        return promo.name;
      }

      return "0%";
    },
    totalAmount() {
      let frameCosts = 0;
      let stockLensCosts = 0;
      let customLensCosts = 0;
      let total = 0;

      if (
        this.productIds.frames.length > 0 ||
        this.productIds.lenses.length > 0 ||
        this.productIds.customLenses.length > 0
      ) {
        frameCosts = _.sumBy(
          this.productIds.frames,
          (f) => f.price * f.quantity
        );

        stockLensCosts = _.sumBy(
          this.productIds.lenses,
          (l) => l.price * l.quantity
        );

        customLensCosts = _.sumBy(
          this.productIds.customLenses,
          (l) => l.price * l.quantity
        );

        total += stockLensCosts + frameCosts + customLensCosts;
      }

      return total;
    },
    netAmount() {
      let netAmt = this.totalAmount;
      const promo = this.promotions.find(
        (p) => p.promotionId == this.selectedPromotion
      );

      if (promo) {
        const discountVal = netAmt * (promo.discountVal / 100);
        netAmt -= discountVal;
      }

      return parseFloat(netAmt.toFixed(2));
    },
    validPhoneNum() {
      const regex = new RegExp("^\\d+$");

      return regex.test(this.phoneNum);
    },
    formHasErrors() {
      let frameErrors = _.some(
        this.productIds.frames,
        (f) => f.barcodeError || f.quantityError
      );
      let lensErrors = _.some(
        this.productIds.lenses,
        (l) => l.barcodeError || l.quantityError
      );
      let customLensError = _.some(
        this.productIds.customLenses,
        (l) => l.error
      );

      return frameErrors || lensErrors || customLensError;
    },
  },
  methods: {
    fetchDataFromServer() {
      axios
        .get(`${apiUrl}/getCustomLensList`)
        .then((response) => {
          this.customLenses = response.data;
        })
        .catch((err) => console.error(err));

      axios
        .get(`${apiUrl}/getStorePromotions?storeId=${storeData.storeId}`)
        .then((response) => {
          const promotionsReceived = response.data;
          this.promotions = promotionsReceived.map((p) => ({
            name: p.promotionName,
            discountVal: p.percentage,
            promotionId: p.promotionId,
          }));
        })
        .catch((err) => console.error(err));

      axios
        .get(`${apiUrl}/getStoreEmployees?storeId=${storeData.storeId}`)
        .then((response) => {
          this.employees = response.data;
        })
        .catch((err) => console.error(err));
    },
    resetData() {
      Object.assign(this.$data, initialData());
      this.fetchDataFromServer();
    },
    openPaymentModal(e) {
      e.preventDefault();
      const form = document.getElementById("saleForm");

      if (!form.checkValidity()) {
        this.showPaymentModal = false;
        form.reportValidity();
      } else {
        this.showPaymentModal = true;
      }
    },
    createSale() {
      if (!this.formHasErrors) {
        let frames = this.productIds.frames.map((f) => ({
          productId: f.productId,
          quantity: f.quantity,
        }));
        let lenses = this.productIds.lenses.map((l) => ({
          productId: l.productId,
          quantity: l.quantity,
        }));

        let customLenses = this.productIds.customLenses.map((l) => ({
          productId: l.productId,
          quantity: l.quantity,
        }));

        const productsToSend = [...frames, ...lenses, ...customLenses];

        const newSaleObj = {
          customerId: this.selectedCustomerId ? this.selectedCustomerId : 0,
          itemsSold: productsToSend.length,
          sale: {
            promotionId: this.selectedPromotion,
            grandTotal: `${this.netAmount}`,
            employeeId: this.selectedEmployeeId,
            storeId: storeData.storeId,
            initialDepositDate: new Date().toISOString(),
            initialDepositType: this.selectedPaymentType,
            initialDepositAmount: this.showDepositInfo
              ? `${this.initialPaymentAmt}`
              : `${this.netAmount}`,
          },
          products: productsToSend,
          newCustomer: {
            firstName: this.firstName,
            lastName: this.lastName,
            phoneNumber: this.phoneNum,
            email: this.email,
            ...this.prescription,
          },
        };

        console.log(newSaleObj);
        axios
          .post(`${apiUrl}/newSale`, newSaleObj)
          .then((response) => {
            console.log(response);
            alert("Sale created");
            this.resetData();
          })
          .catch((err) => console.log(err.response));
      }
    },
    validateBarcode(product) {
      if (product) {
        if (product.productId.length != 16) {
          product.barcodeError = "Length of barcode should be 16 characters";
        } else {
          axios
            .get(
              `${apiUrl}/getInStoreProductQuantity?storeId=${storeData.storeId}&productId=${product.productId}`
            )
            .then((response) => {
              let {
                productPrice,
                quantity: quantityAvailable,
                productName,
              } = response.data;
              product.price = productPrice;
              product.availableAmt = quantityAvailable;
              product.name = productName;
              product.barcodeError = null;
              product.quantityError = null;
            })
            .catch((error) => {
              console.error(error);
              product.barcodeError = "No such barcode exists";
              product.quantityError = "";
              product.price = 0;
              product.availableAmt = 1;
              product.quantity = 1;
              product.name = "";
            });
        }
      }
    },
    validateBarcodeInput(idx, type) {
      if (type === "frame") {
        let frame = this.productIds.frames[idx];
        this.validateBarcode(frame);
      } else {
        let lens = this.productIds.lenses[idx];
        this.validateBarcode(lens);
      }
    },
    validateInputQuantity(idx, productType) {
      var product = null;

      if (productType === "frame") {
        product = this.productIds.frames[idx];
      } else if (productType === "lens") {
        //validation for lens quanity if needed
        product = this.productIds.lenses[idx];
      } else {
        product = this.productIds.customLenses[idx];
      }
      this.validateQuantity(product);
    },
    validateQuantity(product) {
      if (product) {
        if (!product.productId) {
          product.barcodeError = "Please enter a barcode";
          return;
        }
        if (product.quantity > product.availableAmt) {
          product.quantityError =
            "Quantity requested is more than what is available in store";
        } else {
          product.barcodeError = null;
          product.quantityError = null;
        }
      }
    },
    addBarcodeInput(type) {
      if (type === "frame") {
        this.productIds.frames.push({
          productId: "",
          quantity: 1,
          barcodeError: "",
          quantityError: "",
          price: 0,
          availableAmt: 1,
          name: "",
        });
      } else {
        this.productIds.lenses.push({
          productId: "",
          quantity: 1,
          barcodeError: "",
          quantityError: "",
          price: 0,
          availableAmt: 1,
          name: "",
        });
      }
    },
    addCustomLensInput() {
      this.productIds.customLenses.push({
        productId: "",
        quantity: 1,
        availableAmt: 1,
        error: "Please select lens",
        price: 0,
        name: "",
      });
    },
    removeFrameInput(idx) {
      this.productIds.frames.splice(idx, 1);
    },
    removeCustomLensInput(idx) {
      this.productIds.customLenses.splice(idx, 1);
    },
    removeStockLensInput(idx) {
      this.productIds.lenses.splice(idx, 1);
    },
    searchCustomerByName() {
      if (this.firstName && this.lastName) {
        this.loading = true;
        this.createNewCustomer = false;
        axios
          .get(
            `${apiUrl}/getCustomerByName?firstName=${this.firstName}&lastName=${this.lastName}`
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
      if (this.validPhoneNum) {
        this.loading = true;
        this.createNewCustomer = false;
        axios
          .get(
            `${apiUrl}/getCustomerByPhoneNumber?phoneNumber=${this.phoneNum}`
          )
          .then((response) => {
            this.customerList = [...response.data];
            this.loading = false;
          })
          .catch((err) => console.log(err));
      } else {
        alert("Please enter a valid phone number");
      }
    },
    setCustomerInfo(customerId) {
      let selectedCustomer = _.find(
        this.customerList,
        (c) => c.customerId == customerId
      );

      //personal info
      this.phoneNum = selectedCustomer.phoneNumber;
      this.email = selectedCustomer.email;

      // prescription info
      this.$refs.prescriptionElem.showPrescriptionInputs = true;
      // left eye info

      // prettier-ignore
      this.$refs.prescriptionElem.leftEyeSphere = selectedCustomer.leftEyeSphere;
      // prettier-ignore
      this.$refs.prescriptionElem.leftEyeCylinder = selectedCustomer.leftEyeCylinder;
      this.$refs.prescriptionElem.leftEyeAxis = selectedCustomer.leftEyeAxis;
      this.$refs.prescriptionElem.leftEyeAdd = selectedCustomer.leftEyeAdd;
      this.$refs.prescriptionElem.leftEyePrism = selectedCustomer.leftEyePrism;

      //right eye info
      // prettier-ignore
      this.$refs.prescriptionElem.rightEyeSphere = selectedCustomer.rightEyeSphere;
      // prettier-ignore
      this.$refs.prescriptionElem.rightEyeCylinder = selectedCustomer.rightEyeCylinder;
      this.$refs.prescriptionElem.rightEyeAxis = selectedCustomer.rightEyeAxis;
      this.$refs.prescriptionElem.rightEyeAdd = selectedCustomer.rightEyeAdd;
      // prettier-ignore
      this.$refs.prescriptionElem.rightEyePrism = selectedCustomer.rightEyePrism;

      // prettier-ignore
      this.$refs.prescriptionElem.pupilDistance = selectedCustomer.pupilDistance;

      this.selectedCustomerId = selectedCustomer.customerId;
    },
    resetCustomerInfo() {
      if (this.selectedCustomerId) {
        this.selectedCustomerId == null;

        //personal info
        this.phoneNum = "";
        this.email = "";

        // prescription info
        this.$refs.prescriptionElem.showPrescriptionInputs = true;

        // left eye info
        this.$refs.prescriptionElem.leftEyeSphere = 0;
        this.$refs.prescriptionElem.leftEyeCylinder = 0;
        this.$refs.prescriptionElem.leftEyeAxis = 0;
        this.$refs.prescriptionElem.leftEyeAdd = 0;
        this.$refs.prescriptionElem.leftEyePrism = 0;

        //right eye info
        this.$refs.prescriptionElem.rightEyeSphere = 0;
        this.$refs.prescriptionElem.rightEyeCylinder = 0;
        this.$refs.prescriptionElem.rightEyeAxis = 0;
        this.$refs.prescriptionElem.rightEyeAdd = 0;
        this.$refs.prescriptionElem.rightEyePrism = 0;

        this.$refs.prescriptionElem.pupilDistance = 0;
      }
    },
    setLensDetails(idx) {
      let lens = this.productIds.customLenses[idx];
      if (lens) {
        const productId = lens.productId;
        const { productPrice, productName } = _.find(
          this.customLenses,
          (l) => l.productId === productId
        );
        lens.price = productPrice;
        lens.name = productName;
        lens.error = null;
      }
    },
  },
};
</script>
<style scoped>
#costBreakdownDiv .col-2 {
  max-width: 12.667% !important;
}
.costBreakdown {
  font-size: 120% !important;
}
.modal-active {
  display: block !important;
}
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
