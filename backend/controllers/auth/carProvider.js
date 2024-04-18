const CarProvider = require("../../models/CarProvider");
const { logout } = require("./user");

//@desc    Register a CarProvider
//@route   POST /api/v1/auth/register/carProvider
//@access  Public
exports.carProviderRegister = async (req, res, next) => {
  try {
    // Destructuring an req (object) -> var
    const { email, password, name, address, telephone, createdAt} = req.body;

    //Creating a CarProvider
    const newCarProvider = await CarProvider.create({
        email,
        password, 
        name, 
        address, 
        telephone,
        createdAt
    });

    sendTokenResponse(newCarProvider, 200, res);
  } catch (error) {
    res.status(400).json({ success: false });
    console.log(error);
  }
};

// ไม่ใช้แล้ววววววว เปลี่ยนไปใช้ login function เดียวกับ User
//@desc    Login as carProvider
//@route   POST POST /api/v1/auth/login/carProvider
//@access  Public
exports.carProviderLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      if (!email && !password) {
        return res.status(400).json("Please Provide email and password");
      }
  
      const carProvider = await CarProvider.findOne({ email }).select("+password");
  
      if (!carProvider) {
        return res
          .status(400)
          .json({ success: false, msg: "Invalid Credential" });
      }
      //Check if password matches
      const match = await carProvider.isPasswordMatch(password);
  
      if (!match) {
        return res
          .status(401)
          .json({ success: false, msg: "Invalid Credential" });
      }
  
      sendTokenResponse(carProvider, 200, res);
    } catch (error) {
      return res.status(401).json({
        success: false,
        msg: "Cannot convert email or password to string",
      });
    }
  };
  
  const sendTokenResponse = (user, statusCode, res) => {
    //Create a token
    const token = user.getSignedJwtToken();
  
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
  
    if (process.env.NODE_ENV === "production") {
      options.secure = true;
    }
  
    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  
    console.log(token);
  };
  
  
  //@desc     Log user out and clear cookie
  //@route    GET /api/v1/auth/logout
  //@access   Private

const carProviderLogout = async (req, res, next) => {
    await logout(req, res, next);
}
  
//   exports.logout = async (req, res, next) => {
//     res.cookie("token", "none", {
//       expires: new Date(Date.now() + 10 * 1000),
//       httpOnly: true,
//     });
  
//     res.status(200).json({ success: true, data: {} });
//   };

//@desc     Get current Logged in user
//@route    POST /api/v1/auth/me
//@access   Private
exports.getMeCarProvider = async (req, res, next) => {
    try {
        const carProvider = await CarProvider.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: carProvider,
        });
    }
    catch (error) {
        console.log(error)
    }
    
  };




// //@desc     Delete CarProvider
// //@route    DELETE /api/v1/auth/deleteCarProvider
// //@access   Private
// exports.deleteCarProvider = async (req, res, next) => {
//   try {
//     const CarProviderId = req.params.id;
//     const CarProvider = await CarProvider.findById(CarProviderId);

//     if (!CarProvider) {
//       return res
//         .status(404)
//         .json({ success: false, message: `No CarProvider with id of ${CarProviderId}` });
//     }

//     await CarProvider.deleteOne();

//     res.status(200).json({ success: true, data: {} });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Cannot delete CarProvider" });
//   }
// };
