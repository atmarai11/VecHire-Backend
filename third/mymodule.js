const validator = require('validator');
const validate = (extra,data)=>{
    var emailContainer = data.map((val)=>{return val['email']});
    var usernameContainer = data.map((val)=>{return val['username']});
    if(emailContainer.includes(extra['email']))
    {
        return "Email Address already exists!!";
    }
    else if(usernameContainer.includes(extra['username']))
    {
        return "Username already exists!!";
    }
    else if(!validator.isAlpha(extra['fn'].replace(" ","")))
    {
        return "Firstname should not contain any numeric characters!!"
    }
    else if(!validator.isAlpha(extra['ln'].replace(" ","")))
    {
        return "Lastname should not contain any numeric characters!!"
    }

    
    else if(extra['pw'] != extra['cpw'])
    {
        return "Password mismatch!!";
    }
    else
    {
        return true;
    }
}
 
module.exports = {validate}