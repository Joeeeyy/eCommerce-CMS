const express = require('express');
const router = express.Router();

const Products = require('../models/products');
const Cart = require('../models/cart');

router.post('/add-cart/:productId', async (req, res) => {
    const newProductId = req.params.productId;
    const preCartProduct = await Cart.findOne({prodId: newProductId});
    const preProduct = await Products.findById(newProductId);

    if (preCartProduct) {
        preCartProduct.quantity = await preCartProduct.quantity + 1;
        preCartProduct.price = await preCartProduct.quantity * preProduct.price;
        const updatedCartProduct = await preCartProduct.save();
        res.status(201).json({
            success: true,
            message: 'Cart Updated',
            upDatedCart: updatedCartProduct
        });
    } else {
        let newCartProduct = new Cart({
            title: preProduct.title,
            price: preProduct.price,
            quantity: 1,
            prodId: preProduct._id
        });
        const savedCartNewProduct = await newCartProduct.save();
        res.status(202).json({
            success: true,
            message: 'Cart Inserted',
            upDatedCart: savedCartNewProduct
        });
    }
});

router.get('/', async (req, res) => {

    const allCart = await Cart.find({}).select('_id title price quantity prodId');

    if (allCart !== "") {
        res.status(200)
            .json({
                success: true,
                message: 'All Cart Products',
                cart: allCart
            });
    } else {
        res.status(200)
            .json({
                success: true,
                message: 'No Cart Products',
                cart: null
            });
    }

});

router.get('/remove-from-cart/:productId', async (req, res) => {

    const prod_id = req.params.productId;
    console.log('REMOVE CART ---- Product id: ----\t' + prod_id);

    try {
        let prodToRemove = await Cart.findOne({prodId: prod_id});

        prodToRemove.remove();
        res.status(204)
            .json({
                success: true,
                message: 'Product Removed'
            });

        // let qtyCount = prodToRemove.quantity,
        //     currPrice = prodToRemove.price,
        //     originalPrice = null;
        // console.log('Product Qty Count:\t' + qtyCount);
        // console.log('Product Current Price:\t' + currPrice);

        // Products.findById(prod_id)
        //     .exec()
        //     .then(product => {
        //         if (product) {
        //             originalPrice = product.price;
        //             console.log('Product Original Price:\t' + originalPrice);
        //         }
        //     })
        //     .catch(error => {
        //         console.error(error);
        //     });
        //
        // if (qtyCount > 0) {
        //     prodToRemove.quantity = prodToRemove.quantity - 1;
        //     prodToRemove.price = prodToRemove.price - originalPrice;
        //
        //     let newQtyCount = prodToRemove.quantity;
        //     console.log('Product New Qty Count:\t' + newQtyCount);
        //
        //     res.status(203)
        //         .json({
        //             success: true,
        //             message: 'Count Reduced'
        //         });
        //
        // } else if (qtyCount == 0) {
        //     prodToRemove.remove();
        //     res.status(204)
        //         .json({
        //             success: true,
        //             message: 'Product Removed'
        //         });
        // }

    } catch (error) {
        console.log(error);
    }

});

router.post('/increase-cart/:cartProductId', async (req, res) => {
    try {
        let cart_prod_id = req.params.cartProductId;

        let prodToIncrease = await Cart.findById(cart_prod_id);
        let originalProduct = await Products.findById(prodToIncrease.prodId);

        prodToIncrease.quantity += 1;
        prodToIncrease.price += originalProduct.price;
        //originalProduct.quantity -= 1;

        if (originalProduct.quantity <= 0) {
            res.status(205)
                .json({
                    success: true,
                    message: 'Product Store Quantity Depleted'
                })
        } else {
            if (prodToIncrease.quantity > originalProduct.quantity) {
                res.json({
                    success: false,
                    message: 'Product Max Quantity Reached'
                })
            } else {
                await prodToIncrease.save();
                await originalProduct.save();

                console.log('Prod:\t' + prodToIncrease);

                res.json({
                    success: true,
                    message: 'Product Quantity Increased',
                    productQty: prodToIncrease
                });
                res.status(204);
            }
        }

    } catch (e) {
        console.log(e);
    }
});

router.post('/decrease-cart/:cartProductId', async (req, res) => {
    try {
        let cart_prod_id = req.params.cartProductId;
        let prodToDecrease = await Cart.findById(cart_prod_id);
        let originalProduct = await Products.findById(prodToDecrease.prodId);
        prodToDecrease.quantity -= 1;
        if (prodToDecrease !== "") {

            if (originalProduct.quantity > 0) {
                prodToDecrease.quantity -= 1;
                console.log('Quantity Decreased');
                res.json({
                    success: true,
                    message: 'Product Quantity Reduced',
                    productQty: prodToDecrease
                });
                res.status(208);
            }

            // if (originalProduct !== "" && prodToDecrease.quantity <= 0){
            //     res.redirect('/remove-from-cart/' + prodToDecrease.prodId);
            //     console.log('Quantity Depleted \t Redirected to Remove Product');
            //     res.json({
            //         success: true,
            //         message: 'Product Quantity Depleted',
            //         productQty: null
            //     });
            //     res.status(209);
            // } else {
            //     prodToDecrease.quantity -= 1;
            //     console.log('Quantity Decreased');
            //     res.json({
            //         success: true,
            //         message: 'Product Quantity Reduced',
            //         productQty: prodToDecrease
            //     });
            //     res.status(208);
            // }

        }
    } catch (errors) {
        console.error(errors);
    }

});

router.get('/checkout', async (req, res) => {
    let cart = await Cart.find({});

    let qtyString = null;
    console.log(cart);

    // cart.forEach((data) => {
    //     for (var obj in data.cartItems) {
    //         console.log(data.cartItems[obj].quantity + ' x of ' + data.cartItems[obj].title);
    //     }
    // });

    if (cart !== "") {
        for (const {quantity, title} of cart) {
            console.log('%s of %s', quantity, title);
        }

        res.status(206)
            .json({
                success: true,
                message: 'Check-out Items',
                cartItems: cart
            });

    } else {
        res.status(207)
            .json({
                success: false,
                message: 'Can\'t Checkout Empty Cart'
                //cartItems: null
            });
    }

});

module.exports = router;