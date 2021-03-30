<template>
  <div v-if="list">
    <div
      class="alert alert-warning alert-dismissible fade show"
      v-if="list.length === 0"
      role="alert"
    >
      Tidak ada pelanggan dapat ditemukan dengan nama yang diberikan
      <button
        type="button"
        class="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="row flex-row flex-nowrap overflow-auto mb-3">
      <div class="col-lg-auto" v-for="customer in list" :key="customer.id">
        <div class="card card-block">
          <div class="card-body">
            <h5 class="card-title">
              {{ customer.firstName }} {{ customer.lastName }}
            </h5>
            <p class="card-text">Email: {{ customer.email }}</p>
            <p class="card-text">No Telepon: {{ customer.phoneNumber }}</p>
            <button
              type="button"
              class="btn"
              :class="currentSelectedCustomerClass(customer.customerId)"
              @click="selectCustomer(customer.customerId)"
            >
              {{ currentSelectedCustomerText(customer.customerId) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "CustomerList",
  data: () => {
    return {
      selectedCustomerId: null,
    };
  },
  props: {
    list: Array,
  },
  methods: {
    selectCustomer(customerId) {
      this.selectedCustomerId = customerId;
      this.$emit("selectCustomer", customerId);
    },
    currentSelectedCustomerClass(customerId) {
      // prettier-ignore
      return this.isCustomerSelected(customerId) ? 'btn-success' : 'btn-primary'
    },
    currentSelectedCustomerText(customerId) {
      // prettier-ignore
      return this.isCustomerSelected(customerId) ? "Customer selected" : "Pilih Pelanggan";
    },
    isCustomerSelected(customerId) {
      return this.selectedCustomerId === customerId;
    },
  },
};
</script>
<style scoped>
.card {
  width: 18rem;
}
</style>
