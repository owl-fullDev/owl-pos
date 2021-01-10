<template>
  <div class="card mb-3">
    <div class="card-body">
      <h5 class="card-title">
        {{ customerName }}
        <span class="small text-muted" style="font-size: 65% !important;">
          id: {{ saleId }}
        </span>
      </h5>
      <p class="card-text">Sudah Bayar: <i :class="iconClass"></i></p>
      <button
        @click="$emit('selectSale', saleId)"
        class="btn btn-primary btn-block"
        type="button"
      >
        Select sale
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: "PendingSale",
  props: ["saleId", "customerName", "paid"],
  computed: {
    iconClass() {
      return this.paid
        ? "bi bi-check-circle-fill text-success"
        : "bi bi-x-circle-fill text-danger";
    },
  },
};
</script>
