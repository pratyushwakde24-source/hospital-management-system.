const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();


app.use(cors());
app.use(express.json());


const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/hospital_db";


mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));



app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/patients', require('./routes/patients'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/billing', require('./routes/billing'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));