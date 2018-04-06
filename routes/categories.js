const express = require('express');
const router = express.Router();

const Category = require('../models/categories');

router.get('/', (req, res) => {
    Category.find({})
        .select('_id title slug image') // get projections
        .exec()
        .then(categories => {
            if (categories){
                //res.set('Cache-Control', 'public, max-age=173200, max-stale=173200');
                res.status(201)
                    .json({
                        success: true,
                        message: 'All Categories',
                        categories: categories
                    });
            }
        })
        .catch(errs => {
            throw errs;
        });
});


module.exports = router;