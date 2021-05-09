<template>
  <div class="container-fluid mt-2">
    <div
      class="alert alert-warning alert-dismissible fade show"
      role="alert"
      v-if="statusMessage"
    >
      <span>{{ statusMessage }}</span>
      <button
        type="button"
        class="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <h1>Buat Kiriman antar toko</h1>
    <hr />
    <br />
    <form @submit="createShipment($event)">
      <h4>Pilih Toko Destinasi:</h4>
      <div class="row mb-3">
        <div class="col">
          <select
            required
            class="custom-select custom-select-lg mb-3"
            v-model="destinationId"
          >
            <option value="" selected disabled>Pilih toko</option>
            <option
              v-for="store in stores"
              :key="store.id"
              :value="store.storeId"
            >
              {{ store.name }}
            </option>
          </select>
        </div>
        <div class="col"></div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <button
            class="btn btn-primary mr-2"
            type="button"
            @click="addBarcodeInput"
          >
            Tambah Produk
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
      <div
        class="mb-3 row"
        v-for="(product, index) in products"
        :key="product.id"
      >
        <div class="col">
          <label for="ProductId" class="form-label">Barcode</label>
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
            @change="validateBarcode(index)"
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
            @change="validateProductQuantity(index)"
            :disabled="product.barcodeError || !product.productId"
          />
          <small class="form-text text-danger">
            {{ product.quantityError }}
          </small>
        </div>
        <div class="col-2">
          <label for="Remove Product" class="form-label">
            Batalkan Produk
          </label>
          <button
            class="btn btn-danger form-control"
            type="button"
            @click="removeProduct(index)"
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
      <div class="row">
        <div class="col-4 align-middle">
          <button class="btn btn-danger form-control" type="submit">
            Buat Kiriman baru
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import storeData from "@/storeData";
import _ from "lodash";

// // prettier-ignore
const apiUrl = "https://owl-server-5twzqfhlba-et.a.run.app";

export default {
  name: "CreateShipment",
  data: () => {
    return {
      statusMessage: "",
      destinationId: 0,
      stores: [],
      products: [],
      barcode: null,
    };
  },
  created() {
    axios
      .get(`${apiUrl}/posEndpoint/getAllStores`)
      .then((response) => {
        this.stores = response.data.filter(
          (s) => s.storeId != storeData.storeId
        );
      })
      .catch((err) => console.log(err));
  },
  computed: {
    formHasErrors() {
      let barcodeErrors = _.some(
        this.products,
        (p) => p.barcodeError || p.quantityError
      );
      return barcodeErrors;
    },
  },
  methods: {
    addBarcodeInput() {
      this.products.push({
        productId: "",
        quantity: 1,
        barcodeError: "",
        quantityError: "",
        availableAmt: 1,
        name: "",
      });
    },
    validateBarcode(index) {
      let product = this.products[index];
      if (product) {
        // if (product.productId.length != 16) {
        //   product.barcodeError = "Length of barcode should be 16 characters";
        // } else {
        // }
        axios
          .get(
            `${apiUrl}/posEndpoint/getInStoreProductQuantity?storeId=${storeData.storeId}&productId=${product.productId}`
          )
          .then((response) => {
            let { quantity: quantityAvailable, productName } = response.data;
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
    },
    validateProductQuantity(index) {
      let product = this.products[index];
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
    removeProduct(index) {
      this.products.splice(index, 1);
    },
    createShipment(e) {
      e.preventDefault();
      if (this.formHasErrors) {
        alert("Form has error: ");
      } else if (this.products.length === 0) {
        alert("No products added to shipment");
      } else {
        const formattedProducts = this.products.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
        }));
        const shipment = {
          originType: 3,
          destinationType: 3,
          originId: storeData.storeId,
          destinationId: this.destinationId,

          shipmentDetailList: formattedProducts,
        };
        axios
          .post(`${apiUrl}/posEndpoint/newTransferShipment`, shipment)
          .then((response) => {
            alert(response.data);
          })
          .catch((err) => alert(err));
      }
    },
  },
};
</script>
