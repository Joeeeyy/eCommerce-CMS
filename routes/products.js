const express = require('express');
const Products = require('../models/products');

const router = express.Router();

// get all products
router.get('/', (req, res) => {

    let count = 0;

    Products.count( (err, values) => {
        count = values;
    });

    Products.find({})
        .select('title slug image desc price quantity category _id status rating')
        .exec()
        .then(data => {
            if (data) {
                console.log('All Products Data:\t' + data);
                res.status(200)
                    .json({
                        success: true,
                        message: 'All Products',
                        products: data
                    });
            } else {
                res.status(403)
                    .json({
                        success: false,
                        message: 'Error Getting All Products',
                        products: null
                    });
            }
        })
        .catch(error => {
            console.error(error);
            res.send('Error 404');
        });

});

// get products by category
router.get('/product-category/:category', (req, res) => {
    console.log(req.params.category);

    Products.find({category: req.params.category})
        .select('_id title slug desc price category image galleryImages')
        .exec()
        .then(result => {
            if (result) {
                res.status(200)
                    .json({
                        success: true,
                        message: 'Product Category Found',
                        data: result
                    });
            } else {
                res.status(402)
                    .json({
                        success: true,
                        message: 'No Such Category Exists',
                        data: null
                    });
            }
        })
        .catch(error => {
            if (error){
                console.error('Failed to find Category:\t' + error);
            }
            throw error;
        });

});

// get details of single product
router.get('/details/:productId', (req, res) => {
    let pId = req.params.productId;
    console.log('Single Product Id:\t' + pId);
    Products.findOne({_id: pId})
        .select()
        .exec()
        .then(product => {
            if (product){
                console.log('Single Product:\t' + product);
                res.status(200)
                    .json({
                        success: true,
                        message: 'Single Product Found',
                        data: product
                    });
            } else {
                res.status(204)
                    .json({
                        success: true,
                        message: 'Error...Product May Have Been Deleted!!',
                        data: null
                    });
            }
        })
        .catch(error => {
            throw error;
            console.error('Error fetching Single Product:\t' + error);
            res.status(500)
                .json({
                    success: false,
                    message: 'No Such Product Exists'
                });
        });
});

router.post('/rate-product/:productId', (req, res) => {

    let product_id = req.params.productId;
    console.log('Product Id:\t' + product_id);

    let prod_rating = [];
    prod_rating.push(req.body.rating);

    let len = prod_rating.length;
    console.log('Length of rating array:\t' + len);

    let sum = 0;
    for (let i = 0; i < prod_rating.length; i++){
        sum = sum + prod_rating[i];
        console.log('Rating array Sum:\t' + sum);
    }

    let avg_rating = (sum) / len;
    console.log('Avg Rating:\t' + avg_rating);

    Products.findOne({_id: {'$ne': product_id}})
        .exec()
        .then(product => {
           if (product){
                Products.findById({_id: product_id})
                    .exec()
                    .then(result => {
                       if (result){
                           console.log(result);
                           // result.rating = rating;
                           // result.save()
                           //     .then(body => {
                           //         if (body){
                           //             console.log('Rating Saved');
                           //         }
                           //     })
                           //     .catch(e => {
                           //         console.error('Error Saving Rating:\t' + e);
                           //     });
                       }
                    })
                    .catch(error => {
                        console.error(error);
                    });
           }
        })
        .catch(err => {
            console.error(err);
        });

});

module.exports = router;