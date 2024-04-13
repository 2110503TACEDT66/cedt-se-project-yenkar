    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
const CarProvider = require('../models/CarProvider');

    //Protect routes
    exports.protect = async (req,res,next) => {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        //Make sure token exists
        if (!token || token == 'null') {
            return res.status(401).json({success: false, message: 'Not authorize to access this route'});
        }

        try {
            //Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            console.log("decoded = " + decoded);
            console.log("Type = "  + decoded.type)

            if (decoded.type === 'user') { // Check if customer or carProvider
                req.user = await User.findById(decoded.id);
            }
            else {
                req.user = await CarProvider.findById(decoded.id);
            }
            
            
            next();
        }
        catch (err) {
            console.log(err);
            return res.status(401).json({success: false, message: 'Not authorize to access this route'});
        }
    };

    //Grant Access to specific roles
    exports.authorize = (...allowedRoles) => {
        return (req,res,next) => {
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: `User role ${req.user.role} is not authorized to access this route`
                });
            }
            next();
        }
    }