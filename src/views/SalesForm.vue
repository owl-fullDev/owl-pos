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

      <!-- Prescription -->
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
              <h4>Frames</h4>
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
      <div class="row mb-3" v-if="specialPromo">
        <div class="col">
          <h4>Select sale order</h4>
          <hr />
          <div class="custom-control custom-radio">
            <input
              type="radio"
              id="firstSale"
              name="customRadio"
              class="custom-control-input"
              :value="1"
              v-model="saleNumber"
              required
            />
            <label class="custom-control-label" for="firstSale">
              First sale
            </label>
          </div>
          <div class="custom-control custom-radio">
            <input
              type="radio"
              id="secondSale"
              name="customRadio"
              class="custom-control-input"
              :value="2"
              v-model="saleNumber"
              required
            />
            <label class="custom-control-label" for="secondSale">
              Second Sale
            </label>
          </div>
        </div>
      </div>
      <br />
      <br />

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

      <!--  Remarks  -->
      <div class="row mb-3">
        <div class="col">
          <h3>Remarks</h3>
          <hr />
          <textarea
            class="form-control"
            name="remarks"
            id="remarksInput"
            v-model.trim="remarks"
            placeholder="Catatan..."
          ></textarea>
        </div>
      </div>
      <br />

      <!-- Grand total -->
      <div v-if="showTable">
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
              {{ formatNumber(totalAmount) }} Rupiah
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
              {{ formatNumber(netAmount) }} Rupiah
            </span>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div class="row mb-3">
        <div class="col-8"></div>
        <div class="col">
          <button
            class="btn btn-primary float-right"
            type="submit"
            :disabled="formHasErrors"
            data-toggle="modal"
            :data-target="`#${modalToOpen}`"
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

    <!-- First Sale picker modal -->
    <div
      class="modal fade"
      id="selectFirstSaleModal"
      tabindex="-1"
      aria-labelledby="selectFirstSaleModalLabel"
      aria-hidden="true"
      v-if="showPaymentModal && specialPromo"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="selectFirstSaleModalLabel">
              Select first sale
            </h5>
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
            <!-- prettier-ignore -->
            <div class="alert alert-info" :class="{'alertInfo': !showDiscountError, 'alert-danger': showDiscountError}" role="alert">
              <strong>{{ productIds.frames[0].productId }} </strong> has to be cheaper than the frame purchased in the first sale
            </div>

            <div class="form-group mb-2">
              <label for="firstSaleId">Select from this list</label>
              <select
                class="form-control"
                id="firstSaleId"
                v-model="selectedFirstSaleId"
              >
                <option value="0" selected disabled>Select first sale</option>
                <!-- prettier-ignore -->
                <option
                  v-for="sale in firstSaleList"
                  :key="sale.id"
                  :value="sale.saleId"
                >
                  Customer: {{ sale.customer.firstName }} {{ sale.customer.lastName }} -
                  Frame: {{ sale.saleDetailList[0].product.productName }} ({{sale.saleDetailList[0].product.productId}}) -
                  Price: {{ formatNumber(sale.grandTotal) }} Rupiah
                  Date/Time: {{new Date(sale.initialDepositDate).toUTCString()}}
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
              @click="resetSaleSelection"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-dismiss="modal"
              data-toggle="modal"
              data-target="#paymentModal"
              :disabled="showDiscountError || !selectedFirstSaleId"
              @click="applyDiscount"
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- End of first sale picker modal -->

    <!-- Payment Modal -->
    <div
      ref="modal"
      class="modal fade"
      id="paymentModal"
      data-backdrop="static"
      tabindex="-1"
      role="dialog"
      aria-labelledby="continueToPaymentBtn"
      aria-hidden="true"
      v-if="showPaymentModal"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Checkout</h5>
            <button
              v-if="!successfulSale"
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="!successfulSale">
              <div class="row mb-3">
                <div class="col">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="showDepositInfo"
                      id="showDepositInfo"
                      :disabled="
                        hasCustomerPaid || specialPromo || successfulSale
                      "
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
                      :disabled="showDepositInfo || successfulSale"
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
                        Jumlah Persentase Pembayaran
                      </label>
                      <div class="input-group mb-2">
                        <select
                          class="form-control"
                          v-model="selectedDepositPercentage"
                          :required="hasCustomerPaid"
                        >
                          <option value="0" disabled
                            >Pilih jumlah deposit</option
                          >
                          <option
                            v-for="amount in depositPercentages"
                            :key="amount.id"
                            :value="amount"
                          >
                            {{ amount }}%
                          </option>
                        </select>
                      </div>
                      <div class="input-group mb-3">
                        <span class="input-group-text" id="rupiah-currency"
                          >Rp</span
                        >
                        <input
                          type="text"
                          class="form-control"
                          :value="formatNumber(initialPaymentAmt)"
                          aria-label="initialPaymentAmount"
                          aria-describedby="rupiah-currency"
                          readonly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="hasCustomerPaid || showDepositInfo" class="row mb-3">
                <div class="col">
                  <div class="form-group">
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
                  <div
                    v-if="selectedPaymentType != 'Cash' && selectedPaymentType"
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
            <div v-else>
              <p>Please print the invoice</p>
            </div>
          </div>
          <div class="modal-footer">
            <div v-if="!successfulSale">
              <button
                type="button"
                class="btn btn-secondary mr-2"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button
                class="btn btn-success"
                :disabled="!validPaymentInfo"
                @click="createSale"
              >
                Create Sale
              </button>
            </div>
            <div v-else>
              <button
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
    </div>
    <!-- End of payment modal -->
    <Invoice
      :customer="currentCustomer"
      :employee-name="selectedEmployeeName"
      :products="productIds"
      :payment-type="selectedPaymentType"
      :account-num="accountNumber"
      :total-amt="totalAmount"
      :net-amt="netAmount"
      :depositAmt="initialPaymentAmt"
      :discount-percentage="discountPercentage"
      :updated-prescription="prescription"
      :new-sale-id="newSaleId"
      :fully-paid="hasCustomerPaid"
      :remarks="remarks"
      @donePrinting="resetData"
    />
  </div>
</template>
<script>
import axios from "axios";
import CustomerList from "@/components/CustomerList.vue";
import _ from "lodash";
import storeData from "@/storeData";
import Prescription from "@/components/Prescription.vue";
import Invoice from "../components/Invoice.vue";

const posEndpoint = "/posEndpoint";

const initialData = () => {
  return {
    loading: false,
    productIds: {
      frames: [],
      lenses: [],
      customLenses: [],
      misc: [],
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
    paymentTypes: ["Cash", "Debit", "Credit"],
    depositPercentages: [50, 60, 70, 80],
    selectedDepositPercentage: 0,
    selectedPaymentType: "",
    createNewCustomer: false,
    customerList: null,
    selectedCustomerId: null,
    hasCustomerPaid: false,
    showPaymentModal: false,
    firstFrameId: "",
    secondFrameId: "",
    saleNumber: 0,
    firstSaleList: [],
    selectedFirstSaleId: 0,
    showDiscountError: false,
    bankName: "",
    accountNumber: "",
    isMounted: false,
    newSaleId: null,
    successfulSale: false,
    remarks: "",
  };
};
export default {
  name: "SalesForm",
  components: {
    CustomerList,
    Prescription,
    Invoice,
  },
  data: initialData,
  created() {
    this.fetchDataFromServer();
  },
  mounted() {
    this.isMounted = true;
  },
  computed: {
    initialPaymentAmt() {
      // prettier-ignore
      const depositAmt = (this.netAmount * this.selectedDepositPercentage) / 100
      return Math.round(depositAmt / 10000) * 10000;
    },
    prescription() {
      if (this.isMounted) return this.$refs.prescriptionElem.prescriptionValues;

      return null;
    },
    showCustomerInfo() {
      if (!this.customerList && this.createNewCustomer) return true;

      return this.selectedCustomerId !== null || this.createNewCustomer;
    },
    currentCustomer() {
      if (!this.selectedCustomerId || this.createNewCustomer) {
        return {
          firstName: this.firstName,
          lastName: this.lastName,
          phoneNumber: this.phoneNum,
          email: this.email,
          customerId: 0,
          ...this.prescription,
        };
      }

      return this.getCustomer(this.selectedCustomerId);
    },
    selectedEmployeeName() {
      if (!this.selectedEmployeeId) return null;
      const { firstName, lastname: lastName } = this.employees.find(
        (e) => e.employeeId == this.selectedEmployeeId
      );
      return `${firstName} ${lastName}`;
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
    discountPercentage() {
      if (this.specialPromo && this.saleNumber === 1) return 0;

      const promo = this.promotions.find(
        (p) => p.promotionId == this.selectedPromotion
      );

      if (promo) {
        return promo.discountVal;
      }

      return 0;
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
        if (promo.discountVal !== 0 && !this.specialPromo) {
          const discountVal = netAmt * (promo.discountVal / 100);
          netAmt -= discountVal;
        }
      }

      return parseFloat(netAmt.toFixed(2));
    },
    validPaymentInfo() {
      if (this.selectedPaymentType === "Cash") return true;

      return (
        this.accountNumber &&
        this.bankName &&
        this.accountNumber.toString().length === 4
      );
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
    modalToOpen() {
      if (this.specialPromo && this.saleNumber === 2)
        return "selectFirstSaleModal";

      return "paymentModal";
    },
    specialPromo() {
      return this.selectedPromotion === 1 || this.selectedPromotion === 2;
    },
    showTable() {
      // prettier-ignore
      return this.productIds.frames.length > 0 || this.productIds.lenses.length > 0 || this.productIds.customLenses.length > 0
    },
  },
  methods: {
    resetFrameSelections() {
      this.firstFrameId = null;
      this.secondFrameId = null;
    },
    resetSaleSelection() {
      this.selectedFirstSaleId = 0;
      this.showDiscountError = false;
    },
    applyDiscount() {
      if (this.specialPromo) {
        let frame = this.productIds.frames[0];
        if (!frame.hasDiscountApplied) {
          const promo = this.promotions.find(
            (p) => p.promotionId == this.selectedPromotion
          );

          let discountAmt = frame.price * (promo.discountVal / 100);
          frame.price -= discountAmt;
          frame.hasDiscountApplied = true;
        }
      }
    },
    fetchDataFromServer() {
      axios
        .get(`${posEndpoint}/getCustomLensList`)
        .then((response) => {
          this.customLenses = response.data;
        })
        .catch((err) => console.error(err));

      axios
        .get(`${posEndpoint}/getStorePromotions?storeId=${storeData.storeId}`)
        .then((response) => {
          const promotionsReceived = response.data;
          this.promotions = promotionsReceived.map((p) => ({
            name: p.promotionName,
            discountVal: p.percentage,
            promotionId: p.promotionId,
          }));
          window.scrollTo(0, 0);
        })
        .catch((err) => console.error(err));

      axios
        .get(`${posEndpoint}/getStoreEmployees?storeId=${storeData.storeId}`)
        .then((response) => {
          this.employees = response.data;
        })
        .catch((err) => console.error(err));
    },
    resetData() {
      Object.assign(this.$data, initialData());
      this.isMounted = true;
      this.fetchDataFromServer();
    },
    formatNumber(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
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

        let promotionParentSaleId = null;

        if (this.selectedPromotion === 1) {
          if (this.saleNumber === 1) {
            promotionParentSaleId = -1;
          } else if (this.saleNumber === 2) {
            promotionParentSaleId = this.selectedFirstSaleId;
          }
        } else if (this.selectedPromotion === 2) {
          if (this.saleNumber === 1) {
            promotionParentSaleId = -2;
          } else if (this.saleNumber === 2) {
            promotionParentSaleId = this.selectedFirstSaleId;
          }
        }

        let initialDepositType = this.selectedPaymentType;
        if (this.selectedPaymentType !== "Cash") {
          initialDepositType += `:${this.bankName}:${this.accountNumber}`;
        }

        const newSaleObj = {
          sale: {
            promotionId:
              this.selectedPromotion > 0 ? this.selectedPromotion : null,
            promotionParentSaleId,
            grandTotal: `${this.netAmount}`,
            employeeId: this.selectedEmployeeId,
            storeId: storeData.storeId,
            initialDepositDate: new Date().toISOString(),
            initialDepositType,
            initialDepositAmount: this.showDepositInfo
              ? `${this.initialPaymentAmt}`
              : `${this.netAmount}`,
            remarks: this.remarks,
            products: productsToSend,
          },
          customerId: !this.createNewCustomer ? this.selectedCustomerId : null,
          customer: {
            firstName: this.firstName,
            lastName: this.lastName,
            phoneNumber: this.phoneNum,
            email: this.email,
            ...this.prescription,
          },
        };
        console.log(newSaleObj);
        axios
          .post(`${posEndpoint}/newSale`, newSaleObj)
          .then((response) => {
            console.log(response);
            this.newSaleId = response.data;
            alert("Sale created. Please print the invoice");
            this.successfulSale = true;
          })
          .catch((err) => {
            console.log(err.response);
            alert("Transaction was unsuccessful!");
            this.successfulSale = false;
          });
      }
    },
    validateBarcode(product) {
      if (product) {
        if (product.productId.length != 16) {
          product.barcodeError = "Length of barcode should be 16 characters";
        } else {
          axios
            .get(
              `${posEndpoint}/getInStoreProductQuantity?storeId=${storeData.storeId}&productId=${product.productId}`
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
              // prettier-ignore
              product.quantityError = product.quantity > quantityAvailable ? "Quantity requested is more than what is available in store" : null;
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
          hasDiscountApplied: false,
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
      if (this.validPhoneNum) {
        this.loading = true;
        this.createNewCustomer = false;
        axios
          .get(
            `${posEndpoint}/getCustomerByPhoneNumber?phoneNumber=${this.phoneNum}`
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
      this.email = selectedCustomer.email;

      // prescription info
      const newPrescriptionValues = {
        leftEyeSphere: selectedCustomer.leftEyeSphere,
        leftEyeCylinder: selectedCustomer.leftEyeCylinder,
        leftEyeAxis: selectedCustomer.leftEyeAxis,
        leftEyePrism: selectedCustomer.leftEyePrism,
        rightEyeSphere: selectedCustomer.rightEyeSphere,
        rightEyeCylinder: selectedCustomer.rightEyeCylinder,
        rightEyeAxis: selectedCustomer.rightEyeAxis,
        rightEyeAdd: selectedCustomer.rightEyeAdd,
        rightEyePrism: selectedCustomer.rightEyePrism,
        pupilDistance: selectedCustomer.pupilDistance,
      };
      this.$refs.prescriptionElem.setPrescriptionValues(newPrescriptionValues);

      this.selectedCustomerId = selectedCustomer.customerId;
    },
    resetCustomerInfo() {
      if (this.selectedCustomerId) {
        this.selectedCustomerId == null;

        //personal info
        this.phoneNum = "";
        this.email = "";

        // reset prescription info
        this.$refs.prescriptionElem.setPrescriptionValues(null);
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
    alertBuyOneGetOneIssue() {
      alert(
        "You must have one frame to use the Buy 1 Get 1 promo or 2nd Pairs Promo"
      );
      this.selectedPromotion = 0;
    },
  },
  watch: {
    selectedPromotion() {
      if (this.specialPromo) {
        if (this.productIds.frames.length != 1) {
          this.alertBuyOneGetOneIssue();
        }
      }
    },
    productIds: {
      deep: true,
      handler(newVal, oldVal) {
        if (this.selectedPromotion === 1) {
          if (newVal.frames.length != 1) {
            this.alertBuyOneGetOneIssue();
          }

          if (newVal.frames[0].productId != oldVal.frames[0].productId) {
            this.resetSaleSelection();
          }
        }
      },
    },
    saleNumber(val) {
      if (val === 2) {
        axios
          .get(
            `${posEndpoint}/getPromotionalFirstSaleList?storeId=${storeData.storeId}&promoId=${this.selectedPromotion}`
          )
          .then((response) => {
            console.log(response);
            this.firstSaleList = [...response.data];
          })
          .catch((err) => {
            alert(err.response.data);
            console.log(err);
          });
      }
    },
    selectedFirstSaleId(val) {
      if (val) {
        let { grandTotal: firstFrameCost } = this.firstSaleList.find(
          (s) => s.saleId == val
        );
        if (firstFrameCost) {
          const { price: frameCost } = this.productIds.frames[0];
          this.showDiscountError = !(frameCost <= firstFrameCost);
        }
      }
    },
    createNewCustomer(val) {
      if (!val) this.selectedCustomerId = null;
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
