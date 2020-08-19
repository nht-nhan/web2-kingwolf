const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const taikhoan = require('./taikhoan');
const db = require('./db');

const Model = Sequelize.Model;
class thanhtoan extends Model {
//-----------[SELECT]-----------//
    //=========[BEGIN: Tìm id rút tiền]=========//
       static async find_id_rut_tien(ids)
       {
            return thanhtoan.findAll({order:[['id','DESC']],include:[{model:taikhoan,where:{id:ids}}],where:{loai:"1"}});
       }
    //=========[END: Tìm id rút tiền]=========//
    //=========[BEGIN: Tìm id nạp tiền]=========//
        static async find_id_nap_tien(ids)
        {
            return thanhtoan.findAll({order:[['id','DESC']],include:[{model:taikhoan,where:{id:ids}}],where:{loai:"2"}});
        }
    //=========[END: Tìm id nạp tiền]=========//
    //=========[BEGIN: tìm id all (rút + nạp)]=========//
        static async find_id_all(ids)
        {
            return thanhtoan.findAll({order:[['id','DESC']],include:[{model:taikhoan,where:{id:ids}}]});
        }
    //=========[END: tìm id all (rút + nạp)]=========//
    //=========[BEGIN: Tìm all nạp tiền]=========//
        static async find_all_naptien()
        {
            return thanhtoan.findAll({order:[['id','DESC']],where:{loai:"2",tinhtrang:false}});
        }
    //=========[END: Tìm all nạp tiền]=========//
    //=========[BEGIN: Tìm mã thanh toán]=========//
        static async find_mathanhtoan(ma)
        {
            return thanhtoan.findOne({where:{mathanhtoan:ma}});
        }
    //=========[END: Tìm mã thanh toán]=========//
//-----------[CREATE]-----------//
    //=========[BEGIN: Tạo thanh toán]=========//
    static async Create_TT(mas,tien1,tien2,tien3,idtk,loais,tinhtrangs)
    {
         const tim_ma= await thanhtoan.findAndCountAll({where:{mathanhtoan:mas}});
         if(tim_ma.count>0)
         {
             return -1;
         }
         else
         {
             thanhtoan.create({
                 mathanhtoan:mas,
                 tien_1:tien1,
                 tien_2:tien2,
                 tien_3:tien3,
                 taikhoanId:idtk,
                 loai:loais,
                 tinhtrang:tinhtrangs,
             })
             return 0;
         }
    }
 //=========[END: Tạo thanh toán]=========//
//-----------[UPDATE]-----------//
//-----------[FUNCTIONS]-----------//
}
thanhtoan.init({
    mathanhtoan: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    loai: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    noidung: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    tien_1: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    tien_2: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    tien_3: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    tinhtrang: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    
}, {
    sequelize: db,
    modelName: 'thanhtoan',
});
taikhoan.hasMany(thanhtoan);
thanhtoan.belongsTo(taikhoan);

module.exports = thanhtoan;