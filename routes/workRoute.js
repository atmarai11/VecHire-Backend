const express = require('express');
const router = express.Router();
const Work = require('../models/workModel');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/insert/work',upload.single('workImg'),auth.verifyUser,auth.verifyAdmin,(req,res)=>{
   // console.log(req.file);
   if(req.file == undefined){
       return res.status(400).json({message: "Invalid file format"}); 
       
    }

    let workImg = req.file['path'];
    let workName = req.body['wName'];
    let desc = req.body['desc'];

    Work.find({}).then((data)=>{
        var workNames = data.map((val)=>{return val.WorkName.toLowerCase().replace(" ","")});
        if(!workNames.includes(workName.toLowerCase()))
        {
            var work = new Work({"WorkImg":workImg,"WorkName":workName,"Code":123456,"Description":desc,"AvgRating":0});
            work.save().then((result)=>{
                res.status(200).json({"message":"Vehicle category added!!","success":true});
            }).catch((err)=>{
                res.status(401).json({"message":err});
            })
        }
        else
        {
            return res.status(202).json({"success":false,"message":"Given category already exists!!"})
        }

    }).catch((err)=>{
        return res.status(404).json({"success":false,"message":err});
    })
  
})

router.put('/professional/update',auth.verifyUser,auth.verifyAdmin,function(req,res){
    const workImg = req.body.wImg;
    const workName = req.body.wName;
    const desc = req.body.desc;
    const id = req.body.id;
 
    Work.updateOne({_id:id},
        {
            WorkImg : workImg,
            WorkName: workName,
            Description: desc
 
        })
        .then(function(result){
            res.status(200).json({message:"updated!"})
        })
        .catch(function(e){
            res.status(500).json({error:e})
        })
})

router.delete('/professional/delete/:id',auth.verifyUser,auth.verifyAdmin,function(req,res){
    const id = req.params.id;
    Work.deleteOne({_id:id})
    .then(function(result){
        res.status(200).json({ message:"Deleted!"})
    })
    .catch(function(e){
        res.status(500).json({error:e})
    })
})

router.get('/professional/showall', function(req,res){
    Work.find({})
    .then(function(data){
        res.status(200).json({success:true,data:data,message:"Retrieved"})
    })
    .catch(function(e){
        res.status(500).json({error : e})
    })
})

router.get('/professional/single/:id', function(req,res){
    const id = req.params.id;
    Work.findOne({_id : id})
    .then(function(data){
        if(data!=null)
        {
            return res.status(200).json(data)
        }
        else
        {
            return res.status(401).json({"success":false,"message":"Empty collection"});
        }
    })
    .catch(function(e){
        res.status(500).json({error : e})
    })
})



module.exports = router;
