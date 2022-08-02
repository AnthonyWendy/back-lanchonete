const express = require("express");
const router = express.Router();

const Auth = require("./middlewares/auth.js");

const AuthValidator = require("./validators/auth.js");

const AuthController = require("./controllers/auth.js");
const ProductController = require("./controllers/product.js");

router.get("/ping", (req, res) => {
    res.json({ pong: true });
});

router.post("/user/signin", AuthValidator.signin, AuthController.signin);
router.post("/user/signup", AuthValidator.signup, AuthController.signup);

router.get("/product/list", ProductController.getList);
router.post("/product/add", Auth.private, ProductController.addProduct);
module.exports = router;
