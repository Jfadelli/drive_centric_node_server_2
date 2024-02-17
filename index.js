const express = require('express');
const mongoose = require('mongoose');
const Vehicle = require('./models/vehicle.model')
require('dotenv').config()
const app = express()
app.use(express.json())


app.listen(3000, () => {
    console.log("Server is running on port 3000")
});

app.get('/', (req, res) => {
    res.send("Hello from the Node API Server!")

});

app.post('/api/vehicle', async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        const vehicle = await Vehicle.create(req.body);
        res.status(200).json(vehicle);
    } catch (error) {
        console.log(error, req.body);
        res.status(500).json({ message: error.message });
    }
});

mongoose.connect(`mongodb+srv://admin:${process.env.DB_PASSWORD}@jigglebits.0bfsdac.mongodb.net/Node-API?retryWrites=true&w=majority`)
    .then(() => console.log('Connected!'))
    .catch(() => {
        console.log("connection failed")
    });