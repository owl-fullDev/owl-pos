<template>
  <div class="row flex-row flex-nowrap overflow-auto mb-3">
    <div class="col" v-for="customer in list" :key="customer.id">
      <div class="card card-block">
        <div class="card-body">
          <h5 class="card-title">
            {{ customer.firstName }} {{ customer.lastName }}
          </h5>
          <p class="card-text">Email: {{ customer.email }}</p>
          <p class="card-text">Phone # : {{ customer.phoneNumber }}</p>
          <button
            type="button"
            class="btn btn-primary"
            @click="selectCustomer(customer.customerId)"
          >
            Select Customer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "CustomerList",
  props: {
    list: Array,
  },
  methods: {
    selectCustomer(customerId) {
      this.$emit("selectCustomer", customerId);
    },
  },
};
</script>
<style scoped>
.card {
  width: 18rem;
}
</style>
