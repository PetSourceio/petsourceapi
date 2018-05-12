const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/userRoutes');
routes(app);

app.use('/', swaggerUi.serve);
app.use('/', swaggerUi.setup(swaggerDocument));

app.listen(3000, () => console.log('Example app listening on port 3000!'));