const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const userSchema = require('./model/user');
// user_profiles is database name and userSchema is table
const connection = 'mongodb://localhost:27017/user_profiles'
mongoose.connect(connection, {useUnifiedTopology: true, useNewUrlParser: true}, function(err, connect) {
    if (err) {
        console.log('Error', err);
    }
});
route.post('/reg', function(req, res) {
   const userData = new userSchema();
   userData.name = req.body.name;
   userData.lastname = req.body.lastname;
   userData.password = req.body.password;
   userData.username = req.body.username;
   console.log(userData);
   userData.save(function(err, save) {
       if(err) {
           res.send(err);
       } else {
           res.send(save);
       }
   });

});
route.post('/login', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    res.header('Access-Control-Allow-Origin', '*');
    console.log(username, password);
    userSchema.findOne({"username": username, "password": password}).exec((err, data) => {
        if (err) {
            res.send(err);
        } else if (data) {
            console.log(data)
            const token = jwt.sign({username: data.username, password: data.password}, '@#$%WE!@', {expiresIn: '7d'});
            const success = {
                message: 'successfully get token',
                userDetail: data,
                tokenData: token,
            }
            return res.status(200).send(success);
        } else {
            const success = {
                message: 'cannot found the user',
            }
            return res.status(400).send(success);
        }
    });
});
route.get('/home', checkToken, function(req, res) {
    const userDetail = req.userData;
    userSchema.findOne({'username': userDetail.username, 'password': userDetail.password}).exec((err, data) => {
        if (err) {
            res.send(err)
        } else if (data) {
            const successResponse = {
                message: 'welcome home page',
                detail: data,
            };
            return res.status(200).send(successResponse);
        }
    })
})
async function checkToken(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    await jwt.verify(token, '@#$%WE!@', function(err, data) {
        if (err) {
            res.send(err)
        } else {
           req.userData = data;
        }
    })
    next();

} 
module.exports = route;