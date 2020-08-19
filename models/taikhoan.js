const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('./db');
const Model = Sequelize.Model;
class taikhoan extends Model {
    static async update_tiengiaodich()
    {
        return taikhoan.update({tiengiaodich:'0'},{where:{}});
    }
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    static async count_stk(stk) {
        return taikhoan.findAndCountAll({ where: { sotaikhoan: stk } });
    }
    static async create_taikhoan(STK, SOTIEN, TIENTE, TIENGIAODICH, TINHTRANG, KICHHOAT, KHId) {
        return taikhoan.create({
            sotaikhoan: STK,
            sotien: SOTIEN,
            tiente: TIENTE,
            tiengiaodich: TIENGIAODICH,
            tinhtrang: TINHTRANG,
            kichhoat: KICHHOAT,
            khachhangId: KHId,
        })
    }
    static async find_id(id)
    {
        return taikhoan.findByPk(id);
    }
    static async find_stk(stk)
    {
        return taikhoan.findOne({where:{sotaikhoan:stk}});
    }
    static async save_money_tt(TK,tien)
    {
        TK.sotien=TK.sotien-tien;
        return TK.save();
    }
    static async save_money_tk(TK,tien)
    {
        TK.sotien=TK.sotien+tien;
        return TK.save();
    }
    static async save_chuyenkhoan_tru(STK,tien)
    {
        const tk= await this.find_stk(STK);
        tk.sotien=tk.sotien-tien;
        const tien_gt=Number(tk.tiengiaodich);
        tk.tiengiaodich=Number(tien_gt+tien);
        console.log(tk.tiengiaodich);
        return tk.save();
    }
    static async save_chuyenkhoan_cong(STK,tien)
    {
        const tk= await this.find_stk(STK);
        tk.sotien=tk.sotien+tien;
        return tk.save();
    }
}
taikhoan.init({
    sotaikhoan: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    sotien: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    tiente: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    tiengiaodich: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    tinhtrang: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    kichhoat: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
}, {
    sequelize: db,
    modelName: 'taikhoan',
});
module.exports = taikhoan;