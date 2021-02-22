export const PrescriptionDetails = [
  {
    name: "Sphere",
    inputs: [
      {
        signValues: ["+", "-"],
        component: "SelectInput",
      },
      {
        min: 0,
        max: 20,
        interval: 1,
        component: "SelectInput",
      },
      {
        min: 0,
        max: 0.75,
        interval: 0.25,
        component: "SelectInput",
        defaultVal: ".00",
      },
    ],
  },
  {
    name: "Cylinder",
    inputs: [
      {
        signValues: ["+", "-"],
        component: "SelectInput",
      },
      {
        min: 0,
        max: 5,
        interval: 1,
        component: "SelectInput",
      },
      {
        min: 0,
        max: 0.75,
        interval: 0.25,
        component: "SelectInput",
        defaultVal: ".00",
      },
    ],
  },
  {
    name: "Axis",
    inputs: [
      {
        min: 0,
        max: 180,
        interval: 1,
        component: "SelectInput",
      },
    ],
  },
  {
    name: "Progressive",
    inputs: [
      {
        min: 0,
        max: 3,
        interval: 0.25,
        component: "SelectInput",
        defaultVal: "0.00",
      },
    ],
  },
  {
    name: "Prism",
    inputs: [
      {
        placeholder: "Nilai Prism",
        component: "TextInput",
      },
    ],
  },
  {
    name: "PD",
    inputs: [
      {
        min: 0,
        max: 200,
        interval: 1,
        component: "SelectInput",
      },
    ],
  },
];
