const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    contact: { type: String, required: true },
    medicalHistory: { type: Array, default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema); 