const { v4: uuidv4 } = require("uuid");
const jimp = require("jimp");

const { validationResult, matchedData } = require("express-validator");
const { Op } = require("sequelize");
const Category = require("../models/category.js");
const Product = require("../models/product.js");
const Ingredients = require("../models/ingredient.js");
const ProductIngredients = require("../models/productIngredients.js");
const Images = require("../models/images.js");

const idRegex = /[0-9]+/;

const addImage = async (buffer) => {
    const newName = `${uuidv4()}.jpg`;
    const tmpImg = await jimp.read(buffer);
    tmpImg.cover(500, 500).quality(80).write(`./public/media/${newName}`);
    return newName;
};

const isValidMimetype = (mimetype) => {
    const mimetypes = ["image/jpeg", "image/jpg", "image/png"];

    if (mimetypes.includes(mimetype)) return true;

    return false;
};

const pushImg = async (img, product, isDefault = false) => {
    let url = await addImage(img.data);

    console.log("URL   ", url);
    let imgObj = await Images.create({
        url,
        default: isDefault,
        product: product.id_produto,
    });

    return;
};

module.exports = {
    // CREATE
    addProduct: async (req, res) => {
        let { name, description, price, category } = req.body;
        let { ingredients } = req.body;
        console.log(req.body);
        if (!name || !description || !price || !category)
            return res.json({ error: "Missing fields" });

        const categoryExists = await Category.findByPk(category);

        if (!categoryExists) {
            return res.status(400).json({
                error: "Categoria não existe",
            });
        }

        price = price.replace(".", "").replace(",", ".").replace("R$ ", "");
        price = parseFloat(price);

        const product = await Product.create({
            nm_produto: name,
            valor: price,
            descricaoproduto: description,
            id_categoria: category,
            flsituacao: 1,
        });

        if (ingredients) {
            ingredients = JSON.parse(ingredients);
            for (const ingredient of ingredients) {
                const ingredientExists = await Ingredients.findByPk(ingredient);

                if (!ingredientExists) {
                    return res.status(400).json({
                        error: "Ingrediente não existe",
                    });
                }

                await ProductIngredients.create({
                    id_produto: product.id_produto,
                    id_ingrediente: ingredientExists.id_ingrediente,
                });
            }
        }

        if (!req.files || !req.files.img) {
            return res.json({ product });
        }
        if (req.files.img.length == undefined) {
            if (isValidMimetype(req.files.img.mimetype))
                await pushImg(req.files.img, product, true);
        } else {
            for (let i in req.files.img)
                if (isValidMimetype(req.files.img[i].mimetype))
                    await pushImg(req.files.img[i], product, i === 0);
        }

        return res.json({
            product,
        });
    },

    // READ
    getProduct: async (req, res) => {
        let { id } = req.params;

        if (!id)
            return res.status(400).json({
                error: "Produto Inválido",
            });

        if (!id.match(idRegex)) {
            return res.status(400).json({
                error: "Produto inválido",
            });
        }

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(400).json({
                error: "Produto não existe",
            });
        }

        const images = await Images.findAll({
            where: { product: product.id_produto },
        });

        product.dataValues.images = images;
        return res.json(product);
    },

    getList: async (req, res) => {
        let total = 0;
        let { sort = "asc", offset = 0,  q, cat } = req.query;

        let filters = { flsituacao: 1 };

        if (q) filters.nm_produto = { [Op.iLike]: `%${q}%` };
        if (cat) {
            const category = await Category.findOne({
                where: { nm_categoria: cat },
            });
            if (category) filters.category = category._id.toString();
        }

        total = await Product.findAll();
        total = total.length;
        let products;

        products = await Product.findAll({
            where: filters,
            offset: parseInt(offset),
            // limit: parseInt(limit)  ? parseInt(limit): "",
            order: [["nm_produto", sort]],
        });

        for (const product of products) {
            const images = await Images.findAll({
                where: { product: product.id_produto },
            });
            product.dataValues.images = images;
        }
        //console.log(products, q);
        res.json({
            total,
            products,
        });
    },

    getIngredients: async (req, res) => {
        let { id } = req.params;
        if (!id) {
            return res.status(400).json({
                error: "Categoria Inválida",
            });
        }

        if (!id.match(idRegex)) {
            return res.status(400).json({
                error: "Produto inválido",
            });
        }
        const keys = await ProductIngredients.findAll({
            where: { id_produto: id },
        });

        const ingredients = await Ingredients.findAll({
            where: { id_ingrediente: keys.map((key) => key.id_ingrediente) },
        });

        return res.json({
            ingredients,
        });
    },

    // UPDATE/DELETE
    updateProduct: async (req, res) => {
        let { id } = req.params;
        let { name, description, price, category } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.json({ error: errors.mapped() });
        }

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(400).json({
                error: "Produto não existe",
            });
        }

        let updates = {};

        if (name) updates.nm_produto = name;
        if (description) updates.descricaoproduto = description;
        if (price) {
            price = price.replace(".", "").replace(",", ".").replace("R$ ", "");
            price = parseFloat(price);
            updates.valor = price;
        }
        if (category) updates.id_categoria = category;

        if (req.files && req.files.img) {
            // const adI = await Ad.findByPk(id);

            if (req.files.img.length == undefined) {
                if (
                    ["image/jpeg", "image/jpg", "image/png"].includes(
                        req.files.img.mimetype
                    )
                ) {
                    let url = await addImage(req.files.img.data);

                    Images.create({
                        url,
                        product: product.id_produto,
                        default: false,
                    });
                }
            } else {
                for (let i = 0; i < req.files.img.length; i++) {
                    if (
                        ["image/jpeg", "image/jpg", "image/png"].includes(
                            req.files.img[i].mimetype
                        )
                    ) {
                        let url = await addImage(req.files.img[i].data);

                        Images.create({
                            url,
                            product: product.id_produto,
                            default: false,
                        });
                    }
                }
            }
        }

        console.log(updates);
        await product.update(updates);
        return res.json({ product });
    },

    updateIngredients: async (req, res) => {
        let { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Produto Inválido",
            });
        }

        if (!id.match(idRegex)) {
            return res.status(400).json({
                error: "Produto inválido",
            });
        }

        let { ingredients } = req.body;

        if (!ingredients) {
            return res.status(400).json({
                error: "Ingredientes Inválidos",
            });
        }

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(400).json({
                error: "Produto não existe",
            });
        }

        const keys = await ProductIngredients.destroy({
            where: { id_produto: id },
        });

        for (const ingredient of ingredients) {
            ProductIngredients.create({
                id_produto: id,
                id_ingrediente: ingredient,
            });
        }

        return res.json({
            message: "Ingredientes atualizados",
        });
    },

    toggleProduct: async (req, res) => {
        let { id } = req.body;

        if (!id)
            return res.status(400).json({
                error: "Produto Inválido",
            });

        if (!id.match(idRegex)) {
            return res.status(400).json({
                error: "Produto inválido",
            });
        }

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(400).json({
                error: "Categoria não existe",
            });
        }

        await product.update({
            flsituacao: product.flsituacao === 0 ? 1 : 0,
        });

        res.json({
            product,
        });
    },
};
