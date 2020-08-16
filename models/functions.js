//=========[BEGIN: Format tiền]=========//
function format_money(value)
{
 let val = (value/1).toFixed(0).replace('.', ',')
 return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}
//=========[END: Format tiền]=========//
module.exports={format_money}
