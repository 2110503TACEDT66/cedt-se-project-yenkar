const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const CarProviderSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please specify your email"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please specify a password"],
      minlength: [8, "Password length must be at least 8 characters"],
      select: false,
    }, //////////////////////////////////////////////////////
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    telephone: {
      type: String,
      required: [true, "Please add a telephone"],
      maxlength: [10, "Phone number can not be longer than 10 characters"],
    },
    balance: {
      type: Number,
      min: [0, "Balance can't below than 0"],
      default: 0,
    },
    role: {
      type: String,
      default: "carProvider",
    },
    src: {
      type: String,
      required: [true, 'Please provide carProvider image']
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
///////
//Encrypt user password before store in Database
CarProviderSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign a token
CarProviderSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, type: "carProvider" },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

//Check if password is match
CarProviderSchema.methods.isPasswordMatch = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/////

CarProviderSchema.virtual("renting", {
  ref: "Renting",
  localField: "_id",
  foreignField: "carProvider",
  justOne: false,
});

CarProviderSchema.virtual("cars", {
  ref: "Car",
  localField: "_id",
  foreignField: "carProvider",
  justOne: false,
});

CarProviderSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`Renting being removed from carProvider ${this._id}`);
    await this.model("Renting").deleteMany({ carProvider: this._id });
    next();
  }
);

module.exports = mongoose.model("CarProvider", CarProviderSchema);
