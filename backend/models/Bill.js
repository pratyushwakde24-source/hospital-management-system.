const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bill', BillSchema); 