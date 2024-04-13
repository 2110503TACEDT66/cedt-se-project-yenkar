const Car = require('../models/Car');
//@desc     Delete a Car
//@route    DELETE /api/v1/cars/:id
//@access   Private

exports.deleteCar = async (req, res, next) => {
    try {
        console.log(`req.user = ${req.user}`)

        const car = await Car.findById(req.params.id);
        if (!car) { // Check if Car doesn't exists or **carProvider is not own that car**
            return res.status(400).json({success: false, message: `No car with id ${req.params.id} found!`});
        }
        else if (req.user.id != car.carProvider.toString()) {
            return res.status(400).json({success: false, message: `Not authorized to delete car with id ${req.params.id}!`});
        }

        await car.deleteOne();
        res.status(200).json({success: true, data: {}, message: `Successfully deleted car id ${req.params.id}`}); 
    }
    catch (error) {
        res.status(400).json({success: false, message: "Error can't delete car!"});
        console.log(error);
    }
   
}