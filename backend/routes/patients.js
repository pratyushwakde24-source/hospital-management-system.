const router = require('express').Router();
const Patient = require('../models/Patient');


router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/', async (req, res) => {
    const newPatient = new Patient(req.body);
    try {
        const savedPatient = await newPatient.save();
        res.json(savedPatient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        await Patient.findByIdAndDelete(req.params.id);
        res.json({ message: 'Patient deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;