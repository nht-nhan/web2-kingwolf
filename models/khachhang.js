const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const taikhoan= require('./taikhoan');
const db = require('./db');
const Model = Sequelize.Model;
class KhachHang extends Model {
    static async count_email(EMAILS) {
        return KhachHang.findAndCountAll({ where: { email: EMAILS } });
    }
    static async count_sdt(sdts) {
        return KhachHang.findAndCountAll({ where: { sodienthoai: sdts } });
    }
    static async count_all()
    {
        return KhachHang.findAndCountAll();
    }
    static async create_kh(EMAILS, HOTEN, SDT, NGAYSINH, TOKEN) {
        return KhachHang.create({
            email: EMAILS,
            hoten: HOTEN,
            sodienthoai: SDT,
            ngaysinh: NGAYSINH,
            tokenkichhoat: TOKEN,
        })
    }
    static async find_one_token(TOKENS) {
        return KhachHang.findOne({ where: { tokenkichhoat: TOKENS } });
    }
    static async save_kichhoat_email(KH) {
        KH.tokenkichhoat = null;
        return KH.save();
    }
    static async save_matkhau(KH, MATKHAU) {
        KH.matkhau = this.hashpw(MATKHAU);
        return KH.save();
    }
    static hashpw(password) {
        return bcrypt.hashSync(password, 10);
    }
    static verifypw(pw, pwhash) {
        return bcrypt.compareSync(pw, pwhash);
    }
    static async find_one_email(EMAILS)
    {
        return KhachHang.findOne({where:{email:EMAILS}});
    }
    static async find_one_id(IDS)
    {
        return KhachHang.findOne({where:{id:IDS}});
    }
    static async save_token_quenmatkhau(checkemail,token)
    {
        const KH = KhachHang.findOne({where:{email:checkemail}});
        if(KH)
        {
            KH.tokenquenmatkhau=token;
            return KH.save();
        }
    }
    static async find_one_token_pw(TOKENS)
    {
        return KhachHang.findOne({where:{tokenquenmatkhau:TOKENS}});
    }
    static async save_token_quenmatkhau(KH,hashsdt)
    {
        KH.tokenquenmatkhau=hashsdt;
        return KH.save();

    }
    static async save_kichhoat_quenmatkhau(KH)
    {
        KH.tokenquenmatkhau=null;
        return KH.save();
    }
    static async find_id_join_tk(id)
    {
        return KhachHang.findByPk(id,{include:[{model:taikhoan}]});
    }
    static async find_id_join_tk_stk(stk)
    {
        return KhachHang.findOne({include:[{model:taikhoan,where:{sotaikhoan:stk}}]});
    }
    static async find_all_join_tk()
    {
        return KhachHang.findAll({include:[{model:taikhoan}]})
    }
    static async find_all_where_cmnd()
    {
        return KhachHang.findAll({
            include:[{model:taikhoan,where:{kichhoat:false}}],
            where:{cmndsau:{[Sequelize.Op.ne]:null},cmndtruoc:{[Sequelize.Op.ne]:null}}
        });
    }
    static async save_images(KH,img,loai,DIACHI)
    {
        if(loai==1)
        {
            KH.cmndtruoc=img;
            KH.diachi=DIACHI;
            return KH.save();
        }
        else
        {
            KH.cmndsau=img;
            KH.diachi=DIACHI;
            return KH.save();
        }
    }
    static async save_anhdaidien(id,img)
    {
        const kh = await this.find_one_id(id)
        kh.avatar=img
        return kh.save();
    }
    static async save_nickname(id,name)
    {
        const kh = await this.find_one_id(id)
        kh.nickname=name
        return kh.save();
    }
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

}, {
    sequelize: db,
    modelName: 'khachhang',
});
KhachHang.hasOne(taikhoan);
taikhoan.belongsTo(KhachHang);
module.exports = KhachHang;