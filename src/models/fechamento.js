const { Sequelize, DataTypes } = require("sequelize");
const db = require("../db");

const modelSchema = db.define(
    "Fechamento",
    {
        id_fechamento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,            
        },
        id_comanda: {
            type: DataTypes.INTEGER,

            references: {
                model: "Comanda",
                key: "id_comanda",
            },
        },
        idformapagamento: {
            type: DataTypes.INTEGER,
            references: {
                model: "formaspagamento",
                key: "idformapagamento",
            },
        },
        valor: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = modelSchema;
