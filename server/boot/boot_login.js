// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-example-user-management
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var dsConfig = require('../datasources.json');
var path = require('path');

module.exports = function(app) {
    // app.engine('html', require('ejs').renderFile);
    // app.set('view engine', 'html');

    var user = app.models.user;

    //login page
    app.get('/home', function(req, res) {
        var credentials = dsConfig.emailDs.transports[0].auth;
        res.render('login', {
            email: credentials.user,
            password: credentials.pass
        });
    });

    //verified
    app.get('/verified', function(req, res) {
        res.render('verified');
    });

    //log a user in
    app.post('/login', function(req, res) {
        user.login({
            email: req.body.email,
            password: req.body.password
            }, 'user', function(err, token) {
                console.log('login!!!')
                console.log(token)

                if (err) {
                    console.log('error')
                    console.log(err)
                    res.send(JSON.stringify(err))
                    return
                }
                else {
                    res.send(JSON.stringify(token))
                    return
                }

                // if (err) {
                //     if(err.details && err.code === 'LOGIN_FAILED_EMAIL_NOT_VERIFIED'){
                //         res.render('reponseToTriggerEmail', {
                //             title: 'Login failed',
                //             content: err,
                //             redirectToEmail: '/api/users/'+ err.details.userId + '/verify',
                //             redirectTo: '/',
                //             redirectToLinkText: 'Click here',
                //             userId: err.details.userId
                //         });
                //     } else {
                //         res.render('response', {
                //             title: 'Login failed. Wrong username or password',
                //             content: err,
                //             redirectTo: '/',
                //             redirectToLinkText: 'Please login again',
                //         });
                //     }
                //     return;
                // }
                // res.render('home', {
                //     email: req.body.email,
                //     accessToken: token.id,
                //     redirectUrl: '/api/account/change-password?access_token=' + token.id
                // });


                return
        });
    });

    //log a user out
    app.get('/logout', function(req, res, next) {
        if (!req.accessToken) return res.sendStatus(401);
            Account.logout(req.accessToken.id, function(err) {
                if (err) 
                    return next(err);
                res.redirect('/');
            });
    });

    //send an email with instructions to reset an existing user's password
    app.post('/request-password-reset', function(req, res, next) {
        Account.resetPassword({
            email: req.body.email
            }, function(err) {
                if (err) return res.status(401).send(err);

                res.render('response', {
                    title: 'Password reset requested',
                    content: 'Check your email for further instructions',
                    redirectTo: '/',
                    redirectToLinkText: 'Log in'
                });
        });
    });

    //show password reset form
    app.get('/reset-password', function(req, res, next) {
        if (!req.accessToken) return res.sendStatus(401);
        res.render('password-reset', {
        redirectUrl: '/api/users/reset-password?access_token='+
            req.accessToken.id
        });
    });

    // optinal facebook test
    app.get('/auth/account', function(req, res, next) {
        //console.log(req)
        res.send(JSON.stringify(req.user))
        return
    });
};