const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');
var User = require('./api/models/userModel');
var Wallet = require('./api/models/walletModel');
var mongoose = require('mongoose');
const logger = require("./api/utils/logger.js");

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

app.use("/logs", express.static(__dirname + '/logs/logs.log'));
app.use("/expressLogs", express.static(__dirname + '/logs/express.log'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var userRoutes = require('./api/routes/userRoutes');
userRoutes(app);
var petRoutes = require('./api/routes/petRoutes');
petRoutes(app);
var petSearchRoutes = require('./api/routes/petSearchRoutes');
petSearchRoutes(app);

app.use('/', swaggerUi.serve);
app.use('/', swaggerUi.setup(swaggerDocument));

app.use(function (req, res, next) {
    res.status(404).send("Sorry, can't find that!")
});

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'));

//Exception handling:
process.on("uncaughtException", function(err) {
    console.error(
      `${new Date().toUTCString()} uncaughtException: ${err.message} ${err.stack} process exit 1`
    );
    logger.error(
      `19 uncaughtException: ${err.message} ${err.stack} process exit 1`
    );
    // process.exit(1)
});

process.on("unhandledRejection", function(err) {
    console.error(
        `${new Date().toUTCString()} unhandledRejection: ${err.message} ${err.stack} process exit 1`
    );
    logger.error(
        `25 unhandledRejection: ${err.message} ${err.stack} process exit 1`
    );
    // process.exit(1)
});

app.use(logger.connectLogger());
