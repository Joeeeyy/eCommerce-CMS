const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const AdminUser = require('../models/adminUserModel');
const passport = require('passport');

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {

    passport.authenticate('local',{
        successRedirect:'/admin/home',
        failureRedirect: '/admin/auth/register',
        failureFlash: true
    })(req, res, next);

    // let email = req.body.email;
    // let password = req.body.password;

    // AdminUser.findOne({email: email})
    //     .exec()
    //     .then(admin => {
    //         if (admin) {
    //             console.log('Admin Pwd:\t' + admin.password);
    //             bcrypt.compare(password, admin.password, (err, match) => {
    //                 if (!err) {
    //                     console.log('Hash result:\t' + match);
    //                     if(match){
    //                         AdminUser.findById({_id: admin._id})
    //                             .select('username email _id')
    //                             .exec()
    //                             .then(data => {
    //                                 console.log('Ádmin Username:\t' + data.username);
    //                                 res.redirect('/admin/home');
    //                             })
    //                             .catch(errs => {
    //                                 throw errs;
    //                             });
    //                     }
    //                 } else {
    //                     throw err;
    //                 }
    //             });
    //
    //         } else {
    //             console.log('No Such User Exists');
    //             res.end;
    //         }
    //     })
    //     .catch(errs => {
    //         throw errs;
    //     })

});

router.get('/logout', (req, res) => {
    req.logout();
    res.render('login');
    //res.redirect('/admin/logout');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {

    req.checkBody('username', 'Enter Username').notEmpty();
    req.checkBody('email', 'Enter Valid Email').isEmail();
    req.checkBody('password', 'Enter Your Password').notEmpty();
    req.checkBody('confirmPass', 'Passwords Dont Match').equals(req.body.password);

    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    let passwordHash = null;
    bcrypt.hash(password, 10, (err, hash) => {
        passwordHash = hash;
        console.log('Pass Hash:\t' + passwordHash);

        let adminUser = new AdminUser({
            username: username,
            email: email,
            password: passwordHash
        });

        adminUser.save()
            .then(admin => {
                if (admin) {
                    let admin_id = admin._id;
                    console.log('Admin id:\t' + admin_id);

                    res.redirect('/admin/home');

                }
            })
            .catch(errs => {
                throw errs;
            });

    });

});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/admin/home');
}

module.exports = router;