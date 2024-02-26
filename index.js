const express = require('express');
const mongoose = require('mongoose');
const Vehicle = require('./models/vehicle.model')
const { fetchBearerToken } = require('./fetchBearerToken')
require('dotenv').config()
const app = express()
app.use(express.json())

app.listen(3000, () => {
    console.log("Server is running on port 3000")
});

app.get('/', (req, res) => {
    res.send("Hello from the Node API Server!")

});

async function getBearerToken() {
    const bearerToken = await fetchBearerToken()
    console.log(`async function getBearerTOken, index.js: ${bearerToken}`)
}
try {
    getBearerToken()
} catch (error) {
    console.log(error)
}
// Get all vehicles in DB
app.get(`/api/vehicles/`, async (req, res) => {
    try {
        const vehicles = await Vehicle.find({});
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// Get one vehicle in DB
app.get('/api/vehicle/:id', async (req, res) => {
    try {
        const { id } = req.params;
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
        const { id } = req.params;
        const vehicle = await Vehicle.findByIdAndUpdate(id, req.body);
        if (!vehicle) {
            res.status(404).json({ message: "Vehicle not found... =(" })
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
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findByIdAndDelete(id);
        if (!vehicle) {
            return res.status(404).json({ message: "Product not found... =(" });
        }
        res.status(200).json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

// Delete ALL vehicles in DB
app.delete('/api/vehicles/ireallymeanthis', async (req, res) => {
    try {
        const vehicle = await Vehicle.deleteMany({});

        if (!vehicle) {
            return res.status(404).json({ message: "No vehicles found... =(" });
        }
        res.status(200).json({ message: "All vehicles deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message })
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

//Get a Monroney for one vehicle from KD
app.get('/getMonroney/:vin', async (req, res) => {
    // Extract the VIN from the URL params
    const { vin } = req.params;
  
    // Define the request body with the VIN
    const requestBody = { vin };
  
    // Define the request headers and bearer token
    const headers = { 'Content-Type': 'application/json' };
  
    // Define the URL for the endpoint that returns the PDF
    const endpointURL = process.env.GET_MONRONEY_ENDPOINT; // Replace with the actual endpoint URL
  
    // Define the POST request configuration
    const config = {
      headers: {
        ...headers,
        Authorization: `Bearer ${bearerToken}`
      },
      responseType: 'json' // Set the response type to 'json'
    };
  
    try {
      // Make the POST request to the endpoint
      const response = await axios.post(endpointURL, requestBody, config);
  
      // Decode the base64-encoded PDF data
      const decodedData = Buffer.from(response.data.base64MonroneyPDF, 'base64');
  
      // Set the response headers for file download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="monroney ${vin}.pdf"`);
  
      // Send the decoded data as the response
      res.send(decodedData);
    } catch (error) {
      // Handle any errors that occurred during the request
      res.status(500).json({ error: error.message });
      console.log('Updating bearerToken');
      bearerToken = await fetchBearerToken();
      console.log('bearer token updated :', bearerToken)
    }
  });

  //Get one vehicle from KD
  
   
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });



mongoose.connect(`mongodb+srv://admin:${process.env.DB_PASSWORD}@jigglebits.0bfsdac.mongodb.net/Node-API?retryWrites=true&w=majority`)
    .then(() => console.log('Connected!'))
    .catch(() => {
        console.log("connection failed")
    });