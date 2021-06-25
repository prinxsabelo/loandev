require("dotenv").config({ path: "./config.env" });

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./middleware/error')
const app = express();

//BodyParser Middleware here..
app.use(bodyParser.json());
app.use(cors());

//Connecting to Mongo..
const db = require('./config/keys').mongoURI;
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(() => {
        console.log('MongoDb connected..');
    }).catch(err => {
        console.log(err);
    });

process.on("unhandledRejection", (err, promise) => {
    console.log(`What got wrong.. ${err}`);
});

const port = process.env.PORT || 5000;

//Routes..
const admin_auth = require('./routes/admin_auth');
const admin = require('./routes/admin');
const staff_auth = require('./routes/staff_auth');
const staff = require('./routes/staff');
app.use('/api/admin_auth', admin_auth);
app.use('/api/admin', admin);
app.use('/api/staff_auth', staff_auth);
app.use('/api/staff', staff);


//Error Hanldler * Should be last piece of middleware..
app.use(errorHandler);
app.listen(port, () => console.log(`Server started on port ${port}`));