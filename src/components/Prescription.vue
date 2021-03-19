<template>
  <!-- Prescription -->
  <div class="row" v-show="showPrescription">
    <div class="col">
      <div class="mt-3 row">
        <div class="col">
          <h4>
            Resep Kacamata
          </h4>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <!-- Right Eye -->
          <h4>Mata Kanan (R)</h4>
          <div class="row mb-3">
            <!-- SPH -->
            <PrescriptionInput
              :name="'SPH'"
              :side="'Kanan'"
              v-model="prescriptionValues.rightEyeSphere"
            />
            <!-- CYL -->
            <PrescriptionInput
              :name="'CYL'"
              :side="'Kanan'"
              v-model="prescriptionValues.rightEyeCylinder"
            />
            <!-- AXIS -->
            <PrescriptionInput
              :name="'Axis'"
              :side="'Kanan'"
              v-model="prescriptionValues.rightEyeAxis"
            />
            <!-- ADD -->
            <PrescriptionInput
              :name="'ADD'"
              :side="'Kanan'"
              v-model="prescriptionValues.rightEyeAdd"
            />
            <!-- PRISM -->
            <PrescriptionInput
              :name="'P.Height'"
              :side="'Kanan'"
              v-model="prescriptionValues.rightEyePrism"
            />
            <PrescriptionInput
              :name="'PD'"
              :side="'Kanan'"
              v-model="prescriptionValues.pupilDistance"
            />
          </div>
          <br />

          <!-- Left Eye -->
          <h4>Mata Kiri (L)</h4>
          <div class="row mb-3">
            <PrescriptionInput
              :name="'SPH'"
              :side="'Kiri'"
              v-model="prescriptionValues.leftEyeSphere"
            />
            <PrescriptionInput
              :name="'CYL'"
              :side="'Kiri'"
              v-model="prescriptionValues.leftEyeCylinder"
            />
            <PrescriptionInput
              :name="'Axis'"
              :side="'Kiri'"
              ref="leftEyeAxis"
              v-model="prescriptionValues.leftEyeAxis"
            />
            <PrescriptionInput
              :name="'ADD'"
              :side="'Kiri'"
              v-model="prescriptionValues.leftEyeAdd"
            />
            <PrescriptionInput
              :name="'P.Height'"
              :side="'Kiri'"
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
  leftEyePrism: "",
  rightEyeSphere: 0,
  rightEyeCylinder: 0,
  rightEyeAxis: 0,
  rightEyeAdd: 0,
  rightEyePrism: "",
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
    };
  },
  methods: {
    resetPrescriptionValues() {
      Object.assign(this.prescriptionValues, { ...prescriptionDetails });
    },
    setPrescriptionValues(newValues) {
      if (newValues) {
        Object.assign(this.prescriptionValues, { ...newValues });
      } else {
        this.resetPrescriptionValues();
      }
    },
  },
  watch: {
    showPrescription(val) {
      if (!val) {
        this.resetPrescriptionValues();
      }
    },
  },
};
</script>
