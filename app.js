const express = require('express');
const bodyParser = require('body-parser');
const colors = require('colors');

const db = require('./database/db');
const cors = require('cors');
const path = require('path');

const reg_route = require('./routes/registration_route');
const workRoute = require('./routes/workRoute');
const requestRoute = require('./routes/professionRoute');
const bookRoute = require('./routes/hireRoute');

const app = express();

app.use(cors());



app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.use('/images',express.static(path.join(__dirname,'/images')))
app.use(reg_route);
app.use(workRoute);
app.use(requestRoute);
app.use(bookRoute);

app.listen(90,console.log(`Server started at ${process.env.NODE_ENV} at port ${90}`.cyan.bold.underline));
