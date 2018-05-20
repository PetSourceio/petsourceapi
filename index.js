const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');
var User = require('./api/models/userModel');
var Wallet = require('./api/models/walletModel');
var mongoose = require('mongoose');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
var mongoUrl = process.env.PROD_MONGODB || "mongodb://localhost/PetSourceDB";
var connectWithRetry = function() {
    return mongoose.connect(mongoUrl, function(err) {
        if (err) {
            console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
            setTimeout(connectWithRetry, 5000);
        }
        else {
            console.log('Connected to MongoDB.');
        }
    });
  };
connectWithRetry();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var userRoutes = require('./api/routes/userRoutes');
userRoutes(app);
var petRoutes = require('./api/routes/petRoutes');
petRoutes(app);

app.use('/', swaggerUi.serve);
app.use('/', swaggerUi.setup(swaggerDocument));

app.use(function (req, res, next) {
    res.status(404).send("Sorry, can't find that!")
});

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'));
