const mongoose = require('mongoose');
const {ObjectID} = require('bson');
const Registration = require('./registrationModel');

const ProfessionRequest = mongoose.model('ProfessionRequest',{
   "user_id":{"type":ObjectID,"required":true,"ref":Registration},
   "profession":{"type":String,"required":true},
   "requestDate":{"type":String,"required":true},
   "reviewed":{"type":Boolean,"required":true,"default":false},
   "reviewedAt":{"type":String,"required":true,"default":new Date().toLocaleDateString()},
   "cv":{"type":String,"required":true},
   "citizenShip":{"type":String,"required":true},
   "userPhoto":{"type":String,"required":[true,'Insert Photo']},
   "experience":{"type":String,"required":true},
   "selected":{"type":Boolean,"required":true,"default":false},
   "currentAddress":{"type":String,"required":true},
   "contact":{"type":String,"required":true},
   "wage":{"type":Number,"default":0}



})

module.exports = ProfessionRequest;