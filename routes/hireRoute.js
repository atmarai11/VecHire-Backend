const express = require('express');
const router = express.Router();
const Hire = require('../models/hireModel');
const Registration = require('../models/registrationModel');
const auth = require('../middleware/auth');
const {getFormattedDate} = require('../third/utils');



router.post('/hireProfessional',auth.verifyUser,(req,res)=>{
    let professional_id = req.body['professional_id'];
    let validFor = parseInt(req.body['reqValidation']);
    let hired_date = req.body['request_date'];
    let address = req.body['address'];
    let contact = req.body['contact'];
    let hired_time = new Date().toLocaleTimeString();
    let validation = new Date(hired_date);
    let hiring = getFormattedDate(validation);
    validation.setDate(validation.getDate()+validFor);
    let validations = getFormattedDate(validation);

    if(professional_id != req.user._id)
    {
        Registration.findOne({"userType":"Professionals","_id":professional_id}).then((data)=>{
            if(data!=null)
            {
                Hire.findOne({"user_id":req.user._id,"professional_id":professional_id,$or:[{"progress":"Running"},{"progress":"On rent"}]}).then((data2)=>{
                    if(data2 == null)
                    {
                        const hireObj = new Hire({"user_id":req.user._id,"professional_id":professional_id,"request_date":hiring,"request_time":hired_time,"validFor":validations,"address":address,"contact":contact});
                hireObj.save().then((result)=>{
                    console.log(result);
                    return res.status(200).json({"success":true,"message":"Request successful"});
                }).catch((err)=>{
                    return res.status(404).json({"success":false,"message":err});
                })
                    }

                    else
                    {
                        return res.status(202).json({"success":false,"message":"You have already requested for same Vehicle. Make sure you have ticked on completed session after returning the vehicle. It would allow you to book same vehicle next time."});
                    }
                })
                
            }
            else
            {
                return res.status(202).json({"success":false,"message":"Select Vehicle!!"});
            }
           
        })
       
    }
    else
    {
        return res.status(202).json({"success":false,"message":"You cannot send request to yourself"});
    }
    
});


router.post('/updateHire',auth.verifyUser,(req,res)=>{
    let id = req.body['_id'];
    console.log(id)
    let getToday = getFormattedDate(new Date());
    let query = Hire.findOne({"_id":id,"cancel":false,"validFor":{$gte:getToday},"user_id":req.user._id});
    query.then((data)=>{
        if(data!=null)
        {
            Hire.deleteOne({"_id":id,"cancel":false}).then((result)=>{
                return res.status(200).json({"success":true,"message":"Deleted"});
            }).catch((err)=>{
                return res.status(404).json({"success":false,"message":err});
            });
        }
        else
        {
            return res.status(202).json({"success":false,"message":"Hire details not found!!"});
        }
    })
})


router.post('/update/workDone',auth.verifyUser,(req,res)=>{
    let id = req.body['_id'];
    let getToday = getFormattedDate(new Date());
    let query = Hire.findOne({"_id":id,"cancel":false,"validFor":{$gte:getToday},"progress":"Working","confirmation":true});
    query.then((data)=>{
        if(data!=null)
        {
            Hire.updateOne({"_id":id,"cancel":false},{$set:{"progress":"Returned!!","status":"Finished"}}).then((result)=>{
                return res.status(200).json({"success":true,"message":"Updated"});
            }).catch((err)=>{
                return res.status(404).json({"success":false,"message":err});
            });
        }
        else
        {
            return res.status(202).json({"success":false,"message":"Hire details not found!!"});
        }
    })
})


router.get('/professional/myWork',auth.verifyUser,auth.verifyPro,(req,res)=>{
    let query = Hire.find({"professional_id":req.user._id}).sort({"request_date":-1}).populate({
        "path":"user_id"
    });
    query.then((result)=>{
        if(result.length>0)
        {
            return res.status(200).json({"success":true,"message":`${result.length} Rentals found`,"data":result});
        }
        else
        {
            return res.status(202).json({"success":false,"message":`0 Rental found`,"data":result});
        }
    })
})

router.get('/customer/myRequest',auth.verifyUser,(req,res)=>{
    let query = Hire.find({"user_id":req.user._id}).sort({"request_date":-1}).populate({
        "path":"professional_id"
    });
    query.then((result)=>{
        if(result.length>0)
        {
            return res.status(200).json({"success":true,"message":`${result.length} requests found`,"data":result});
        }
        else
        {
            return res.status(202).json({"success":false,"message":`0 requests found`,"data":result});
        }
    })
})

router.post('/respondRequest',auth.verifyUser,auth.verifyPro,(req,res)=>{
    let workId = req.body['req_id'];
    let answer = req.body['answer'];
    let query = Hire.findOne({"_id":workId});
    query.then((data)=>{
        if(data!=null)
        {
            let confirmation = false;
            let status;
            let progress;
            if(answer == "Confirm")
            {
                confirmation = true;
                status = "Confirmed";
                progress = "Accepted";
            }
            else
            {
                confirmation = false;
                status = "Rejected";
                progress = "Rejected";
            }

            Hire.updateOne({"_id":workId},{$set:{"confirmation":confirmation,"status":status,"respondedAt":new Date().toLocaleDateString()+" "+new Date().toLocaleTimeString(),"progress":progress}}).then((result)=>{
                return res.status(200).json({"success":true,"message":"Updated"});
            }).catch((err)=>{
                return res.status(404).json({"success":false,"message":err});
            })
        }
        else
        {
            return res.status(202).json({"success":false,"message":"Request not found"});
        }
    })
})



module.exports = router;