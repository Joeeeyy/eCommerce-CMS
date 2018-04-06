const express = require('express');
const router = express.Router();
const JWT = require('jsonwebtoken');
const tokenConfig = require('../config/token_config');

const Users = require('../models/users');

router.post('/signup', (req, res) => {
        let name = req.body.name;
        let slug = name.replace(/\s+/g, '-').toLowerCase();
        let email = req.body.email;
        let phone = req.body.phone;

        let mUser = new Users({
            name: name,
            slug: slug,
            email: email,
            phone: phone
        });

        if (mUser == "") {
            res.status(403)
                .json({
                    success: false,
                    message: 'Empty User Object\n Enter all fields'
                });
        } else {
            mUser.save()
                .then(user => {
                    if (user){
                        console.log('User Object:\t' + user);
                        let token = JWT.sign({userId: user._id}, tokenConfig.secret, {expiresIn: 1200});
                        res.status(200)
                            .json({
                                success: true,
                                message: 'User Created',
                                token: token,
                                data: user
                            });
                    }
                })
                .catch(errs => {
                    throw errs;
                    console.log('Error Signing up:\t' + errs);
                });

        }
    }
);

router.post('/login', (req, res) => {

});

module.exports = router;