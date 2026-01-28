const router = require('express').Router();
const Bill = require('../models/Bill');


router.get('/', async (req, res) => {
    try {
        const bills = await Bill.find().populate('patientId', 'name');
        res.json(bills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/', async (req, res) => {
    const newBill = new Bill(req.body);
    try {
        const savedBill = await newBill.save();
        res.json(savedBill);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;