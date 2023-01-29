const mongoose = require('mongoose');
const {ObjectId} = require('bson');
const Registration = require('./registrationModel');

const Hire = mongoose.model("Hire",{
    "user_id":{"type":ObjectId,"required":true,"ref":Registration},
    "professional_id":{"type":ObjectId,"required":true,"ref":Registration},
    "request_date":{"type":Date,"required":true},
    "request_time":{"type":String,"required":true},
    "confirmation":{"type":String,"required":true,"default":false},
    "validFor":{"type":String,"required":true},
    "status":{"type":String,"required":true,"default":"Not responded"},
    "respondedAt":{"type":String,"required":true,"default":"Not Data"},
    "progress":{"type":String,"required":true,"default":"Running"},
    "cancel":{"type":Boolean,"required":true,"default":false},
    "address":{"type":String,"required":true},
    "contact":{"type":String,"required":true}
    
    
});

module.exports = Hire;