export const PrescriptionDetails = [
  {
    name: "SPH",
    inputs: [
      {
        signValues: ["+", "-"],
        component: "SelectInput",
        defaultVal: "+",
      },
      {
        min: 0,
        max: 12,
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
    name: "CYL",
    inputs: [
      {
        signValues: ["-"],
        component: "SelectInput",
        defaultVal: "-",
      },
      {
        min: 0,
        max: 6,
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
    name: "ADD",
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
    name: "P.Height",
    inputs: [
      {
        component: "TextInput",
        defaultVal: "",
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
