<template>
  <!-- Prescription -->
  <div class="row" v-show="showPrescription">
    <div class="col">
      <div class="mt-3 row">
        <div class="col">
          <h5>Prescription</h5>
        </div>
      </div>
      <!-- Right Eye -->
      <h6>Right eye</h6>
      <div class="row mb-3">
        <PrescriptionInput
          :name="'Sphere'"
          :side="'Right'"
          v-model="rightEyeSphere"
        />
        <PrescriptionInput
          :name="'Cylinder'"
          :side="'Right'"
          v-model="rightEyeCylinder"
        />
        <PrescriptionInput
          :name="'Axis'"
          :side="'Right'"
          v-model="rightEyeAxis"
        />
        <PrescriptionInput
          :name="'Progressive'"
          :side="'Right'"
          v-model="rightEyeAdd"
        />
        <PrescriptionInput
          :name="'Prism'"
          :side="'Right'"
          v-model="rightEyePrism"
        />
        <PrescriptionInput
          :name="'PD'"
          :side="'Right'"
          v-model="pupilDistance"
        />
      </div>

      <!-- Left Eye -->
      <h6>Left eye</h6>
      <div class="row mb-3">
        <PrescriptionInput
          :name="'Sphere'"
          :side="'Left'"
          v-model="leftEyeSphere"
        />
        <PrescriptionInput
          :name="'Cylinder'"
          :side="'Left'"
          v-model="leftEyeCylinder"
        />
        <PrescriptionInput
          :name="'Axis'"
          :side="'Left'"
          v-model="leftEyeAxis"
        />
        <PrescriptionInput
          :name="'Progressive'"
          :side="'Left'"
          v-model="leftEyeAdd"
        />
        <PrescriptionInput
          :name="'Prism'"
          :side="'Left'"
          v-model="leftEyePrism"
        />

        <div class="col"></div>
      </div>
    </div>
  </div>
</template>
<script>
import PrescriptionInput from "@/components/PrescriptionInput.vue";

export default {
  name: "Prescription",
  props: ["showPrescription"],
  components: {
    PrescriptionInput,
  },
  data: () => {
    return {
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
  },
  methods: {},
};
</script>
