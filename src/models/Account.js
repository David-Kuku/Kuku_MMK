const { DataTypes } = require('sequelize')
const sequelize = require('../sequelize')

const Account = sequelize.define('account', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    auth_id: {
        type: DataTypes.STRING(40)
    },
    username: {
        type: DataTypes.STRING(30)
    }
}, {
    freezeTableName: true,
    timestamps: false
})

module.exports = Account