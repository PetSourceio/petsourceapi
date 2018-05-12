const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');
var User = require('./api/models/userModel');
var mongoose = require('mongoose');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/PetSourceDB'); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var userRoutes = require('./api/routes/userRoutes');
userRoutes(app);
var petRoutes = require('./api/routes/petRoutes');
petRoutes(app);


app.use('/', swaggerUi.serve);
app.use('/', swaggerUi.setup(swaggerDocument));

app.listen(3000, () => console.log('Example app listening on port 3000!'));