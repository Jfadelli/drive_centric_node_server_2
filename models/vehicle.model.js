const mongoose = require('mongoose')

const vehicleSchema = mongoose.Schema(
    {
        dealerName: { type: String, required: true },
        status: { type: String, required: true },
        eta: { type: String, required: true },
        msrp: { type: String, required: true },
        optionCode: { type: String, required: true },
        color: { type: String, required: true },
        model: { type: String, required: true },
        trim: { type: String, required: true },
        vin: { type: String, required: false },
    }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema)
module.exports = Vehicle;
