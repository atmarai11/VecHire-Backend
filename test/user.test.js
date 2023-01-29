const Registration = require('../models/registrationModel');
const Work = require('../models/workModel');
const mongoose = require('mongoose');
const ProfessionRequest = require('../models/requestModel');



const url = 'mongodb://localhost:27017/proHire';

beforeAll(async()=>{
    await mongoose.connect(url,
        {
            useNewUrlParser:true,
            useCreateIndex:true
        }
    )
})

afterAll(async()=>{
    await mongoose.connection.close();
})

describe("User Work and host Request Testing",()=>{
    
   // testing for user registration
    it("Registration Testing",()=>{
        const user = {
            "first_name":"test",
            "last_name":"test",
            "username":"test",
            "password":"123456",
            "userType":"Admin",
            "profileImg":"abscd.jpg",
            'email':"srjn@gmail.com"
        
        }

        return Registration.create(user)
        .then((reg_ret)=>{
            expect(reg_ret.first_name).toEqual("test")
        })
    })

    //testing for category addition
    it("Category Addition Testing",()=>{
        const work = {
            
            WorkImg:"absdc.jpg",
            WorkName:"Minicar",
            Code:"acasdfdas",
            Description:"sdsdajshd",
            AvgRating:3


        } 

        return Work.create(work)
        .then((work_ret)=>{
            expect(work_ret.WorkName).toEqual("Minicar")
        })
    })


    //testing for category update
    it("Testing category update",async ()=>{
       const status = await Work.updateOne({_id:Object("61598ac776cab8626c8940c3")},{
            $set:{
                "WorkName":"Minivan"
            }
        })
      
        expect(status.ok).toBe(1)
    })

//     //testing for category delete
    it("Testing for category Delete",async ()=>{
        const status = await Work.deleteOne({
            "_id":Object("61598ac776cab8626c8940c3")
        })
     expect(status.ok).toBe(1);
        
    })

//     //testing for request to professional
    it("Testing for Request model",()=>{
            const requests = {
                "user_id":"61598ac776cab8626c8940c2",
                "profession":"Supercar",
                "requestDate":"2020-10-12",
                "cv":"no-img.jpg",
                "citizenShip":"no-img.jpg",
                "userPhoto":"no-img.jpg",
                "experience":2,
                "currentAddress":"Swyambhu",
                "contact":"9803609163"

            }

            return ProfessionRequest.create(requests)
            .then((profession_ret)=>{
                expect(profession_ret.currentAddress).toEqual("Swyambhu")
            })
    })

    //testing for request delete
    it("Testing for Request Delete",async ()=>{
        const status = await Work.deleteOne({
            "_id": Object("61598ac776cab8626c8940c2")
        })
        expect(status.ok).toBe(1);
    })



   // testing for user details update
    it("Testing user details update",async ()=>{
        const status = await Registration.updateOne({
            "_id":Object("61598ac776cab8626c8940c2")
        },
        {
            $set:{
                "first_name":"test1",
                "last_name":"test1"
            }
        })

        expect(status.ok).toBe(1)
        
    })

    
   // testing for user delete
    it("Testing user delete",async ()=>{
        const status = await Registration.deleteOne({
            "_id":Object("61598ac776cab8626c8940c2")
        })

        expect(status.ok).toBe(1)
        
    })



})