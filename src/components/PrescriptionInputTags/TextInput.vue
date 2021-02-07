<template>
  <input
    class="form-control"
    :placeholder="options"
    v-model="textVal"
    @input="$emit('change')"
    required
  />
</template>
<script>
export default {
  name: "TextInput",
  props: ["options"],
  data: () => {
    return {
      textVal: "",
    };
  },
};
</script>
