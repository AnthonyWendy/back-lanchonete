const express = require("express");
const router = express.Router();

const Auth = require("./middlewares/auth.js");

const AuthValidator = require("./validators/auth.js");
const ProductValidator = require("./validators/product.js");

const AuthController = require("./controllers/auth.js");
const ProductController = require("./controllers/product.js");
const CategoryController = require("./controllers/category.js");
const IngredientController = require("./controllers/ingredientes.js");
const FormasPagamentoController = require("./controllers/formaspagamento.js");
const Comanda = require("./controllers/comanda.js");
const Pagamento = require("./controllers/fechamento");

router.get("/ping", (req, res) => {
    res.json({ pong: true });
});

// AUTH
router.post("/user/signin", AuthValidator.signin, AuthController.signin);

// CREATE
router.post(
    "/user/signup",
    AuthValidator.signup,
    AuthController.signup
);

// READ
router.get("/user/list", Auth.private, AuthController.getList);
// UPDATE
router.put(
    "/user/:id",
    Auth.private,
    AuthValidator.update,
    AuthController.update
);

// DELETE
router.post("/user/delete", Auth.private, AuthController.delete);

// PRODUTO:
// CREATE
router.post(
    "/product/add",
    Auth.private,
    // ProductValidator.addProduct,
    ProductController.addProduct
);

// READ
router.get("/product/list", ProductController.getList);
router.get("/product/:id", ProductController.getProduct);
router.get("/product/:id/ingredients", ProductController.getIngredients);

// UPDATE / DELETE
router.post(
    "/product/:id",
    Auth.private,
    ProductValidator.updateProduct,
    ProductController.updateProduct
);

router.put(
    "/product/:id/ingredients",
    Auth.private,
    ProductController.updateIngredients
);

router.post("/product/toggle", Auth.private, ProductController.toggleProduct);

// CATEGORY:
// CREATE
router.post("/category/add", Auth.private, CategoryController.addCategory);

// READ
router.get("/category/list", CategoryController.getList);
router.get("/category/:id", CategoryController.getItems);

// UPDATE / DELETE
router.post(
    "/category/toggle",
    Auth.private,
    CategoryController.toggleCategory
);

router.put("/category/:id", Auth.private, CategoryController.updateCategory);

//INGREDIENT
//->CREATED
router.post(
    "/ingredient/add",
    Auth.private,
    IngredientController.addIngredient
);
//-> LIST
router.get("/ingredient/list", IngredientController.getList);

// UPDATE
router.put(
    "/ingredient/:id",
    Auth.private,
    IngredientController.updateIngredient
);

// FORMAS DE PAGAMENTO
// CREATE
router.post(
    "/formaspagamentos/add",
    Auth.private,
    FormasPagamentoController.addFormaPagamento
);

// READ
router.get("/formaspagamento/list", FormasPagamentoController.getList);

// UPDATE
router.put(
    "/formaspagamento/:id",
    Auth.private,
    FormasPagamentoController.updateFormaPagamento
);

router.post(
    "/formaspagamento/toggle",
    Auth.private,
    FormasPagamentoController.toggleFormaPagamento
);

//COMANDA
//CREATE
router.post(
    "/comanda/add",
    Auth.private,
    Comanda.addComanda
);

router.get(
    "/comanda/list",
    Auth.private,
    Comanda.listComanda
)

router.get(
    "/comanda/:id",
    Auth.private,
    Comanda.getComanda
)

router.put(
    "/comanda/update/:id",
    Auth.private,
    Comanda.updateComanda
)

router.post(
    "/pagamento/:id",
    Auth.private,
    Pagamento.addPagamento
)

module.exports = router;
