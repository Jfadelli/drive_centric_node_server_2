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


// Get all vehicles in DB
app.get(`/api/vehicles/`, async (req, res) => {
    try {
        const vehicles = await Vehicle.find({});
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

// Get one vehicle in DB
app.get('/api/vehicle/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const vehicle = await Vehicle.findById(id);  
        res.status(200).json(vehicle)
    } catch (error) {
        console.log(error, req.body);
        res.status(500).json({ message: error.message });
    }
})

// Update one vehicle in DB
app.put('/api/vehicle/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const vehicle = await Vehicle.findByIdAndUpdate(id, req.body);  
        if (!vehicle) {
            res.status(404).json({message: "Vehicle not found... =("})
        }
        const updatedVehicle = await Vehicle.findById(id);
         res.status(200).json(updatedVehicle)
    } catch (error) {
        console.log(error, req.body);
        res.status(500).json({ message: error.message });
    }
})

// Delete one vehicle in DB
app.delete('/api/vehicle/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const vehicle = await Vehicle.findByIdAndDelete(id);
        if (!vehicle) {
            return res.status(404).json({message: "Product not found... =("});
        }
        res.status(200).json({message: "Vehicle deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

// Delete ALL vehicles in DB
app.delete('/api/vehicles/ireallymeanthis', async (req, res) => {
    try{
        const vehicle = await Vehicle.deleteMany({});

        if (vehicle) {
            return res.status(404).json({message: "No vehicles found... =("});
        }
        res.status(200).json({message: "All vehicles deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});




// Add one vehicle to DB
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