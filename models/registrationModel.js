const mongoose = require('mongoose');

const Registration = mongoose.model('Registration',
{
    "first_name":{"type":String,"required":true},
    "last_name":{"type":String,"required":true},
    "username":{"type":String,"required":true},
    "email":{"type":String,"required":true},
    "password":{"type":String,"required":true},
    "userType":{"type":String, "enum":['Admin', 'Professionals', 'Customer'] },
    "rating":{"type":Number,"default":0,"required":true},
    "profileImg":{"type":String,"default":"no-img.jpg"},
    "profession":{"type":String,"default":"None"},
    "experience":{"type":String,"default":"None"},
    "contact":{"type":String,"default":"None"},
    "wage":{"type":Number,"deafult":0}
})

module.exports = Registration