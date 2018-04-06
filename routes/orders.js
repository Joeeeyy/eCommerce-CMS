const express = require('express');
const router = express.Router();

const Category = require('../models/categories');
const Products = require('../models/products');
const Users = require('../models/users');
const Orders = require('../models/orders');

router.get('/', (req, res) => {
   Orders.find({})
       .select() // get projections
       .exec()
       .then(orders => {
           if (orders){
               res.status(201)
                   .json({
                        success: true,
                        message: 'All Orders',
                        data: {
                            orders
                        }
                   });
           }
       })
       .catch(errs => {
            throw errs;
       });
});

router.post('/add-order', (req, res) => {

});

router.post('/delete-order', (req, res) => {

});

module.exports = router;