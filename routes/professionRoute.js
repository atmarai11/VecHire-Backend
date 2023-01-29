const express = require('express');
const router = express.Router();
const ProfessionRequest = require('../models/requestModel');
const Registration = require('../models/registrationModel');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {formatTime} = require('../third/utils');

router.post('/insert/request/profession',upload.fields([{name:'cv',maxCount:1},{name:'citizenShip',maxCount:1},{name:'userPhoto',maxCount:1}]),auth.verifyUser,auth.verifyCust,(req,res)=>{
    let profession = req.body['profession'];
    let cv = req.files.cv[0].path;
    let citizenShip = req.files.citizenShip[0].path;
    let userPhoto = req.files.userPhoto[0].path;
    let experience = req.body['experience'];
    let currentAddress = req.body['address'];
    let contact = req.body['contact'];
    let wage = req.body['wage'];


    let today = new Date();
    let requestDate = `${today.getFullYear()}-${formatTime(today.getMonth()+1)}-${formatTime(today.getDate())}`;
    const professionObj = new ProfessionRequest({"user_id":req.user._id,"profession":profession,"requestDate":requestDate,"cv":cv,"citizenShip":citizenShip,"userPhoto":userPhoto,"experience":experience,"currentAddress":currentAddress,"contact":contact,"wage":wage});
    professionObj.save().then((data)=>{
        return res.status(200).json({"success":true,"message":"Request successful"})
    }).catch((err)=>{
        console.log(err);
        return res.status(401).json({"success":false,"message":err})
    })
})


router.get("/show/request",auth.verifyUser,auth.verifyAdmin,(req,res)=>{
    let query = ProfessionRequest.find({"reviewed":false}).populate({
        path:"user_id"
    });
    query.then((data)=>{
        if(data.length>0)
        {
            return res.status(200).json({"success":true,"data":data,"message":`${data.length} requests found!!`});
        }
        else
        {
            return res.status(202).json({"success":false,"message":"There is no data!!","data":data});
        }
    })
})

router.post("/update/request",auth.verifyUser,auth.verifyAdmin,(req,res)=>{
    let id = req.body['req_id'];
    let requestAnswer = req.body['answer']; //Reject or Approve
    let query = ProfessionRequest.findOne({"_id":id});
    query.then((data)=>{
        if(data!=null)
        {
            let selection = false;
            if(requestAnswer == "Decline")
            {
               selection = false;
            }
            else if(requestAnswer == "Accept")
            {
                selection = true;
            }
            let query2 = ProfessionRequest.findOneAndUpdate({"_id":id},{$set:{"reviewed":true,"reviewedAt":new Date().toLocaleDateString(),"selected":selection}});
            query2.then((result)=>{
                if(selection == true)
                {
                    
                    Registration.findOne({"_id":data.user_id}).then((user)=>{
                        if(user!=null)  
                        {
                            Registration.updateOne({"_id":data.user_id},{$set:{"userType":"Professionals","profession":result.profession,"profileImg":result.userPhoto,"experience":result.experience,"contact":result.contact,"wage":result.wage}}).then((result)=>{

                            }).catch((err)=>{
                                return res.status(404).json({"success":false,"message":err});
                            })
                        }
                        else
                        {
                           console.log("User not found");
                        }
                    })
                }
                else
                {
                    ProfessionRequest.deleteOne({"_id":id}).then((result)=>{}).catch((err)=>{console.log(err)})
                }
                return res.status(200).json({"success":true,"message":"Updated"});
            }).catch((err)=>{
                return res.status(404).json({"success":false,"message":err});
            })

            
        }
    });
})

module.exports = router;