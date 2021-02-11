<template>
  <!-- Prescription -->
  <div class="row" v-show="showPrescription">
    <div class="col">
      <div class="mt-3 row">
        <div class="col">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="showPrescriptionInputs"
              id="prescriptionCheck"
            />
            <span class="h4 form-check-label" for="prescriptionCheck">
              Prescription
            </span>
          </div>
        </div>
      </div>
      <div class="row" v-show="showPrescriptionInputs">
        <div class="col">
          <!-- Right Eye -->
          <h6>Right eye</h6>
          <div class="row mb-3">
            <PrescriptionInput
              :name="'Sphere'"
              :side="'Right'"
              v-model="prescriptionValues.rightEyeSphere"
            />
            <PrescriptionInput
              :name="'Cylinder'"
              :side="'Right'"
              v-model="prescriptionValues.rightEyeCylinder"
            />
            <PrescriptionInput
              :name="'Axis'"
              :side="'Right'"
              v-model="prescriptionValues.rightEyeAxis"
            />
            <PrescriptionInput
              :name="'Progressive'"
              :side="'Right'"
              v-model="prescriptionValues.rightEyeAdd"
            />
            <PrescriptionInput
              :name="'Prism'"
              :side="'Right'"
              v-model="prescriptionValues.rightEyePrism"
            />
            <PrescriptionInput
              :name="'PD'"
              :side="'Right'"
              v-model="prescriptionValues.pupilDistance"
            />
          </div>

          <!-- Left Eye -->
          <h6>Left eye</h6>
          <div class="row mb-3">
            <PrescriptionInput
              :name="'Sphere'"
              :side="'Left'"
              v-model="prescriptionValues.leftEyeSphere"
            />
            <PrescriptionInput
              :name="'Cylinder'"
              :side="'Left'"
              v-model="prescriptionValues.leftEyeCylinder"
            />
            <PrescriptionInput
              :name="'Axis'"
              :side="'Left'"
              ref="leftEyeAxis"
              v-model="prescriptionValues.leftEyeAxis"
            />
            <PrescriptionInput
              :name="'Progressive'"
              :side="'Left'"
              v-model="prescriptionValues.leftEyeAdd"
            />
            <PrescriptionInput
              :name="'Prism'"
              :side="'Left'"
              v-model="prescriptionValues.leftEyePrism"
            />

            <div class="col"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PrescriptionInput from "@/components/PrescriptionInput.vue";

const prescriptionDetails = {
  leftEyeSphere: 0,
  leftEyeCylinder: 0,
  leftEyeAxis: 0,
  leftEyeAdd: 0,
  leftEyePrism: 0,
  rightEyeSphere: 0,
  rightEyeCylinder: 0,
  rightEyeAxis: 0,
  rightEyeAdd: 0,
  rightEyePrism: 0,
  pupilDistance: 0,
};
export default {
  name: "Prescription",
  props: ["showPrescription"],
  components: {
    PrescriptionInput,
  },
  data: () => {
    return {
      prescriptionValues: { ...prescriptionDetails },
      showPrescriptionInputs: false,
    };
  },
  watch: {
    showPrescriptionInputs(val) {
      if (!val) {
        console.log(val, "HERE", prescriptionDetails);
        Object.assign(this.prescriptionValues, { ...prescriptionDetails });
      }
    },
  },
};
</script>
