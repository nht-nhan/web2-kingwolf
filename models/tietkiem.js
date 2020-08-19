const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('./db');
const taikhoan = require('./taikhoan');
const Model = Sequelize.Model;
class tietkiem extends Model {
    //=========[BEGIN: lấy all thoigian ket thuc]=========//
    static async get_all_tgkt()
    {
        return tietkiem.findAll({where:{loai:"2"}});
    }
    //=========[BEGIN: lấy all thoigian ket thuc]=========//
    //=========[BEGIN: lấy = id]=========//
       static async get_id(id)
       {
           return tietkiem.findByPk(id);
       }
    //=========[END: lấy = id]=========//
    //=========[BEGIN: Lấy tất cả]=========//
       static async get_all(ids)
       {
           return tietkiem.findAll({where:{taikhoanId:ids}});
       }
    //=========[END: Lấy tất cả]=========//
    //=========[BEGIN: Lưu tiết kiệm không kỳ hạn]=========//
       static async save_khongkyhan(matt,thoigian,idtk,tien)
       {
            return tietkiem.create({
                matietkiem:matt,
                thoigiandb:thoigian,
                loai:1,
                laisuat:0.1,
                taikhoanId:idtk,
                sotien:tien
            })
       }
    //=========[END: Lưu tiết kiệm không kỳ hạn]=========//
    //=========[BEGIN: lưu tiết kiệm có kỳ hạn]=========//
       static async save_cokyhan(matt,thoigian,kyhan,loaisuat,loaitra,tien,idtk,tgkt)
       {
           return tietkiem.create({
               matietkiem:matt,
               thoigiandb:thoigian,
               thoigiankt:tgkt,
               loai:2,
               laisuat:loaisuat,
               kyhan:kyhan,
               loaitra:loaitra,
               sotien:tien,
               taikhoanId:idtk,
           })
       }
    //=========[END: lưu tiết kiệm có kỳ hạn]=========//
    static async save_system_1(tk,mamoi,tgbd,tgkt)
    {
        tk.matietkiem=mamoi;
        tk.thoigiandb=tgbd;
        tk.thoigiankt=tgkt;
        return tk.save();
    }
    static async save_system_2(tk,mamoi,tgbd,tgkt,tien)
    {
        tk.matietkiem=mamoi;
        tk.thoigiandb=tgbd;
        tk.thoigiankt=tgkt;
        tk.sotien=tien;
        return tk.save();
    }
    //=========[BEGIN: Find mã tiết kiệm]=========//
       static async find_matt(matt)
       {
           return tietkiem.findAndCountAll({where:{matietkiem:matt}});
       }
    //=========[END: Find mã tiết kiệm]=========//
    //=========[BEGIN: lấy ra số lãi suất]=========//
       static get_lai_suat(sothang)
       {
           var lai=null;
           switch(sothang)
           {
                case 1:
                case 2:
                    lai=3.7;
                    break;
                case 3:
                case 4:
                case 5:
                    lai=4.0;
                    break;
                case 6:
                case 7:
                case 8:
                    lai=4.4;
                    break;
                case 9:
                case 10:
                    lai=4.6;
                    break;
                case 12:
                case 13:
                case 15:
                case 18:
                case 24:
                    lai=6.0;
                    break;
                default:
                    lai=0.1;
                    break;
           }
           return lai;
       }
    //=========[END: lấy ra số lãi suất]=========//
    //=========[BEGIN: xóa tiết kiệm = id]=========//
       static async delete_tk(ids)
       {
           return tietkiem.destroy({where:{id:ids}});
       }
    //=========[END: xóa tiết kiệm = id]=========//
    //=========[BEGIN: get day]=========//
       static getday(start,end)
       {
        return Math.floor(( Date.parse(end) - Date.parse(start) ) / 86400000);
       }
    //=========[END: get day]=========//
    
}
tietkiem.init({
    matietkiem: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    thoigiandb: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    thoigiankt: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    
    loai: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    kyhan: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    laisuat: {
        type: Sequelize.DOUBLE,
        allowNull: true,
    },
    loaitra: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    sotien: {
        type: Sequelize.DOUBLE,
        allowNull: true,
    },
    },{
        sequelize: db,
        modelName: 'tietkiem',
    });
    taikhoan.hasMany(tietkiem);
    tietkiem.belongsTo(taikhoan);
module.exports = tietkiem;