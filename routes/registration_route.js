const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const Registration = require('../models/registrationModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');


router.post('/user/insert',[
    check("first_name","Firstname required").not().isEmpty(),
    check("last_name","Lastname required").not().isEmpty(),
    check("username","Username required").not().isEmpty(),
    check("password","Password required").not().isEmpty(),
    check("email","Email required").not().isEmpty()
   
    

    
],(req,res)=>{

    var fn = req.body.first_name;
    var ln = req.body.last_name;
    var un = req.body.username;
    var pw = req.body.password;
    var em = req.body.email;
    
    var errors = validationResult(req);

    if(errors.isEmpty())
    {
        bcryptjs.hash(pw,10,(err,hash)=>{
            var reg = new Registration({"first_name":fn,"last_name":ln,"username":un,"email":em,"password":hash,"userType":"Customer"});
              reg.save().then((result)=>{
                  res.status(200).json({"success":true,"message":"Successful!!"});
              }).catch((err)=>{
                res.status(500).json({"success":false,"err":err});
              })
            
        });
       // bcryptjs.hash(pw)
     
    }
    else
    {
        res.send(errors.array());
    }
});

router.post('/login/user',(req,res)=>{
    
    const un = req.body['un'];
    const pw = req.body['pw'];

    var query = Registration.findOne({"username":un});
    query.then((userData)=>{
        if(userData == null)
        {
            res.status(202).json({"success":false,"message":"Invalid credentials!!"});
        }
        else
        {
            bcryptjs.compare(pw,userData.password,(err,result)=>{
                if(result == false)
                {
                    res.status(202).json({"success":false,"message":"Invalid credentials!!"});
                }
                else
                {
                   
                   var token = jwt.sign({"userId":userData._id},'secretkey');
                   res.status(200).json({"success":true,"message":"Logged in","token":token,data:userData});
                }
            })
        }
    }).catch((err)=>{
        res.status(500).json({"err":err});
    })
});


router.get('/show/professionals',(req,res)=>{
    let query1 = Registration.find({"userType":"Professionals"});
    query1.then((data)=>{
        if(data.length > 0)
        {
            return res.status(200).json({"success":true,"message":`${data.length} professionals found!!`,"data":data});
        }
        else
        {
            return res.status(202).json({"success":false,"message":`0 professionals found!!`}); 
        }
    })
})


router.get('/professionals/:pid',(req,res)=>{
    let pid = req.params.pid;
    Registration.findOne({"_id":pid}).then((data)=>{
        if(data!=null)
        {
            return res.status(200).json({"success":true,"data":data,"message":"Data retrieved!!"});
        }
        else
        {
            return res.status(202).json({"success":false,"message":"Professional Not found!!"});
        }
    })
})

router.get('/retrieveProfessionals/:professionalType',(req,res)=>{
    let profession = req.params['professionalType'];
    Registration.find({"profession":profession}).then((data)=>{
        if(data.length > 0)
        {
           return res.status(200).json({"success":true,"message":"Data found","data":data})     
        }
        else
        {
            return res.status(202).json({"success":false,"message":"No Data found!!","data":data})
        }
    })
})

router.post('/update/details',auth.verifyUser,(req,res)=>{
    
    let fn = req.body['first_name'].trim();
    let ln = req.body['last_name'].trim();
    
    let email = req.body['email'].trim();
    let username = req.body['username'].trim();
    
    
     let query1 = Registration.findOneAndUpdate({"_id":req.user._id},{
                $set:{
                    "first_name":fn,
                    "last_name":ln,
                
                    "email":email,
                    "username":username
                   
                }
            });
            query1.then((result)=>{
                Registration.findOne({"_id":result._id})
                .then((data2)=>{
                    return res.status(200).json({"success":true,"message":"Account Details Updated Successfully!!","data":data2});   
                })
               
            }).catch((err)=>{
                return res.status(404).json({"success":false,"message":err});
            })
        }
       
    
   
)



router.put('/change/profilePicture',upload.single('profileImg'),auth.verifyUser,(req,res)=>{
    let imgPath = req.file['path'];
    Registration.findOneAndUpdate({"_id":req.user._id},{$set:{"profileImg":imgPath}}).then((result)=>{
        Registration.findOne({"_id":result._id})
        .then((data)=>{
            return res.status(200).json({"success":true,"message":"Profile Picture changed!!","data":data});
        })
        
    }).catch((err)=>{
        return res.status(202).json({"success":false,"message":err});
    })
});


module.exports = router;