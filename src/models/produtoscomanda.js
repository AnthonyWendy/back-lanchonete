const { Sequelize, DataTypes } = require("sequelize");
const db = require("../db");
const Produto = require('./product');

const modelSchema = db.define(
    "produtoscomanda", 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_comanda: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "comanda",
                key: "id_comanda",
            },
        },
        id_produto: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Produto",
                key: "id_produto",
            },
        },
    },
    {
        timestamps: false,
        freezeTableName: true,
    }
);
modelSchema.belongsTo(Produto, {foreignKey: "id_produto"});
module.exports = modelSchema;