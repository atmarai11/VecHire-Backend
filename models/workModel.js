const mongoose = require('mongoose');

const Work = mongoose.model('Work',{
    "WorkImg":{"type":String,"required":true},
    "WorkName":{"type":String,"required":true},
    "Code":{"type":String,"required":true},
    "Description":{"type":String,"required":true},
    "AvgRating":{"type":Number},
    
    
    

});

module.exports = Work;