const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('./db');
const taikhoan= require('./taikhoan');
const Model = Sequelize.Model;

class KhachHang extends Model{
//-----------[SELECT]-----------//
    //=========[BEGIN: Count Email]=========//
       static async count_email(emails)
       {
           return KhachHang.findAndCountAll({where:{email:emails}});
       }
    //=========[END: Count Email]=========//
    //=========[BEGIN: Count Số điện thoại]=========//
       static async count_sdt(sdts)
       {
        return KhachHang.findAndCountAll({where:{sodienthoai:sdts}});
       }
    //=========[END: Count Số điện thoại]=========//
    //=========[BEGIN: Find One Email]=========//
        static async find_one_email(emails)
        {
            return KhachHang.findOne({where:{email:emails}});
        }
    //=========[END: Find One Email]=========//
    //=========[BEGIN: Find One Token]=========//
       static async find_one_token(tokens)
       {
           return KhachHang.findOne({where:{tokenkichhoat:tokens}});
       }
    //=========[END: Find One Token]=========//
    //=========[BEGIN: Find One id]=========//
       static async find_one_id(id)
       {
           return KhachHang.findByPk(id);
       }
    //=========[END: Find One id]=========//
    //=========[BEGIN: Find One Token PW]=========//
       static async find_one_token_pw(token)
       {
           return KhachHang.findOne({where:{tokenquenmatkhau:token}});
       }
    //=========[END: Find One Token PW]=========//
    //=========[BEGIN: Find id join tai khoan]=========//
       static async find_id_join_tk(id)
       {
           return KhachHang.findByPk(id,{include:[{model:taikhoan}]});
       }
    //=========[END: Find id join tai khoan]=========//
    //=========[BEGIN: find all join tai khoan]=========//
       static async find_all_join_tk()
       {
           return KhachHang.findAll({include:[{model:taikhoan}]});
       }
    //=========[END: find all join tai khoan]=========//
    //=========[BEGIN: find id where cmnd]=========//
       static async find_all_where_cmnd()
       {
           return KhachHang.findAll({
               include:[{model:taikhoan,where:{kichhoat:false}}],
               where:{cmndsau:{[Sequelize.Op.ne]:null},cmndtruoc:{[Sequelize.Op.ne]:null}}
           });
       }
    //=========[END: find id where cmnd]=========//
//-----------[CREATE]-----------//
    //=========[BEGIN: Create Khách Hàng]=========//
       static async create_KH(emails,hotens,sdts,ngaysinhs,ngaytaos,kichhoat)
       {
           return KhachHang.create({
               email:emails,
               hoten:hotens,
               sodienthoai:sdts,
               ngaysinh:ngaysinhs,
               ngaytao:ngaytaos,
               tokenkichhoat:kichhoat,
           });
       }
    //=========[END: Create Khách Hàng]=========//
//-----------[UPDATE]-----------//
    //=========[BEGIN: Active token kích hoạt = null]=========//
       static async save_kh_email(KH)
       {
           KH.tokenkichhoat=null;
           return KH.save();
       }
    //=========[END: Active token kích hoạt = null]=========//
    //=========[BEGIN: Active token quên mật khẩu == null]=========//
       static async save_kh_quenmatkhau(KH)
       {
           KH.tokenquenmatkhau=null;
           return KH.save();
       }
    //=========[END: Active token quên mật khẩu == null]=========//
    //=========[BEGIN: Save token quên mật khẩu]=========//
       static async save_token_quenmatkhau(KH,token)
       {
           KH.tokenquenmatkhau=token;
           return KH.save();
       }
    //=========[END: Save token quên mật khẩu]=========//
    //=========[BEGIN: Save mật khẩu]=========//
       static async save_mat_khau(KH,matkhau)
       {
           const hashpw = this.hashpw(matkhau);
           KH.matkhau=hashpw;
           return KH.save();
       }
    //=========[END: Save mật khẩu]=========//
    //=========[BEGIN: Lưu hình ảnh]=========//
        static async save_images(u, s, type,diachi) {
            if (type == 1) {
                u.cmndtruoc = s;
            } else {
                u.cmndsau = s;
            }
            u.diachi=diachi;
            return u.save();
        }
    //=========[END: Lưu hình ảnh]=========//
//-----------[FUNCTIONS]-----------//
    //=========[BEGIN: Hash pw]=========//
        static hashpw(password) {
            return bcrypt.hashSync(password, 10);
        }
    //=========[END: Hash pw]=========//
    //=========[BEGIN: Verify pw]=========//
        static verifypw(pw, pwhash) {
            return bcrypt.compareSync(pw, pwhash);
        }
    //=========[END: Ver]=========//
}
KhachHang.init({
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    hoten: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    nickname: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    sodienthoai: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    ngaysinh: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    diachi: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    avatar: {
        type: Sequelize.BLOB('long'),
        allowNull: true,
    },
    cmndtruoc: {
        type: Sequelize.BLOB('long'),
        allowNull: true,
    },
    cmndsau: {
        type: Sequelize.BLOB('long'),
        allowNull: true,
    },
    matkhau: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    tokenkichhoat: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    tokenquenmatkhau: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    ngaytao: {
        type: Sequelize.DATEONLY,
        allowNull: true,
    },
}, {
    sequelize: db,
    modelName: 'khachhang',
});
KhachHang.hasOne(taikhoan);
taikhoan.belongsTo(KhachHang);
module.exports=KhachHang;