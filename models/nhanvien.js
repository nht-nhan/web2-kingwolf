const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const db = require('./db');

const Model = Sequelize.Model;
class NhanVien extends Model {
    static async findbyid(id) {
        return NhanVien.findByPk(id);
    }
    static async findbyname(name) {
        return NhanVien.findOne({ where: { taikhoan: name } });
    }
    static hashpw(password) {
        return bcrypt.hashSync(password, 10);
    }

    static verifypw(pw, pwhash) {
        return bcrypt.compareSync(pw, pwhash);
    }
}
NhanVien.init({
    taikhoan: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    hoten: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    matkhau: {
        type: Sequelize.STRING,
        allowNull: false,
    },

}, {
    sequelize: db,
    modelName: 'nhanvien',
});


module.exports = NhanVien;