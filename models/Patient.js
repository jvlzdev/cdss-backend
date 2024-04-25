const mongoose = require("mongoose");

const PatientSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    age: {
      type: Number,
    },
    homeAddress: {
      type: String,
    },
    gender: {
      type: String,
    },
    occupation: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    religion: {
      type: String,
    },
    weight: {
      type: String,
    },
    height: {
      type: String,
    },
    maritalStatus: {
      type: String,
    },
    birthday: {
      type: String,
    },
    nationality: {
      type: String,
    },
  },
  { minimize: false }
);

const Patient = mongoose.model("Patient", PatientSchema);

module.exports = Patient;
