<template>
  <div class="col">
    <div class="form-group mb-2">
      <label class="form-label">
        <span v-if="showSide">Mata {{ side }} </span> {{ name }}
      </label>
    </div>
    <div class="row ">
      <div
        class="col"
        v-for="input in inputs"
        :key="input.id"
        :class="{ noPadding: inputs.length > 1 }"
      >
        <component
          :is="input.component"
          :options="getValuesForInput(input)"
          :default="input.defaultVal"
          @change="updateFinalVal"
        ></component>
      </div>
    </div>
  </div>
</template>
<script>
import { PrescriptionDetails } from "@/variables.js";
import SelectInput from "@/components/PrescriptionInputTags/SelectInput.vue";
import TextInput from "@/components/PrescriptionInputTags/TextInput.vue";

import _ from "lodash";

export default {
  name: "PrescriptionInput",
  props: ["name", "side", "value"],
  components: {
    SelectInput,
    TextInput,
  },
  model: {
    prop: "value",
    event: "change",
  },
  data: () => {
    return {
      prescriptionDetails: null,
      finalVal: 0.0,
    };
  },
  created() {
    this.prescriptionDetails = _.find(PrescriptionDetails, { name: this.name });
  },
  computed: {
    inputs() {
      return this.prescriptionDetails.inputs;
    },
    showSide() {
      return this.name != "PD";
    },
  },
  methods: {
    updateFinalVal() {
      if (this.name === "SPH" || this.name === "CYL") {
        const sign = this.$children[0].selectedVal;
        const wholeNum = parseFloat(this.$children[1].selectedVal);
        const decimalVal = parseFloat(this.$children[2].selectedVal);

        this.finalVal = parseFloat(`${sign}${wholeNum + decimalVal}`);
      } else if (this.name === "P.Height") {
        this.finalVal = this.$children[0].textVal;
      } else {
        this.finalVal = parseFloat(this.$children[0].selectedVal);
      }
    },
    getValuesForInput(input) {
      if (input.signValues) {
        return input.signValues;
      } else {
        if (!input.placeholder) {
          let options = [];

          for (let i = input.min; i <= input.max; i += input.interval) {
            let valueToShow = i;
            if (input.interval === 0.25) {
              if (this.name === "SPH" || this.name === "CYL") {
                valueToShow = i.toFixed(2).replace(/^0/, "");
              } else {
                valueToShow = i.toFixed(2);
              }
            }
            options.push(valueToShow);
          }

          return options;
        } else {
          return input.placeholder;
        }
      }
    },
  },
  watch: {
    finalVal: {
      handler(val) {
        console.log("FINAL VAL CHANGED");
        this.$emit("change", val);
      },
    },
    value: {
      handler(val) {
        console.log("VAL CHANGED", val, this.name, this.side);
        if (val !== null) {
          this.finalVal = val;
          if (this.name === "SPH" || this.name === "CYL") {
            if (val < 0) {
              this.$children[0].selectedVal = "-";
            } else {
              this.$children[0].selectedVal = "+";
            }
            this.$children[1].selectedVal = Math.abs(Math.trunc(val));

            this.$children[2].selectedVal = Math.abs(val % 1)
              .toFixed(2)
              .replace(/^0/, "");
          } else if (this.name === "P.Height") {
            this.$children[0].textVal = val;
          } else {
            if (this.inputs[0].interval === 0.25) {
              this.$children[0].selectedVal = val.toFixed(2);
            } else {
              this.$children[0].selectedVal = val;
            }
          }
        } else {
          this.finalVal = 0;
        }
      },
    },
  },
};
</script>
<style>
.noPadding:first-child {
  padding-right: 0 !important;
}

.noPadding:nth-child(2) {
  padding-right: 0 !important;
  padding-left: 0 !important;
}

.noPadding:last-child {
  padding-left: 0 !important;
}
</style>
