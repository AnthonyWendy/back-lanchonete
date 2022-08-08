const { validationResult , matchedData } = require("express-validator");

const Ingrediente = require("../models/ingredient.js");

module.exports = {
    addIngredient: async (req, res) => {
        let { name } = req.body;
    
        if(!name) {
            return res.status(404).json({
                error: "Nome inválido",
            });
        }
    
        const ingrediente = await Ingrediente.create({
            nm_ingrediente: name,
        })
    
        return res.json({
            ingrediente,
        });
    }
};