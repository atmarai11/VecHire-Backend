const formatTime = (dataTime)=>{
    var data = dataTime;
    if(data < 10)
    {
        data = `0${data}`;
    }
    return data;
}

const getFormattedDate = (date)=>{
    let theDate = `${date.getFullYear()}-${formatTime(date.getMonth()+1)}-${formatTime(date.getDate())}`;
    return theDate;
}



module.exports = {formatTime,getFormattedDate};