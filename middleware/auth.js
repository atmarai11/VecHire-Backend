const jwt = require('jsonwebtoken');
const Registration = require('../models/registrationModel');
const router = require('../routes/registration_route');

module.exports.verifyUser = (req,res,next)=>{
    var token = req.headers['authorization'].split(' ')[1];
    var userData = jwt.verify(token,'secretkey');
    Registration.findOne({"_id":userData.userId}).then((data)=>{
        if(data != null)
        {
            req.user = data;
            next();
        }
    }).catch((err)=>{
        res.status(401).json({"err":err});
    })
}

//next guard

module.exports.verifyAdmin = function(req, res, next){
    
    if(!req.user){
        
        return res.status(401).json({message : "Unauthorized User!"})
    }
    else if(req.user.userType != 'Admin'){
        return res.status(401).json({message: "Unauthorized User!"})
    }
    next();
}


//next guard for Proffesionals

module.exports.verifyPro = function(req, res, next){
    if(!req.user){
        return res.status(401).json({message : "Unauthorized User!"})
    }
    else if(req.user.userType !== 'Professionals'){
        return res.status(401).json({message: "Unauthorized User!"})
    }
    next();
}



//next guard for Customer

module.exports.verifyCust = function(req, res, next){
    if(!req.user){
        return res.status(401).json({message : "Unauthorized User!"})
    }
    else if(req.user.userType !== 'Customer'){
        return res.status(401).json({message: "Unauthorized User!"})
    }
    next();
}



