const mongoose = require("mongoose");
const CarProvider = require("./CarProvider");
const Renting = require("../models/Renting");

const carSchema = new mongoose.Schema(
  {
    carProvider: {
      // carProvider is Reference to which CarProvider's _id
      type: mongoose.Schema.ObjectId,
      ref: "CarProvider",
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
    doors: {
      type: Number,
      required: [true, "Please provide car's door"],
      min: [1, "Door can't below than 1"]
    },
    seats: {
      type: Number,
      required: [true, "Please provide car's seats number"],
      min: [1, "Seat can't below than 1"]
    },
    transmission: {
      type: String,
      enum: ["manual", "auto", "AWT", "other"],
      default: "other",
    },
    cargo: {
      type: String,
      enum: ["-", "small", "medium", "large", "super large"],
      default: "-",
    },
    radio: {
      type: Boolean,
      default: false,
    },
    air: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: [true, "Please provide car's rental price"],
      validate: {
        validator: function(value) {
          return value > 0;
        },
        message: "Price must be greater than 0"
      }
    },
    src: {
      type: String,
    },

    vrm: {
      type: String,
      required: [true, "Please provide car's plate number"],
      unique: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Cascade delete renting when a car is deleted
carSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`Renting being remove from car ${this._id}`);
    await Renting.deleteMany({ car: this._id });
    next();
  }
);

carSchema.virtual("renting", {
  ref: "Renting",
  localField: "_id",
  foreignField: "car",
  justOne: false,
});

module.exports = mongoose.model("Car", carSchema);
