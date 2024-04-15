const mongoose = require("mongoose");
const CarProvider = require("./CarProvider");
const Renting = require('../models/Renting');

const carSchema = new mongoose.Schema({
    carProvider: { // carProvider is Reference to which CarProvider's _id
        type: mongoose.Schema.ObjectId,
        ref: 'CarProvider',
        required: [true, "Please provide car provider"],
    },
    brand: { 
        type: String,
        required: [true, "Please provide car's brand"],
    },
    model: {
        type: String,
        required: [true, "Please provide car's model"],
    },
    price: {
        type: Number,
        required: [true, "Please provide car's rental price"],
        min: [0, "Price can't below than 0"],
    },
    // image: { ?????????????????????
    //     type: String,
        
    // }   
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Cascade delete renting when a car is deleted
carSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    console.log(`Renting being remove from car ${this._id}`);
    await Renting.deleteMany({ car: this._id });

    next();
});

carSchema.virtual("renting", {
    ref: "Renting",
    localField: "_id",
    foreignField: "car",
    justOne: false, 
  });

module.exports = mongoose.model("Car", carSchema);