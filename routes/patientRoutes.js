const router = require("express").Router();
const Patient = require("../models/Patient");

router.post("/", async (req, res) => {
  try {
    await Patient.create(req.body);
    const patients = await Patient.find();
    res.status(201).json(patients);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    console.log("patients", patients);
    res.json(patients);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
