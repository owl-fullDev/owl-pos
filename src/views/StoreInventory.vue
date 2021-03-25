<template>
  <div class="container mt-3 ">
    <div class="row">
      <div class="col">
        <b-table
            :data="products"
            :striped="true"
            :hoverable="true"
            :default-sort-direction="'asc'"
            :paginated="true"
            :pagination-rounded="true"
            :loading="loading"
            :per-page="25"
            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"
            aria-current-label="Current page"
        >
          <b-table-column
              field="product.productId"
              label="SKU #"
              sortable
              :searchable="searchable"
              v-slot="props"
          >
            {{ props.row.product.productId }}
          </b-table-column>
          <b-table-column
              field="product.productName"
              label="Name Produk"
              sortable
              :searchable="searchable"
              v-slot="props"
          >
            {{ props.row.product.productName }}
          </b-table-column>
          <b-table-column
              field="inStoreQuantity"
              label="Quantitas Produk"
              sortable
              v-slot="props"
          >
            {{ props.row.instoreQuantity }}
          </b-table-column>
          <b-table-column
              field="setStoreQuantity"
              label="Quantitas Ditetapkan"
              sortable
              v-slot="props"
          >
            {{ props.row.setQuantity }}
          </b-table-column>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import storeData from "@/storeData";
import {
  faArrowUp,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faArrowUp, faAngleRight, faAngleLeft);

const apiUrl = "https://owl-backend-server.herokuapp.com";

export default {
  name: "StoreInventory",
  data: () => {
    return {
      products: [],
      loading: false,
      searchable: true
    };
  },
  created() {
    axios
        .get(`${apiUrl}/hoStoresEndpoint/getStoreQuantity?storeId=${storeData.storeId}`)
        .then((response) => {
          this.products = [...response.data];
          this.loading = false;
        })
        .catch((err) => console.log(err));
    },
};
</script>

<style>
@media screen and (min-width: 769px), print {
  .pagination-list {
    margin-bottom: 0 !important;
  }
}
</style>
