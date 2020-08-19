//=========[BEGIN: Format tiền]=========//
function format_money(value)
{
 let val = (value/1).toFixed(0).replace('.', ',')
 return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}
//=========[END: Format tiền]=========//
function format_time(ngayinput)
{
    var _initial = ngayinput;
    var fromTime = new Date(_initial);
    var toTime = new Date();

    var differenceTravel = toTime.getTime() - fromTime.getTime();
    var secondss = Math.floor((differenceTravel) / (1000));
    var seconds = Number(secondss);
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    if(d>0)
        return dDisplay
    else if(h>0)
        return hDisplay
    else if(m>0)
        return mDisplay
    else
        return sDisplay
}
module.exports={format_money,format_time}