require('dotenv').config();
const axios = require('axios');
const Vehicle = require('./models/vehicle.model'); // Assuming your model file is in the 'models' directory

const vehicleDetailsEndpoint = process.env.VEHICLE_DETAILS_ENDPOINT;

async function getVehicleInfo(vin, bearerToken) {
    try {
        const requestBody = {
            vin,
            dealerCode: process.env.DEALER_CODE // Replace with your dealer code
        };

        const response = await axios.post(vehicleDetailsEndpoint, requestBody, {
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        });

        const vehicleData = response.data;

        // Map the response data to your Vehicle model
        const vehicleInfo = {
            dealerName: vehicleData.retailDealer, // Map this field based on the actual response structure
            status: vehicleData.statusDesc,
            eta: vehicleData.eta, // Assuming there's an ETA field in the response
            msrp: vehicleData.msrpTotal,
            optionCode: vehicleData.accessoryCode,
            color: vehicleData.exterior,
            model: vehicleData.model,
            vin: vehicleData.vin
        };

        console.log(vehicleInfo);
        // You can now save vehicleInfo to your database or use it as needed
    } catch (error) {
        console.error(`Error fetching vehicle info for VIN ${vin}:`, error.message);
    }
}

module.exports = { getVehicleInfo };
// Example usage
// getVehicleInfo('YOUR_VIN_HERE'); // Replace with the VIN you want to look up
