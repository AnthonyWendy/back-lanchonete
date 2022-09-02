const { Sequelize, DataTypes } = require("sequelize");
const db = require("../db");
const User = require("./user");

const modelSchema = db.define(
    "Comanda",
    {
        id_comanda: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_user: {    getList: async (req, res) => {
            const total = 0;
    
            const ingredientes = await Ingrediente.findAll({
                order: [["nm_ingrediente", "asc"]],
            });
    
            res.json({
                ingredientes,
            });
        },
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "User",
                key: "_id",
            },
        },
        valor_final: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        mesa: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        data: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        situacao: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        desconto: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        timestamps: false,
        freezeTableName: true,
    }
);
modelSchema.belongsTo(User, {foreignKey: "id_user"});
module.exports = modelSchema;
