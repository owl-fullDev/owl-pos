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
    <h1>Create Sale</h1>
    <form id="saleForm" class="mt-3">
      <!-- Customer info -->
      <h3>Customer information</h3>
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
                Customer First Name
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
                Customer Last Name
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
                class="btn btn-info mr-5"
                type="button"
                @click="searchCustomerByName"
                :disabled="loading"
              >
                Search By Customer First and Last name
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
                  Create New Customer
                </label>
              </div>
            </div>
          </div>
          <div class="mb-3 row">
            <div class="col">
              <label for="CustomerPhone" class="form-label">
                Customer Phone
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
                class="btn btn-info mr-5"
                type="button"
                @click="searchCustomerByPhone"
                :disabled="loading"
              >
                Search by Customer Phone #
              </button>
            </div>
          </div>
          <div v-if="showCustomerInfo">
            <div class="mb-3 row">
              <div class="col">
                <label for="CustomerEmail" class="form-label">
                  Customer Email
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

      <!-- Prescription -->
      <div class="row" v-if="showCustomerInfo">
        <div class="col">
          <div class="mt-3 row">
            <div class="col">
              <h5>Prescription</h5>
            </div>
          </div>
          <!-- Right Eye -->
          <h6>Right eye</h6>
          <div class="row mb-3">
            <div class="col">
              <label for="RightEyeSphere" class="form-label">
                Right Eye Sphere
              </label>
              <input
                v-model="prescription.rightEyeSphere"
                type="text"
                class="form-control"
                name="rightEyeSphere"
                required
              />
            </div>
            <div class="col">
              <label for="RightEyeCylinder" class="form-label">
                Right Eye Cylinder
              </label>
              <input
                v-model="prescription.rightEyeCylinder"
                type="text"
                class="form-control"
                name="rightEyeCylinder"
                required
              />
            </div>
            <div class="col">
              <label for="RightEyeAxis" class="form-label">
                Right Eye Axis
              </label>
              <input
                v-model.number="prescription.rightEyeAxis"
                type="text"
                class="form-control"
                name="rightEyeAxis"
                required
              />
            </div>
            <div class="col">
              <label for="RightEyeAdd" class="form-label">
                Right Eye Add
              </label>
              <input
                v-model="prescription.rightEyeAdd"
                type="text"
                class="form-control"
                name="rightEyeAdd"
                required
              />
            </div>
            <div class="col">
              <label for="RightEyePrism" class="form-label">
                Right Eye Prism
              </label>
              <input
                v-model="prescription.rightEyePrism"
                type="text"
                class="form-control"
                name="rightEyePrism"
                required
              />
            </div>
            <div class="col">
              <label for="pupilaryDistance">PD</label>
              <input
                class="form-control"
                id="pupilaryDistance"
                type="number"
                name="pd"
                v-model.number="prescription.pd"
                required
              />
            </div>
          </div>

          <!-- Left Eye -->
          <h6>Left eye</h6>
          <div class="row mb-3">
            <div class="col">
              <label for="LeftEyeSphere" class="form-label">
                Left Eye Sphere
              </label>
              <input
                v-model="prescription.leftEyeSphere"
                type="text"
                class="form-control"
                name="leftEyeSphere"
                required
              />
            </div>
            <div class="col">
              <label for="LeftEyeCylinder" class="form-label">
                Left Eye Cylinder
              </label>
              <input
                v-model="prescription.leftEyeCylinder"
                type="text"
                name="leftEyeCylinder"
                class="form-control"
                required
              />
            </div>
            <div class="col">
              <label for="LeftEyeAxis" class="form-label">
                Left Eye Axis
              </label>
              <input
                v-model.number="prescription.leftEyeAxis"
                type="text"
                name="leftEyeAxis"
                class="form-control"
                required
              />
            </div>
            <div class="col">
              <label for="LeftEyeAdd" class="form-label"> Left Eye Add </label>
              <input
                v-model="prescription.leftEyeAdd"
                type="text"
                name="leftEyeAdd"
                class="form-control"
                required
              />
            </div>
            <div class="col">
              <label for="LeftEyePrism" class="form-label">
                Left Eye Prism
              </label>
              <input
                v-model="prescription.leftEyePrism"
                type="text"
                class="form-control"
                name="leftEyePrism"
                required
              />
            </div>
            <div class="col"></div>
          </div>
        </div>
      </div>

      <!-- Product info -->
      <div class="row">
        <div class="col">
          <h3>Product info</h3>
          <hr />
          <div class="row" :class="{ 'd-none': productIds.frames.length < 1 }">
            <div class="col">
              <h4>Frames</h4>
            </div>
          </div>
          <div
            class="mb-3 row"
            v-for="(product, index) in productIds.frames"
            :key="product.id"
          >
            <div class="col">
              <label for="ProductId" class="form-label">Frame Barcode</label>
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
              <label for="Quantity" class="form-label">Quantity</label>
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
                Remove Product
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
              <h4>Stock Lenses</h4>
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
              <label for="Quantity" class="form-label">Quantity</label>
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
                Remove Product
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
                <option selected disabled value="">Select Custom Lens</option>
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
              <label for="Quantity" class="form-label">Quantity</label>
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
                Remove Product
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
                Add Frame
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
                Add Stock Lens
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
                Add Custom Lens
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

      <!-- Promotion -->
      <div class="row mb-3">
        <div class="col">
          <h3>Promotion</h3>
          <hr />
          <select
            class="form-control"
            aria-label="promotion selection"
            v-model="selectedPromotion"
            required
          >
            <option value="0">No promotion</option>
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
                  <th scope="col">Item Code</th>
                  <th scope="col">Item Name</th>
                  <th scope="col">Qty</th>
                  <th scope="col">Price(Rupiah)</th>
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
            <h4>Total Amount:</h4>
          </div>
          <div class="col-2 text-right">
            <span class="text-success align-middle costBreakdown">
              {{ totalAmount }} Rupiah
            </span>
          </div>
        </div>
        <div class="row justify-content-end">
          <div class="col-2 text-right">
            <h4>Discount:</h4>
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
      <div class="row mb-3">
        <div class="col-4">
          <h3>Employee</h3>
          <hr />
          <select
            class="form-control"
            aria-label="employee selection"
            v-model="selectedEmployeeId"
            required
          >
            <option value="">Select Employee</option>
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
            Continue
          </button>
          <button
            class="btn btn-warning mr-2 float-right"
            type="reset"
            @click="resetData"
          >
            Cancel Sale
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
                    Deposit dulu?
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
                    Full payment
                  </label>
                </div>
              </div>
            </div>
            <hr />
            <!-- Deposit -->
            <div class="row" v-if="showDepositInfo">
              <div class="col">
                <h3>Deposit Info</h3>
                <hr />
                <div class="row">
                  <div class="col">
                    <label for="Initial Payment Amount" class="form-label">
                      Initial Payment Amount
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
                  Payment Type
                </label>
                <select
                  class="form-control"
                  v-model="selectedPaymentType"
                  :required="hasCustomerPaid"
                >
                  <option value="">Select Payment Type</option>
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
import CustomerList from "./CustomerList.vue";
import _ from "lodash";
import storeData from "@/storeData";

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
    prescription: {
      leftEyeSphere: null,
      leftEyeCylinder: null,
      leftEyeAxis: null,
      leftEyeAdd: null,
      leftEyePrism: null,
      rightEyeSphere: null,
      rightEyeCylinder: null,
      rightEyeAxis: null,
      rightEyeAdd: null,
      rightEyePrism: null,
      pd: null,
    },
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
  },
  data: initialData,
  created() {
    this.fetchDataFromServer();
  },
  computed: {
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
            pupilDistance: this.prescription.pd,
            leftEyeSphere: this.prescription.leftEyeSphere,
            leftEyeCylinder: this.prescription.leftEyeCylinder,
            leftEyeAxis: this.prescription.leftEyeAxis,
            leftEyeAdd: this.prescription.leftEyeAdd,
            leftEyePrism: this.prescription.leftEyePrism,
            rightEyeSphere: this.prescription.rightEyeSphere,
            rightEyeCylinder: this.prescription.rightEyeCylinder,
            rightEyeAxis: this.prescription.rightEyeAxis,
            rightEyeAdd: this.prescription.rightEyeAdd,
            rightEyePrism: this.prescription.rightEyePrism,
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
              `${apiUrl}/getStoreFrameQuantity?storeId=${storeData.storeId}&frameId=${product.productId}`
            )
            .then((response) => {
              let {
                productPrice,
                storeQuantity: quantityAvailable,
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

      // left eye info
      this.prescription.leftEyeSphere = selectedCustomer.leftEyeSphere;
      this.prescription.leftEyeCylinder = selectedCustomer.leftEyeCylinder;
      this.prescription.leftEyeAxis = selectedCustomer.leftEyeAxis;
      this.prescription.leftEyeAdd = selectedCustomer.leftEyeAdd;
      this.prescription.leftEyePrism = selectedCustomer.leftEyePrism;

      //right eye info
      this.prescription.rightEyeSphere = selectedCustomer.rightEyeSphere;
      this.prescription.rightEyeCylinder = selectedCustomer.rightEyeCylinder;
      this.prescription.rightEyeAxis = selectedCustomer.rightEyeAxis;
      this.prescription.rightEyeAdd = selectedCustomer.rightEyeAdd;
      this.prescription.rightEyePrism = selectedCustomer.rightEyePrism;

      this.prescription.pd = selectedCustomer.pupilDistance;

      this.selectedCustomerId = selectedCustomer.customerId;
    },
    resetCustomerInfo() {
      if (this.selectedCustomerId) {
        this.selectedCustomerId == null;

        //personal info
        this.phoneNum = "";
        this.email = "";

        // left eye info
        this.prescription.leftEyeSphere = null;
        this.prescription.leftEyeCylinder = null;
        this.prescription.leftEyeAxis = null;
        this.prescription.leftEyeAdd = null;
        this.prescription.leftEyePrism = null;

        //right eye info
        this.prescription.rightEyeSphere = null;
        this.prescription.rightEyeCylinder = null;
        this.prescription.rightEyeAxis = null;
        this.prescription.rightEyeAdd = null;
        this.prescription.rightEyePrism = null;

        this.prescription.pd = null;
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

        // axios
        //   .get(
        //     `${apiUrl}/getStoreFrameQuantity?storeId=${storeData.storeId}&frameId=${lens.productId}`
        //   )
        //   .then((response) => {
        //     const { storeQuantity } = response.data;
        //     lens.availableAmt = storeQuantity;
        //   })
        //   .catch((err) => console.error(err));
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
