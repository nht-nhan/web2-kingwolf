const db=require('./models/db');
const bluebird = require('bluebird');
const taikhoan = require('./models/taikhoan');
const tietkiem = require('./models/tietkiem');
const wait=Number(process.env.TIME_WAIT || 3600000);
db.sync().then(async function(){
    for(;;)
    {
        const thoigianhientai = new Date();
        const ht_day = thoigianhientai.getDate();
        const ht_month = thoigianhientai.getMonth()+1;
        const ht_year = thoigianhientai.getFullYear();
        const ht_hour = thoigianhientai.getHours();
        if(ht_hour==1)
        {
            await taikhoan.update_tiengiaodich();
        }
        const tg_db = await tietkiem.get_all_tgkt();
        await bluebird.each(tg_db,async function(item){
            const tt= await taikhoan.find_id(item.taikhoanId)
            const db_day = item.thoigiankt.getDate();
            const db_month = item.thoigiankt.getMonth()+1;
            const db_year = item.thoigiankt.getFullYear();
            if(ht_day==db_day && ht_month==db_month && ht_year==db_year)
            {
                switch (item.loaitra) {
                    case "1":
                        //--Khu vực update mã,ngaybd,ngaykt--//
                        const getdateonly = new Date();
                        const getdateketthuc = new Date();
                        getdateketthuc.setDate(getdateketthuc.getDate() + (item.kyhan*30));
                        const matk=item.matietkiem.substring(0,8)+taikhoan.getRandomInt(10000,99999);
                        tietkiem.save_system_1(item,matk,getdateonly,getdateketthuc);
                        //--khu vực gửi tiền trả cho tài khoản--//
                        const day_hientai1 = tietkiem.getday(item.thoigiandb,item.thoigiankt);
                        const tienlai = Number(item.sotien*(item.laisuat/100)*(day_hientai1/360));
                        tt.sotien=Math.round(tt.sotien+tienlai);
                        
                        tt.save();
                        break;
                    case "2":
                        //--Khu vực update mã,ngaybd,ngaykt--//
                        const getdateonly1 = new Date();
                        const getdateketthuc1 = new Date();
                        getdateketthuc1.setDate(getdateketthuc1.getDate() + (item.kyhan*30));
                        const matk1=item.matietkiem.substring(0,8)+taikhoan.getRandomInt(10000,99999);
                        const day_hientai11 = tietkiem.getday(item.thoigiandb,item.thoigiankt);
                        const tienlai1 = Number(item.sotien*(item.laisuat/100)*(day_hientai11/360));
                        const sotientt=Math.round(item.sotien+tienlai1);
                        tietkiem.save_system_2(item,matk1,getdateonly1,getdateketthuc1,sotientt);
                        break;
                    default:
                        const day_hientai12 = tietkiem.getday(item.thoigiandb,item.thoigiankt);
                        const tienlai2 = Number(item.sotien*(item.laisuat/100)*(day_hientai12/360));
                        const tientra2 = item.sotien + tienlai2;
                        tt.sotien=Math.round(tt.sotien+tientra2);
                        
                        tt.save();
                        tietkiem.delete_tk(item.id);
                        break;
                }
            }
        })
        await bluebird.delay(wait);
    }
}).catch(console.error);