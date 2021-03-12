const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const route = require('./route');
const cors = require('cors');
app.use(cors());
// app
app.use(bodyParser.json({limit: 500}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(route);
app.listen(2001, ()=> console.log('server started'));