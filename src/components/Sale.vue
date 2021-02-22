<template>
  <div class="card mb-3">
    <div class="card-body">
      <h5 class="card-title">
        {{ customer.firstName }} {{ customer.lastName }}
        <span class="small text-muted" style="font-size: 65% !important;">
          {{ new Date(transactionDate).toDateString() }}
        </span>
      </h5>
      <p class="card-text">Nomor Telepon: {{ customer.phoneNumber }}</p>
      <p class="card-text">Pembayaran Lunas: <i :class="iconClass"></i></p>
      <button
        @click="$emit('selectSale', saleId)"
        class="btn btn-primary btn-block"
        type="button"
      >
        Pilih Transaksi
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: "PendingSale",
  props: ["transactionDate", "customer", "paid", "saleId"],
  computed: {
    iconClass() {
      return this.paid
        ? "bi bi-check-circle-fill text-success"
        : "bi bi-x-circle-fill text-danger";
    },
  },
};
</script>
