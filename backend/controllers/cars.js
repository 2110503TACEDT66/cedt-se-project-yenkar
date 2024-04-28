const Car = require('../models/Car');
const CarProvider = require('../models/CarProvider');
const Provider = require("../models/CarProvider");
const Renting = require('../models/Renting');
const User = require('../models/User');

//@desc     add a Car to The Store
//@route    POST /api/v1/carproviders/:carProviderId/cars
//@access   Private
exports.addCar = async (req, res, next) => {
    try {
        //ถือว่า user = carProvider
        req.body.carProvider = req.user.id;
        //console.log(req.user);
    
        const carProvider = await Provider.findById(req.body.carProvider);
        //console.log(carProvider);
        if (!carProvider)
        return res.status(400).json({
          success: false,
          message: `No car provider with the ID of ${req.params.id}`,
        });

        //console.log(req.user.id);
        
        const car = await Car.create(req.body);
        res.status(201).json({
            success:true,
            data:car
        });

    
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Car has not been added" });
    }
  };

  //@desc     Update a Car
  //@route    PUT /api/v1/cars/:id
  //@access   Private
  exports.updateCar=async(req,res,next) => {

    try{
        const car = await Car.findById(req.params.id);
        if(!car){
            res.status(400).json({success:false});
        }
        else if (req.user.id != car.carProvider.toString() && req.user.role != 'admin') {
          return res.status(400).json({success: false, message: `Not authorized to update the car with id ${req.params.id}!`});
        }
        const carUpdate = await Car.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true
      });

        res.status(200).json({
            success:true,
            data:carUpdate
        });
        
    } catch(err){
        res.status(400).json({success:false});
    }
};



//@desc     Delete a Car
//@route    DELETE /api/v1/cars/:id
//@access   Private
exports.deleteCar = async (req, res, next) => {
    try {
        console.log(`req.user = ${req.user}`)

        const car = await Car.findById(req.params.id).populate('renting');
        if (!car) { // Check if Car doesn't exists or **carProvider is not own that car**
            return res.status(400).json({success: false, message: `No car with id ${req.params.id} found!`});
        }
        else if (req.user.id != car.carProvider.toString() && req.user.role != 'admin') {
            return res.status(400).json({success: false, message: `Not authorized to delete car with id ${req.params.id}!`});
        }
        const rentings = await Renting.find({ car: car._id });

        // Before delete car Refund money to user first!
        for (const renting of rentings) {
          const user = await User.findById(renting.user);
          const carProvider = await CarProvider.findById(renting.carProvider);
            if (user) {
                await user.updateOne({ $inc: { balance: car.price } } );
                await carProvider.updateOne( { $inc: { balance: -car.price } } );
            }

        }
        
        
        await car.deleteOne();
        res.status(200).json({success: true, data: {}, message: `Successfully deleted car id ${req.params.id}`}); 
    }
    catch (error) {
        res.status(400).json({success: false, message: "Error can't delete car!"});
        console.log(error);
    }
   
};

//@desc     Get all cars
//@route    GET /api/v1/cars
//@access   Public
exports.getCars = async (req, res, next) => {
    let query;
    
      query = Car.find().populate("carProvider");
    
  
    try {
      const cars = await query;
      res
        .status(200)
        .json({ success: true, count: cars.length, data: cars });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Cannot find car" });
    }
  };

  //@desc     Get all cars
//@route    GET /api/v1/cars
//@access   Public
exports.getSingleCar = async (req, res, next) => {
    let query;
    
      query = Car.findById(req.params.id).populate(["carProvider",
      {
        path: "renting",
        select: "rentDate rentTo",
      }
      ]);

      if (!query)
      return res.status(400).json({
        success: false,
        message: `No car with the ID of ${req.params.id}`,
      });

  
    try {
      const car = await query;
      res
        .status(200)
        .json({ success: true, data: car });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Cannot find car" });
    }
  };