const { validationResult, matchedData } = require("express-validator");

const Product = require("../models/product.js");
const User = require("../models/user.js");
const Comanda = require("../models/comanda.js");
const ComandaProducts = require("../models/produtoscomanda");
const db = require("../db");

module.exports = {
    //CREATE

    addComanda: async (req, res) => {
        let {mesa, ID, listProducts, price} = req.body;

        const comanda = await Comanda.create({
            id_user: parseInt(ID),
            valor_final: price,
            mesa: parseInt(mesa),
            data: new Date(),
            situacao: 1,
            desconto: 0,
        }, {raw:true}); 

        for(const cont of listProducts){
            const addProducts = ComandaProducts.create({
                id_comanda: comanda.id_comanda,
                id_produto: cont.id_produto
            })
        }
        
        return res.json(comanda);
    },

    //
    listComanda: async (req, res) => {
        let { sort = "asc", offset = 0, id_garcom} = req.query;
        

        const where = {situacao: 1}

        if(id_garcom)where.id_garcom = id_garcom

        const listComandas = await Comanda.findAll({
            offset: parseInt(offset),
            order: [["situacao", "asc"]],
            include: [
                {model: User, attributes: ["name"]}
            ],
            where

        })

        for(const comanda of listComandas){

            const pedidos = await ComandaProducts.findAll({
                include: [
                    {model: Product, attributes: ["nm_produto", "valor"]},
                ],
                where: {id_comanda: comanda.id_comanda}
            })
            comanda.dataValues.pedidos = pedidos
        }

        res.json(listComandas);
    },

    getComanda: async (req, res) => {
        let {id} = req.params;

        const comanda = await Comanda.findOne({
            where: {id_comanda: id},
            include: [
                {model: User, attributes: ["name"]}
            ]
        })

        if(!comanda){
            return res.status(400).json({
                error:"Comanda não existe!",
            });
        }

        const pedidos = await ComandaProducts.findAll({
            include: [
                {model: Product, attributes: ["nm_produto", "valor"]},
            ],
            where: {id_comanda: comanda.id_comanda}
        })
        comanda.dataValues.pedidos = pedidos;
        
        res.json(comanda);
    },

    updateComanda: async (req, res) => {
        let { id } = req.params;
        let { remove, listProducts1, sit, price} = req.body;

        for(const cont of listProducts1){
            const addProducts = ComandaProducts.create({
                id_comanda: id,
                id_produto: cont.id_produto
            })
        }

        for(const cont of remove){
            const remover = ComandaProducts.destroy({
                where: {id_comanda: id,
                        id_produto: cont.id_produto}
            })
        }

        const comandaUp = await Comanda.findOne({
            where: {id_comanda: id}
        })

        comandaUp.price = price;
        comandaUp.situacao = sit;
        comandaUp.save();

        return res.json(comandaUp);
    }


}