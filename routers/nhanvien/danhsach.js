const { Router } = require('express');
const khachhang = require('../../models/khachhang');
const taikhoan =require('../../models/taikhoan');
const relogin = require('../../middlewares/nhanvien/relogin');
const {format_money} =require('../../models/functions');
const asyncHandler = require('express-async-handler');
const router = new Router();
//-------------------[Danh sách khách hàng]-------------------//
router.use(relogin);
   //=========[BEGIN: GET]=========//
    router.get('/', asyncHandler(async function(req, res) {
      const thongbao=null;
        const ds=await khachhang.find_all_join_tk();
        return res.render('nhanvien/danhsach',{ds,format_money,thongbao});
    }));
   //=========[END: GET]=========//
   //=========[BEGIN: POST]=========//
      router.post('/',asyncHandler(async function(req,res){
          
          const ds=await khachhang.find_all_join_tk();
          var chuoi=req.body.kw_tinhtrang;
          var tinhtrang=chuoi.substring(0,1);
          var dodai=chuoi.length;
          var id = chuoi.substring(2,dodai);
          const tk = await taikhoan.find_id(id);
          tk.tinhtrang=tinhtrang;
          const check_tk = tk.save();
          if(check_tk && tinhtrang=="t")
          {
            const thongbao="1";
            return res.render('nhanvien/danhsach',{ds,format_money,thongbao});
          }
          else
          {
            const thongbao="2";
            return res.render('nhanvien/danhsach',{ds,format_money,thongbao});
          }
          
      }))
   //=========[END: POST]=========//
//-------------------[Danh sách khách hàng]-------------------//
module.exports=router;