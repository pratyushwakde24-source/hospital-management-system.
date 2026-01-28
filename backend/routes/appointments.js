const router = require('express').Router();
const Appointment = require('../models/Appointment');


router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find().populate('patientId', 'name');
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/', async (req, res) => {
    const newAppointment = new Appointment(req.body);
    try {
        const savedAppointment = await newAppointment.save();
        res.json(savedAppointment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Appointment deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 