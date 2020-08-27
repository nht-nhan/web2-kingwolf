const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const taikhoan= require('./taikhoan');
const db = require('./db');
const Model = Sequelize.Model;
class thongbao extends Model {
    /* 
        Loại 1: Chuyển tiền
        Loại 2: Rút tiền
        Loại 3: Nạp tiền
        Loại 4: rút tiết kiệm
        Loại 5: nạp tiết kiệm
    */
   static async count_all(id)
   {
       return thongbao.findAndCountAll({where:{taikhoanId:id}});
   }
    static async save_loai_1(loaisave,nguoiguis,nguoinhans,sotiens,noidungs,id)
    {
        return thongbao.create({
            loai:loaisave,
            nguoigui:nguoiguis,
            nguoinhan:nguoinhans,
            sotien:sotiens,
            noidung:noidungs,
            read:false,
            taikhoanId:id,
        })
    }
    static async save_loai(loaisave,sotiens,noidungs,reads,id)
    {
        return thongbao.create({
            loai:loaisave,
            sotien:sotiens,
            noidung:noidungs,
            read:reads,
            taikhoanId:id,
        })
    }
    static async get_all(id)
    {
        return thongbao.findAll({include:[{model:taikhoan}],order: [
            ['read', 'ASC'],
            ['id','DESC']
        ],
        where:{read:{[Sequelize.Op.ne]:null},taikhoanId:id}});
    }
    static async count_get_all(id)
    {
        return thongbao.findAndCountAll({where:{read:false,taikhoanId:id}});
    }
    static async find_all_L1(id)
    {
        return thongbao.findAll({where:{loai:"L1",taikhoanId:id}});
    }
    static async find_id(id)
    {
        return thongbao.findByPk(id);
    }
    static async read(id)
    {
        const tbs = await this.find_id(id);
        tbs.read=true;
        tbs.save();
        return tbs.loai;
    }
}
thongbao.init({
    loai: {
        type: Sequelize.STRING,
        allowNull: false, 
    },
    nguoinhan: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    nguoigui: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    sotien:
    {
        type:Sequelize.DOUBLE,
        allowNull: true,
    },
    noidung:
    {
        type:Sequelize.STRING,
        allowNull:true,
    },
    read: 
    {
        type:Sequelize.BOOLEAN,
        allowNull:true,
    }, 
}, {
    sequelize: db,
    modelName: 'thongbao',
}); 
taikhoan.hasMany(thongbao); 
thongbao.belongsTo(taikhoan);
module.exports = thongbao;