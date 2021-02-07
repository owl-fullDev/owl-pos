<template>
  <select
    v-model="selectedVal"
    class="custom-select"
    @change="$emit('change')"
    required
  >
    <option v-for="value in options" :key="value.id" :value="value">
      {{ value }}
    </option>
  </select>
</template>
<script>
export default {
  name: "SelectInput",
  props: ["options", "default"],
  data: function() {
    return {
      selectedVal: this.default ?? 0,
    };
  },
};
</script>
